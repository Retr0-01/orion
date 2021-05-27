const Discord = require("discord.js");
const mongoose = require("mongoose");
const fs = require("fs");
const pm2 = require("pm2");
const info = require("../package.json");
const { token, devs, webhooks, database } = require("./config.json");
const devHook = new Discord.WebhookClient(webhooks.devLog.id, webhooks.devLog.token);

// First things first, create our Discord client.
const client = new Discord.Client();

// Create a collection for commands, aliases and the music queue.
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.voiceQueue = new Discord.Collection();

// Command Handler
fs.readdirSync(`${__dirname}/commands/`).forEach(dir =>
{
	// Get and filter the commands.
	const commands = fs.readdirSync(`${__dirname}/commands/${dir}/`).filter(file => file.endsWith(".js"));

	for (let file of commands)
	{
		// Pull the commands and add them to the collection.
		let pull = require(`${__dirname}/commands/${dir}/${file}`);
		if (pull.name)
		{
			client.commands.set(pull.name, pull);
			console.log(`[COMMAND HANDLER] - Command "${file.split(".")[0]}" loaded.`);
		}
		else
		{
			// If a file has errors or is not using the needed template, log this and continue.
			console.log(`[COMMAND HANDLER] - Command "${file.split(".")[0]}" failed to load.`);
			continue;
		}
		// Get every alias.
		if (pull.aliases && Array.isArray(pull.aliases)) pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
	}
});

// Event Handler
fs.readdir(`${__dirname}/events/`, (err, files) =>
{
	if (err) return console.error(err);
	files.forEach(file =>
	{
		// Define every event.
		const event = require(`${__dirname}/events/${file}`);
		// Get every event name.
		let eventName = file.split(".")[0];
		// Bind the events.
		client.on(eventName, event.bind(null, client));
		// Log every event.
		console.log(`[EVENT HANDLER] - Event "${eventName}" loaded.`);
	});
});

// Create our client from the function at the bottom.
initiateClient();

// Bind our process events...
process.on("uncaughtException", async (err) =>
{
	console.error(err);

	devHook.send(`<@${devs.join("> <@")}>`);
	const errorEmbed = new Discord.MessageEmbed()
		.setColor("DARK_RED")
		.setTitle("Process Crashed")
		.setDescription("The process crashed! Check the error log immediately!")
		.setTimestamp();
	devHook.send(errorEmbed);
	await devHook.send(`\`\`\`\n${err}\n\`\`\``);

	shutdown("uncaughtException", 1, true);
}).on("unhandledRejection", async (err) =>
{
	console.error(err);

	devHook.send(`<@${devs.join("> <@")}>`);
	const errorEmbed = new Discord.MessageEmbed()
		.setColor("DARK_RED")
		.setTitle("Process Crashed")
		.setDescription("The process crashed! Check the error log immediately!")
		.setTimestamp();
	devHook.send(errorEmbed);
	await devHook.send(`\`\`\`\n${err}\n\`\`\``);

	shutdown("unhandledRejection", 1, true);
}).on("warning", (err) =>
{
	console.warn(err);

	const warnEmbed = new Discord.MessageEmbed()
		.setColor("ORANGE")
		.setTitle("Process Warn")
		.setDescription("The process threw a warning!")
		.setTimestamp();
	devHook.send(warnEmbed);
	devHook.send(`\`\`\`\n${err}\n\`\`\``);
});

// and our db events.
mongoose.connection.on("connected", () =>
{
	console.log(`[DATABASE] - Successfully connected to the ${database.dbToConnect} database as ${database.username}.`);
}).on("close", () =>
{
	console.log("[DATABASE] - Successfully disconnected from the database.");
}).on("error", async (err) =>
{
	console.error(err);

	devHook.send(`<@${devs.join("> <@")}>`);
	const errorEmbed = new Discord.MessageEmbed()
		.setColor("DARK_RED")
		.setTitle("Database Error")
		.setDescription("A database error occurred! Check the error log immediately!")
		.setTimestamp();
	devHook.send(errorEmbed);
	await devHook.send(`\`\`\`\n${err}\n\`\`\``);

	shutdown("DB Error", 1, true);
});

// This will allow a graceful restart/reload/stop.
process.on("SIGINT", () =>
{
	shutdown("SIGINT", 0, false);
}).on("SIGTERM", () =>
{
	shutdown("SIGTERM", 0, false);
});

// For Windows.
if (process.platform === "win32")
{
	process.on("message", async (msg) =>
	{
		if (msg === "shutdown")
		{
			shutdown("shutdown", 0, false);
		}
	});
}

/**
 * Connect to the database, Discord and start our process.
 */
async function initiateClient()
{
	// Mongoose connection options in order to avoid some deprecation warnings.
	const dbConnectionOptions =
	{
		"useNewUrlParser": true,
		"useUnifiedTopology": true,
		"useFindAndModify": false
	};

	// Connect to the database...
	await mongoose.connect(`mongodb+srv://${database.username}:${database.password}@${database.host}/${database.dbToConnect}?${database.options}`, dbConnectionOptions);

	// and finally, login our client.
	await client.login(token);

	// Signal PM2 that we are ready to run.
	process.send("ready");
}

/**
 * Actions to do before we end the process and disconnect.
 *
 * @param {string} message - The type of message received.
 * @param {number} exitCode - The code the process will exit with, either 0 or 1.
 * @param {boolean} stopPM2 - Wether or not to stop PM2. If true, the bot will stop completely.
 */
async function shutdown(message, exitCode, stopPM2)
{
	console.log(`[PROCESS] - Received a(n) ${message} signal from the process.\n[PROCESS] - The bot was reloaded/restarted or stopped.`);

	const shutdownEmbed = new Discord.MessageEmbed()
		.setColor("DARK_BLUE")
		.setTitle("Process Status Update")
		.setDescription(`Received a(n) ${message} signal from the process.\nThe bot was reloaded/restarted or stopped.`)
		.setTimestamp();
	await devHook.send(shutdownEmbed);

	client.destroy();
	mongoose.disconnect();
	if (stopPM2 === true) pm2.stop(info.name);
	process.exit(exitCode);
}

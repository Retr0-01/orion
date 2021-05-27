const Discord = require("discord.js");
const { devs, webhooks, botStatus } = require("../../config.json");
const devHook = new Discord.WebhookClient(webhooks.devLog.id, webhooks.devLog.token);

module.exports =
{
	name: "setactivity",
	aliases: ["client_activity"],
	description: "Set the bot's activity.",
	category: "Dev",
	usage: "['default' | 'playing' | 'streaming' | 'listening' | 'watching' | 'competing'] [text to display]",
	run: async (client, message, args) =>
	{
		// Define the activity types.
		let activityTypes = ["playing", "streaming", "listening", "watching", "competing"];

		// If the author is not a dev return this.
		const noPermEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Invalid Permissions")
			.setDescription("This is a developer command, you can't execute it.")
			.setTimestamp();
		if (!devs.includes(message.author.id)) return message.reply(noPermEmbed);

		// If there is no activity type provided return this.
		const noTypeEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Error")
			.setDescription("Please provide the type of the activity.")
			.setTimestamp();
		if (!args[0]) return message.reply(noTypeEmbed);

		// If the argument is the keyword 'default', set the default activity.
		if (args[0] === "default") return setDefault();

		// If the argument doesn't match the activity types return this.
		const invalidTypeEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Error")
			.setDescription(`That's not a valid type.\nThe activity types are: ${activityTypes.join(", ")}.`)
			.setTimestamp();
		if (!activityTypes.includes(args[0])) return message.reply(invalidTypeEmbed);

		// If there is no second argument (the text to display) provided return this.
		const noTextEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Error")
			.setDescription("Please provide more arguments.")
			.setTimestamp();
		if (!args[1]) return message.reply(noTextEmbed);

		// Set the bot's activity.
		var finalActivity = args[0];
		client.user.setActivity(args.slice(1).join(" "), { type: finalActivity.toUpperCase() });

		const activitySetEmbed = new Discord.MessageEmbed()
			.setColor("GREEN")
			.setDescription("Successfully set the bot's activity.")
			.setTimestamp();
		message.channel.send(activitySetEmbed);

		// Get the dev log webhook and send this embed.
		const devWebhookEmbed = new Discord.MessageEmbed()
			.setColor("DARK_GREEN")
			.setTitle("Activity Change")
			.setDescription(`By: ${message.author.tag}\nActivity: ${finalActivity} ${args.slice(1).join(" ")}`)
			.setTimestamp();
		devHook.send(devWebhookEmbed);

		console.log(`[DEV] - ${message.author.tag} changed the bot's activity to "${finalActivity} ${args.slice(1).join(" ")}".`);

		// The set default function, used if the keyword default is used.
		function setDefault()
		{
			client.user.setActivity(botStatus.activity, { type: botStatus.activityType });

			const defaultActivitySetEmbed = new Discord.MessageEmbed()
				.setColor("GREEN")
				.setDescription("Successfully set the bot's activity to the default.")
				.setTimestamp();
			message.channel.send(defaultActivitySetEmbed);

			// Get the dev log webhook and send this embed.
			const devWebhook2Embed = new Discord.MessageEmbed()
				.setColor("DARK_GREEN")
				.setTitle("Activity Change")
				.setDescription(`By: ${message.author.tag}\nActivity: default`)
				.setTimestamp();
			devHook.send(devWebhook2Embed);

			console.log(`[DEV] - ${message.author.tag} changed the bot's activity to the default.`);
		}
	}
};

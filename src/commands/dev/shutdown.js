const Discord = require("discord.js");
const pm2 = require("pm2");
const { devs, webhooks } = require("../../config.json");
const devHook = new Discord.WebhookClient(webhooks.devLog.id, webhooks.devLog.token);
const info = require("../../../package.json");

module.exports =
{
	name: "shutdown",
	aliases: ["sd"],
	description: "Terminates the connection with Discord, the database and stops the process.",
	category: "Dev",
	run: async (client, message) =>
	{
		// If the author is not a dev return this.
		const noPermEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Invalid Permissions")
			.setDescription("This is a developer command, you can't execute it.")
			.setTimestamp();
		if (!devs.includes(message.author.id)) return message.reply(noPermEmbed);

		// Sent the confirmation embed.
		const shutdownEmbed = new Discord.MessageEmbed()
			.setColor("#2c3334")
			.setTitle("Bot Shutdown")
			.setDescription(`${message.author.username} has terminated ${client.user.username}.`);
		message.channel.send(shutdownEmbed);

		// Get the dev log webhook and send this embed.
		const devWebhookEmbed = new Discord.MessageEmbed()
			.setColor("DARK_RED")
			.setTitle("Shutdown")
			.setDescription(`By: ${message.author.tag}`)
			.setTimestamp();
		devHook.send(devWebhookEmbed);

		console.log(`[DEV] - Bot shutdown by ${message.author.tag}`);

		pm2.stop(info.name);
	}
};

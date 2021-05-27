const Discord = require("discord.js");
const { devs, webhooks } = require("../../config.json");
const devHook = new Discord.WebhookClient(webhooks.devLog.id, webhooks.devLog.token);

module.exports =
{
	name: "setstatus",
	aliases: ["client_status"],
	description: "Set the bot's status.",
	category: "Dev",
	usage: "['online' | 'idle' | 'invisible' | 'dnd']",
	run: async (client, message, args) =>
	{
		// Define the status types.
		let statusTypes = ["online", "idle", "invisible", "dnd"];

		// If the author is not a dev return this.
		const noPermEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Invalid Permissions")
			.setDescription("This is a developer command, you can't execute it.")
			.setTimestamp();
		if (!devs.includes(message.author.id)) return message.reply(noPermEmbed);

		// If there is no status type provided return this.
		const noTypeEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Error")
			.setDescription("Please provide the status type.")
			.setTimestamp();
		if (!args[0]) return message.reply(noTypeEmbed);

		// If the argument doesn't match the status types return this.
		const invalidTypeEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Error")
			.setDescription(`That's not a valid type.\nThe status types are: ${statusTypes}`)
			.setTimestamp();
		if (!statusTypes.includes(args[0])) return message.reply(invalidTypeEmbed);

		// Set the bot's status.
		client.user.setStatus(args[0]);

		const defaultAvatarSetEmbed = new Discord.MessageEmbed()
			.setColor("GREEN")
			.setDescription(`Successfully set the bot's status to "${args[0]}".`)
			.setTimestamp();
		message.channel.send(defaultAvatarSetEmbed);

		// Get the dev log webhook and send this embed.
		const devWebhookEmbed = new Discord.MessageEmbed()
			.setColor("DARK_GREEN")
			.setTitle("Status Change")
			.setDescription(`By: ${message.author.tag}\nStatus: ${args[0]}`)
			.setTimestamp();
		devHook.send(devWebhookEmbed);

		console.log(`[DEV] - ${message.author.tag} changed the bot's status to "${args[0]}".`);
	}
};

const Discord = require("discord.js");
const { devs, webhooks } = require("../../config.json");
const devHook = new Discord.WebhookClient(webhooks.devLog.id, webhooks.devLog.token);

module.exports =
{
	name: "setavatar",
	aliases: ["client_avatar"],
	description: "Set the bot's avatar.",
	category: "Dev",
	usage: "['default' | image link]",
	run: async (client, message, args) =>
	{
		// If the author is not a dev return this.
		const noPermEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Invalid Permissions")
			.setDescription("This is a developer command, you can't execute it.")
			.setTimestamp();
		if (!devs.includes(message.author.id)) return message.reply(noPermEmbed);

		// If there is no attachment provided return this.
		const noImageEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Error")
			.setDescription("Please provide an image **link** for the avatar.\nYou can also use the 'default' keyword to set it to the default avatar.")
			.setTimestamp();
		if (!args[0]) return message.reply(noImageEmbed);

		// If the argument is the keyword 'default', set the default avatar and send a confirmation embed.
		if (args[0] === "default") return setDefault();

		try
		{
			client.user.setAvatar(args[0]);

			const avatarSetEmbed = new Discord.MessageEmbed()
				.setColor("GREEN")
				.setDescription("Successfully set the bot's avatar.")
				.setTimestamp();
			message.channel.send(avatarSetEmbed);

			// Get the dev log webhook and send this embed.
			const devWebhookEmbed = new Discord.MessageEmbed()
				.setColor("DARK_GREEN")
				.setTitle("Avatar Change")
				.setDescription(`By: ${message.author.tag}\nAvatar: (Link)[${args[0]}]`)
				.setTimestamp();
			devHook.send(devWebhookEmbed);

			console.log(`[DEV] - ${message.author.tag} changed the bot's avatar.`);
		}
		catch
		{
			const invalidImageEmbed = new Discord.MessageEmbed()
				.setColor("RED")
				.setTitle("Error")
				.setDescription("Couldn't set the bot's avatar. Make sure it's a valid image link.")
				.setTimestamp();
			message.channel.send(invalidImageEmbed);
		}

		function setDefault()
		{
			client.user.setAvatar("./util/images/orion.jpg");

			const defaultAvatarSetEmbed = new Discord.MessageEmbed()
				.setColor("GREEN")
				.setDescription("Successfully set the bot's avatar to the default.")
				.setTimestamp();
			message.channel.send(defaultAvatarSetEmbed);

			// Get the dev log webhook and send this embed.
			const devWebhookEmbed = new Discord.MessageEmbed()
				.setColor("DARK_GREEN")
				.setTitle("Avatar Change")
				.setDescription(`By: ${message.author.tag}\nAvatar: default`)
				.setTimestamp();
			devHook.send(devWebhookEmbed);

			console.log(`[DEV] - ${message.author.tag} changed the bot's avatar to the default.`);
		}
	}
};

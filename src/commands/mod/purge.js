const Discord = require("discord.js");
const guildsConfigModel = require("../../util/models/guildsConfig");

module.exports =
{
	name: "purge",
	aliases: ["clear", "nuke"],
	description: "Bulk delete messages in a channel.",
	category: "Mod",
	usage: "[#channel] [amount]",
	run: async (client, message, args) =>
	{
		// If the member executing the command doesn't have the permission return this.
		const noPermissionEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Invalid Permissions")
			.setDescription("You need the **Kick Members** permission to execute this command.")
			.setTimestamp();
		if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply(noPermissionEmbed);

		// If there are no args return this.
		const noArgsEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Error")
			.setDescription("Please provide more arguments.")
			.setTimestamp();
		if (!args[0]) return message.reply(noArgsEmbed);

		// Get the channel we want to purge from the mention
		let channelToPurge = message.mentions.channels.first();

		// If there is no channel mentioned return this.
		const noChannelEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Error")
			.setDescription("Please provide a channel to purge.")
			.setTimestamp();
		if(!channelToPurge) return message.reply(noChannelEmbed);

		// Make sure it's a valid number, if not, return this.
		const invalidEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Error")
			.setDescription("Make sure you didn't enter zero, a negative number or even a letter.")
			.setTimestamp();
		if (isNaN(args[1]) || parseInt(args[1]) <= 1) return message.reply(invalidEmbed);

		// If the bot doesn't have the permission return this embed.
		const noBotPermissionEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Error")
			.setDescription("I do not have the required permission to do that!")
			.setTimestamp();
		if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) return message.reply(noBotPermissionEmbed);

		// Fetch the server's config data.
		guildsConfigModel.findOne({ serverID: message.guild.id }, (err, serverData) =>
		{
			if (err) return console.error(err);

			let amountToDelete;

			// Set the limit.
			if (parseInt(args[1]) > 100) amountToDelete = 100;
			else amountToDelete = parseInt(args[1]);

			// Purge the channel.
			channelToPurge.bulkDelete(amountToDelete);

			// Create and send the success embed.
			const purgedEmbed = new Discord.MessageEmbed()
				.setColor("GREEN")
				.setDescription(`**Successfully deleted \`${amountToDelete}\` messages in** ${channelToPurge}`)
				.setFooter(`Moderator: ${message.author.tag}`)
				.setTimestamp();
			message.channel.send(purgedEmbed);

			// If there is a logs channel defined create and try to send the log embed.
			if (serverData.logging.modLogChannelID !== "None Set")
			{
				const invalidLogChannelEmbed = new Discord.MessageEmbed()
					.setColor("RED")
					.setTitle("Error")
					.setDescription("Couldn't send the log embed, please update your modlog channel.")
					.setTimestamp();

				const logEmbed = new Discord.MessageEmbed()
					.setColor("AQUA")
					.setTitle("Channel Purged")
					.addFields
					(
						{ name: "Moderator", value: message.author.tag },
						{ name: "Channel", value: channelToPurge },
						{ name: "Amount", value: `${amountToDelete} messages` },
					)
					.setTimestamp();
				try
				{
					client.channels.fetch(`${serverData.logging.modLogChannelID}`)
						.then(logs => logs.send(logEmbed));
				}
				catch(err)
				{
					message.channel.send(invalidLogChannelEmbed);
				}
			}
		});
	}
};

const Discord = require("discord.js");
const guildsConfigModel = require("../../util/models/guildsConfig");

module.exports =
{
	name: "kick",
	description: "Kick a member from the current server.",
	category: "Mod",
	usage: "[Discord ID | Mention]",
	run: async (client, message, args) =>
	{
		// Get the member we want to kick from the mention
		const memberToKick = message.mentions.members.first();

		// If the member executing the command doesn't have the permission return this.
		const noPermissionEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Invalid Permissions")
			.setDescription("You need the **Kick Members** permission to execute this command.")
			.setTimestamp();
		if(!message.member.hasPermission("KICK_MEMBERS")) return message.reply(noPermissionEmbed);

		// If there are no args return this .
		const noMentionEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Error")
			.setDescription("You need to mention the user you want to kick.")
			.setTimestamp();
		if(!args[0]) return message.reply(noMentionEmbed);

		// If the member that is about to get kicked has the permission return this.
		const cannotKickEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Error")
			.setDescription("I can't kick that member!")
			.setTimestamp();
		if (memberToKick.hasPermission("KICK_MEMBERS")) return message.reply(cannotKickEmbed);

		// If the bot doesn't have the permission return this.
		const noBotPermissionEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Error")
			.setDescription("I do not have the required permission to do that!")
			.setTimestamp();
		if (!message.guild.me.hasPermission("KICK_MEMBERS")) return message.reply(noBotPermissionEmbed);

		// Fetch the server's config data.
		guildsConfigModel.findOne({ serverID: message.guild.id }, (err, serverData) =>
		{
			if (err) return console.error(err);

			// Create the reason for the kick.
			let reason = args.slice(1).join(" ");

			// If there is no reason add this as a reason.
			if(!reason) reason = "No reason provided.";

			// If the server has DM on Action enabled (true), create and send the embed to the member.
			if (serverData.moderation.dmOnAction === true)
			{
				const DMEmbed = new Discord.MessageEmbed()
					.setColor("RED")
					.setTitle("Kicked")
					.setDescription(`You have been **kicked** from __${message.guild.name}__\n**Reason:** ${reason}`)
					.setTimestamp();
				memberToKick.send(DMEmbed);
			}

			// Kick the member (1 sec delay must be used in order to DM the embed).
			setTimeout(function()
			{
				memberToKick.kick(`${reason} - Mod: ${message.author.tag}`);
			}, 1000);

			// Create and send the success embed in the channel.
			const kickedEmbed = new Discord.MessageEmbed()
				.setColor("GREEN")
				.setDescription(`**Successfully kicked** ${memberToKick}\n**Reason: ${reason}**`)
				.setFooter(`Moderator: ${message.author.tag}`)
				.setTimestamp();
			message.channel.send(kickedEmbed);

			// If logging is enabled get the modlog channel ID and log the kick.
			if (serverData.logging.modLogChannelID !== "None Set")
			{
				const invalidLogChannelEmbed = new Discord.MessageEmbed()
					.setColor("RED")
					.setTitle("Error")
					.setDescription("Couldn't send the log embed, please update your modlog channel.")
					.setTimestamp();

				const logEmbed = new Discord.MessageEmbed()
					.setColor("ORANGE")
					.setTitle("Member Kicked")
					.addFields
					(
						{ name: "Moderator", value: message.author.tag },
						{ name: "Member", value: memberToKick },
						{ name: "Reason", value: reason }
					)
					.setTimestamp();
				client.channels.fetch(`${serverData.logging.modLogChannelID}`)
					.then(logs => logs.send(logEmbed))
					.catch(message.channel.send(invalidLogChannelEmbed));
			}
		});
	}
};

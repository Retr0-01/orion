const Discord = require("discord.js");
const guildsConfigModel = require("../../util/models/guildsConfig");

module.exports =
{
	name: "ban",
	description: "Ban a member from the current server.",
	category: "Mod",
	usage: "[Discord ID | Mention]",
	run: async (client, message, args) =>
	{
		// Get the member we want to ban from the mention
		const memberToBan = message.mentions.members.first();

		// If the member executing the command doesn't have the permission return this.
		const noPermissionEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Invalid Permissions")
			.setDescription("You need the **Ban Members** permission to execute this command.")
			.setTimestamp();
		if(!message.member.hasPermission("BAN_MEMBERS")) return message.reply(noPermissionEmbed);

		// If there are no args return this.
		const noMentionEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Error")
			.setDescription("You need to mention the user you want to ban.")
			.setTimestamp();
		if(!args[0]) return message.reply(noMentionEmbed);

		// If the member that is about to get banned has the permission return this.
		const cannotBanEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Error")
			.setDescription("I can't ban that member!")
			.setTimestamp();
		if (memberToBan.hasPermission("BAN_MEMBERS")) return message.reply(cannotBanEmbed);

		// If the bot doesn't have the permission return this.
		const noBotPermissionEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Error")
			.setDescription("I do not have the required permission to do that!")
			.setTimestamp();
		if (!message.guild.me.hasPermission("BAN_MEMBERS")) return message.reply(noBotPermissionEmbed);

		// Fetch the server's config data.
		guildsConfigModel.findOne({ serverID: message.guild.id }, (err, serverData) =>
		{
			if (err) return console.error(err);

			// Create the reason for the ban.
			let reason = args.slice(1).join(" ");

			// If there is no reason add this as a reason.
			if(!reason) reason = "No reason provided.";

			// If the server has DM on Action enabled (true), create and send the embed to the member.
			if (serverData.dmOnAction === true)
			{
				const DMEmbed = new Discord.MessageEmbed()
					.setColor("RED")
					.setTitle("Banned")
					.setDescription(`You have been **banned** from __${message.guild.name}__\n**Reason:** ${reason}`)
					.setTimestamp();
				memberToBan.send(DMEmbed);
			}

			// Ban the member (1 sec delay must be used in order to DM the embed).
			setTimeout(function()
			{
				memberToBan.ban({ days: 7, reason: `${reason} - Mod: ${message.author.tag}` });
			}, 1000);

			// Create and send the success embed in the channel.
			const bannedEmbed = new Discord.MessageEmbed()
				.setColor("GREEN")
				.setDescription(`**Successfully banned** ${memberToBan}\n**Reason: ${reason}**`)
				.setFooter(`Moderator: ${message.author.tag}`)
				.setTimestamp();
			message.channel.send(bannedEmbed);

			// If logging is enabled get the modlog channel ID and log the ban.
			if (serverData.logging.modLogChannelID !== "None Set")
			{
				const invalidLogChannelEmbed = new Discord.MessageEmbed()
					.setColor("RED")
					.setTitle("Error")
					.setDescription("Couldn't send the log embed, please update your modlog channel.")
					.setTimestamp();

				const logEmbed = new Discord.MessageEmbed()
					.setColor("RED")
					.setTitle("Member Banned")
					.addFields
					(
						{ name: "Moderator", value: message.author.tag },
						{ name: "Member", value: memberToBan },
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

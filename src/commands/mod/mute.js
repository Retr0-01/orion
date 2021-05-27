const Discord = require("discord.js");
const config = require("../../config.json");

module.exports =
{
	name: "mute",
	description: "Mute a member in the current server.",
	category: "Mod",
	usage: "[duration in hours] [Discord ID | Mention]",
	run: async (client, message, args) =>
	{
		const noPermEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Invalid Permissions")
			.setDescription("You need the **Kick Members** permission to execute this command.")
			.setTimestamp();

		const noMentionEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Error")
			.setDescription("You need to mention the user you want to mute.")
			.setTimestamp();

		const noDurationEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Error")
			.setDescription("You need to add the duration you want to mute **in hours**.")
			.setTimestamp();

		const invalidEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Error")
			.setDescription("Make sure you didn't enter a duration that is either negative or 0 or even a letter.")
			.setTimestamp();

		const noReasonEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Error")
			.setDescription("You need to enter the reason you want to mute this user.")
			.setTimestamp();

		const cannotMuteEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Error")
			.setDescription("I can't mute that member!")
			.setTimestamp();

		const hasRoleEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Error")
			.setDescription("This member is already muted!")
			.setTimestamp();

		const logs = client.channels.cache.get(config.logsChannel);

		if(message.member.hasPermission("KICK_MEMBERS"))
		{
			const memberToMute = message.mentions.members.first();
			var muteDuration = args[1] * 3600000;
			let mutedRole = config.mutedRole;

			if(!args[0]) return message.reply(noMentionEmbed);

			if(memberToMute.roles.cache.has(mutedRole)) return message.reply(hasRoleEmbed);

			if(!args[1]) return message.reply(noDurationEmbed);

			if (isNaN(args[1]) || parseInt(args[1]) <= 0) return message.reply(invalidEmbed);

			if(!args[2]) return message.reply(noReasonEmbed);

			if (memberToMute.hasPermission("KICK_MEMBERS"))
			{
				return message.reply(cannotMuteEmbed);
			}
			else
			{
				const mutedEmbed = new Discord.MessageEmbed()
					.setColor("GREEN")
					.setDescription(`**Successfully muted** ${memberToMute} **for ${args[1]} hour(s).** \n**Reason: ${args.slice(2).join(" ")}**`)
					.setFooter(`Moderator: ${message.author.tag}`)
					.setTimestamp();

				const DMEmbed = new Discord.MessageEmbed()
					.setColor("RED")
					.setTitle("Muted")
					.setDescription(`You have been **muted** in Creators.TF for **${args[1]} hour(s).** \n**Reason: ${args.slice(2).join(" ")}**`)
					.setTimestamp();

				const logEmbed = new Discord.MessageEmbed()
					.setColor("RED")
					.setTitle("Member Muted")
					.addFields
					(
						{ name: "Moderator", value: message.author.tag },
						{ name: "Member", value: memberToMute },
						{ name: "Duration", value: `${args[1]} hour(s)` },
						{ name: "Reason", value: args.slice(2).join(" ") }
					)
					.setTimestamp();

				const muteOverLogEmbed = new Discord.MessageEmbed()
					.setColor("GREEN")
					.setTitle("Member Unmuted")
					.addFields
					(
						{ name: "Moderator", value: "Auto" },
						{ name: "Member", value: memberToMute },
					)
					.setTimestamp();

				memberToMute.send(DMEmbed);
				memberToMute.roles.add(mutedRole, args.slice(2).join(" "));
				message.channel.send(mutedEmbed);
				console.log(`${message.author.tag} muted a member for ${args[1]} hour(s)!`);
				logs.send(logEmbed);

				setTimeout(function()
				{
					memberToMute.roles.remove(mutedRole, "Auto-unmute");
					logs.send(muteOverLogEmbed);
					console.log("Successfully auto-unmuted a user");
				}, muteDuration);
			}
		}
		else
		{
			return message.reply(noPermEmbed);
		}
	}
};

const Discord = require("discord.js");

module.exports =
{
	name: "say",
	aliases: ["bc", "broadcast"],
	description: "Send a message as the bot.",
	category: "Mod",
	usage: "[text to send]",
	run: async (client, message, args) =>
	{
		// If the member executing the command doesn't have the permission, return this.
		const noPermEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Invalid Permissions")
			.setDescription("You need the **Manage Messages** permission to execute this command.")
			.setTimestamp();

		// If there are no args return this.
		const noArgsEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Error")
			.setDescription("You need to provide more arguments!")
			.setTimestamp();

		if (message.member.hasPermission("MANAGE_MESSAGES"))
		{
			if(!args[0]) return message.reply(noArgsEmbed);

			if (message.content.includes("embed"))
			{
				const sayEmbed = new Discord.MessageEmbed()
					.setColor("ORANGE")
					.setDescription(args.slice(1).join(" "))
					.setTimestamp();
				message.delete();
				return message.channel.send(sayEmbed);
			}

			message.delete();
			return message.channel.send(args.join(" "));
		}
		else
		{
			return message.reply(noPermEmbed);
		}
	}
};

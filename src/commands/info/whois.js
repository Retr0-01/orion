const Discord = require("discord.js");

module.exports =
{
	name: "whois",
	aliases: ["who", "user"],
	description: "Search a server member.",
	category: "Info",
	usage: "(Discord ID | Mention)",
	run: (client, message) =>
	{
		let user = message.mentions.users.first();
		let muser = message.guild.member(message.mentions.users.first());

		if (!muser) muser = message.member;
		if (!user) user = message.author;

		const status =
        {
        	online: "Online",
        	idle: "Idle",
        	dnd: "Do Not Disturb",
        	offline: "Offline/Invisible"
        };

		const isBot =
        {
        	true: "Yes",
        	false: "No"
        };

		// const badges = [];

		var memberJoined = muser.joinedAt.toString().split(" ");
		var userCreated = user.createdAt.toString().split(" ");

		const whoisEmbed = new Discord.MessageEmbed()
			.setTitle(user.tag)
			.setDescription(`<@${user.id}>`)
			.setThumbnail(`${user.avatarURL()}`)
			.addFields
			(
				{ name: "Flags", value: user.flags },
				{ name: "Currently", value: `${status[user.presence.status]}` },
				{ name: "Joined Server", value: memberJoined[2] + " " + memberJoined[1] + " " + memberJoined[3] },
				{ name: "Joined Discord", value: userCreated[2] + " " + userCreated[1] + " " + userCreated[3] },
				{ name: "Is Bot", value: `${isBot[user.bot]}` },
				{ name: "Roles", value: `${muser.roles.cache.array()}` },
			)
			.setFooter(`ID: ${user.id}`)
			.setTimestamp();
		try
		{
			whoisEmbed.setColor(muser.roles.color.color);
		}
		catch(err)
		{
			whoisEmbed.setColor("#2c3334");
		}
		message.channel.send(whoisEmbed);
	}
};

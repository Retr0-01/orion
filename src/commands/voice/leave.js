const Discord = require("discord.js");

module.exports =
{
	name: "leave",
	aliases: ["disconnect"],
	description: "Make the bot disconnect to the voice channel you are on.",
	category: "Voice",
	run: async (client, message) =>
	{
		const no = new Discord.MessageEmbed()
			.setColor("RED")
			.setDescription("no");
		message.reply(no);
	}
};

const Discord = require("discord.js");

module.exports =
{
	name: "reverse",
	description: "Reverse your text.",
	category: "Fun",
	usage: "[text to reverse]",
	run: async (client, message, args) =>
	{
		const noArgsEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Error")
			.setDescription("Please specify the text you want to reverse.")
			.setTimestamp();
		if (!args[0]) return message.reply(noArgsEmbed);

		// Send the reversed text.
		message.channel.send(args.join(" ").split("").reverse().join(""));
	}
};

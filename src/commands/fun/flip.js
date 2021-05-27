const Discord = require("discord.js");

module.exports =
{
	name: "flip",
	description: "Flip your text.",
	category: "Fun",
	usage: "[text to flip]",
	run: async (client, message, args) =>
	{
		// Define the flipped characters and the offset.
		const mapping = "¡\"#$%⅋,)(*+'-˙/0ƖᄅƐㄣϛ9ㄥ86:;<=>?@∀qƆpƎℲפHIſʞ˥WNOԀQɹS┴∩ΛMX⅄Z[/]^_`ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz{|}~";
		const OFFSET = "!".charCodeAt(0);

		// If there are no arguments return this.
		const noArgsEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Error")
			.setDescription("Please specify the text you want to flip.")
			.setTimestamp();
		if (!args[0]) return message.reply(noArgsEmbed);

		// Send the flipped message.
		message.channel.send(
			args.join(" ").split("")
				.map(c => c.charCodeAt(0) - OFFSET)
				.map(c => mapping[c] || " ")
				.reverse().join("")
		);
	}
};

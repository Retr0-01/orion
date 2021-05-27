const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports =
{
	name: "pun",
	description: "Get a random, horrible pun.",
	category: "Fun",
	run: async (client, message) =>
	{
		try
		{
			fetch("https://getpuns.herokuapp.com/api/random")
				.then(res => res.json())
				.then(json =>
				{
					const punEmbed = new Discord.MessageEmbed()
						.setColor("RANDOM")
						.setDescription(json.Pun)
						.setTimestamp();
					message.channel.send(punEmbed);
				});
		}
		catch(err)
		{
			console.error(err);
		}
	}
};

const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports =
{
	name: "meme",
	aliases: ["rm"],
	description: "Get a random meme.",
	category: "Fun",
	run: async (client, message) =>
	{
		try
		{
			fetch("https://meme-api.herokuapp.com/gimme")
				.then(res => res.json())
				.then(json =>
				{
					const memeEmbed = new Discord.MessageEmbed()
						.setColor("RANDOM")
						.setTitle(json.title)
						.setImage(json.url)
						.setFooter(`From: /r/${json.subreddit}`)
						.setTimestamp();
					message.channel.send(memeEmbed);
				});
		}
		catch(err)
		{
			console.error(err);
		}
	}
};

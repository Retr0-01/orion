const Discord = require("discord.js");
const fetch = require("node-fetch");

module.exports =
{
	name: "animal",
	description: "Get a pic of the animal you choose.",
	category: "Fun",
	usage: "[dog | cat | bird]",
	run: async (client, message, args) =>
	{
		const animalType = args[0];
		const replies = ["dog", "cat", "bird"];

		// If there is no reply return this.
		const noArgEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Error")
			.setDescription("Please provide more arguments.")
			.setTimestamp();
		if (!animalType) return message.reply(noArgEmbed);

		// If the user's reply doesn't match with the option's return this.
		const invalidArgEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Error")
			.setDescription(`You must pick one of the following animals: ${replies.join(", ")}`)
			.setTimestamp();
		if (!replies.includes(animalType)) return message.reply(invalidArgEmbed);

		switch (animalType)
		{
		case "dog":
			sendAnimal("https://some-random-api.ml/img/dog");
			break;
		case "cat":
			sendAnimal("https://some-random-api.ml/img/cat");
			break;
		case "bird":
			sendAnimal("https://some-random-api.ml/img/birb");
			break;
		}

		function sendAnimal(apiLink)
		{
			try
			{
				fetch(apiLink)
					.then(res => res.json())
					.then(json =>
					{
						const animalEmbed = new Discord.MessageEmbed()
							.setColor("RANDOM")
							.setTitle("Here!")
							.setImage(json.link)
							.setTimestamp();
						message.channel.send(animalEmbed);
					});
			}
			catch(err)
			{
				console.error(err);
			}
		}
	}
};

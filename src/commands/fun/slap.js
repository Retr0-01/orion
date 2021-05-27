const Discord = require("discord.js");

module.exports =
{
	name: "slap",
	description: "Slap someone :Ο",
	category: "Fun",
	usage: "[@user]",
	run: async (client, message) =>
	{
		// Get the user from the mention.
		const userToSlap = message.mentions.users.first();

		// Create our gifs and responses.
		const slapGIFs = ["https://media.giphy.com/media/srD8JByP9u3zW/giphy.gif", "https://media.giphy.com/media/7wiHusZSye5rO/giphy.gif", "https://media.giphy.com/media/LD8TdEcyuJxu0/giphy.gif", "https://media.giphy.com/media/xT8qB7Sbwskk27Rdy8/giphy.gif", "https://media.giphy.com/media/JXuGatu6v9pUA/giphy.gif", "https://media.giphy.com/media/htiVRuP7N0XK/giphy.gif", "https://media.giphy.com/media/3oEdv1Rdmo0Vd0YdW0/giphy.gif", "https://media.giphy.com/media/jQn7ALYqyjbkeX451A/giphy.gif", "https://media.giphy.com/media/uqSU9IEYEKAbS/giphy.gif", "https://media.giphy.com/media/RrLbvyvatbi36/giphy.gif", "https://media.giphy.com/media/u8maN0dMhVWPS/giphy.gif"];
		const selfSlapReplies = ["Did you seriously just try to slap yourself?", "Why would you slap yourself?", "Ok...why?", "STAHP SLAPPING YOURSELF"];
		const botSlapReplies = ["What made you think you can slap me?", "Nice try.", "Why? :c", "Humans never change..."];

		const finalGIF = Math.floor((Math.random() * slapGIFs.length));
		const selfSlapResponse = Math.floor((Math.random() * selfSlapReplies.length));
		const botSlapResponse = Math.floor((Math.random() * botSlapReplies.length));

		// If there is no user mentioned return this.
		const noUserEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Error")
			.setDescription("Please mention the user you want to slap.")
			.setTimestamp();
		if (!userToSlap) return message.reply(noUserEmbed);

		// If the user tries to slap themselves return this.
		const selfSlapEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Error")
			.setDescription(selfSlapReplies[selfSlapResponse])
			.setTimestamp();
		if (userToSlap.username === message.author.username) return message.reply(selfSlapEmbed);

		// If the user tries to slap the bot return this.
		const botSlapEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Error")
			.setDescription(botSlapReplies[botSlapResponse])
			.setTimestamp();
		if (userToSlap.username === client.user.username) return message.reply(botSlapEmbed);

		// Send the slap embed.
		const slapEmbed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setDescription(`**${message.author.username} slaps ${userToSlap.username}!**`)
			.setImage(slapGIFs[finalGIF])
			.setTimestamp();
		message.channel.send(slapEmbed);
	}
};

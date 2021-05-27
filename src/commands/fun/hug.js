const Discord = require("discord.js");

module.exports =
{
	name: "hug",
	description: "Give a nice hug to someone :)",
	category: "Fun",
	usage: "[@user]",
	run: async (client, message) =>
	{
		// Get the user from the mention.
		const userToHug = message.mentions.users.first();

		// Create our gifs and responses.
		const hugGIFs = ["https://media.giphy.com/media/KL7xA3fLx7bna/giphy.gif", "https://media.giphy.com/media/llmZp6fCVb4ju/giphy.gif", "https://media.giphy.com/media/llmZp6fCVb4ju/giphy.gif", "https://media.giphy.com/media/yidUzriaAGJbsxt58k/giphy.gif", "https://media.giphy.com/media/1dOH0aFZz3LyVVEMn9/giphy.gif", "https://media.giphy.com/media/l41YzyKroVv69cTmw/giphy.gif", "https://media.giphy.com/media/26FeTvBUZErLbTonS/giphy.gif", "https://media.giphy.com/media/26tPdTuK5IwvzmUz6/giphy.gif", "https://media.giphy.com/media/jOoxG4mWGuH9S/giphy.gif", "https://media.giphy.com/media/3oz8xQMrv0yjonR6P6/giphy.gif"];
		const selfHugReplies = ["Come on, hug someone.", "There are other people you can hug.", "Aw come on, go hug someone else. :)"];

		const finalGIF = Math.floor((Math.random() * hugGIFs.length));
		const selfHugResponse = Math.floor((Math.random() * selfHugReplies.length));

		// If there is no user mentioned return this embed.
		const noUserEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Error")
			.setDescription("Please mention the user you want to hug.")
			.setTimestamp();
		if (!userToHug) return message.reply(noUserEmbed);

		// If the user tries to hug themselves return this embed.
		const selfHugEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Error")
			.setDescription(selfHugReplies[selfHugResponse])
			.setTimestamp();
		if (userToHug.username === message.author.username) return message.reply(selfHugEmbed);

		// If the user tries to hug the bot return this embed.
		const botHugEmbed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setDescription(`**${message.author.username} hugs me! :D**`)
			.setImage(hugGIFs[finalGIF])
			.setTimestamp();
		if (userToHug.username === client.user.username) return message.reply(botHugEmbed);

		// Send the hug embed.
		const hugEmbed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setDescription(`**${message.author.username} hugs ${userToHug.username}!**`)
			.setImage(hugGIFs[finalGIF])
			.setTimestamp();
		message.channel.send(hugEmbed);
	}
};

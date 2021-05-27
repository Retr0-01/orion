const Discord = require("discord.js");

module.exports =
{
	name: "8ball",
	aliases: ["8b"],
	description: "Ask the magic 8Ball something, anything.",
	category: "Fun",
	usage: "[question]",
	run: async (client, message, args) =>
	{
		// If there are less than 5 words return this.
		const noQuestionEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Error")
			.setDescription("Please enter a full question with 5 or more words.")
			.setTimestamp();
		if (!args[4]) return message.reply(noQuestionEmbed);

		// Create our array of replies.
		const replies = ["It is decidedly so.", "Without a doubt.", "Definitely.", "You may rely on it.", "As I see it, yes.", "Most likely.", "Outlook good.", "Yes.", "Signs point to yes.", "Better not tell you now.", "Cannot predict now.", "Concentrate and ask again.", "Don't count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful."];
		// Get a random reply.
		const result = Math.floor((Math.random() * replies.length));
		// Define the question.
		const question = args.join(" ");

		// Send the answer embed.
		const answerEmbed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setTitle(message.author.username)
			.addField("Question", question)
			.addField("Answer", replies[result])
			.setTimestamp();
		message.channel.send(answerEmbed);
	}
};

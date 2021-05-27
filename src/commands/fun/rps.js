const Discord = require("discord.js");

module.exports =
{
	name: "rps",
	aliases: ["rockpaperscissors"],
	description: "RPS with the bot.",
	category: "Fun",
	usage: "[rock | paper | scissors]",
	run: async (client, message, args) =>
	{
		// Define the user's reply.
		const uReply = args[0];
		// Define the options.
		const replies = ["rock", "paper", "scissors"];

		// If there is no reply return this.
		const noArgEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Error")
			.setDescription("How do you expect RPS to work without picking something? :‑/")
			.setTimestamp();
		if (!uReply) return message.reply(noArgEmbed);

		// If the user's reply doesn't match with the option's return this.
		const invalidArgEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Error")
			.setDescription("You must pick rock, paper or scissors.")
			.setTimestamp();
		if (!replies.includes(uReply)) return message.reply(invalidArgEmbed);

		// Create our replies.
		const ties = ["It's a tie!", "Tie!", "tie :o"];
		const wins = ["I WON", "Heh, I won.", "Better luck next time!", "gg", "Victory is mine."];
		const loses = ["DAMNIT", ":(", "You won...", "aww", "That wasn't supposed to happen :("];

		// Get a random reply for each case.
		const result = Math.floor((Math.random() * replies.length));
		const tieAnnounce = Math.floor((Math.random() * ties.length));
		const winAnnounce = Math.floor((Math.random() * wins.length));
		const loseAnnounce = Math.floor((Math.random() * loses.length));

		// Create a var for our final reply.
		let announce;

		// Case 1 - User uses rock.
		if (uReply == "rock" && replies[result] == "rock")
		{
			announce = ties[tieAnnounce];
		}
		if (uReply == "rock" && replies[result] == "paper")
		{
			announce = wins[winAnnounce];
		}
		if (uReply == "rock" && replies[result] == "scissors")
		{
			announce = loses[loseAnnounce];
		}
		// Case 2 - User uses paper.
		if (uReply == "paper" && replies[result] == "rock")
		{
			announce = loses[loseAnnounce];
		}
		if (uReply == "paper" && replies[result] == "paper")
		{
			announce = ties[tieAnnounce];
		}
		if (uReply == "paper" && replies[result] == "scissors")
		{
			announce = wins[winAnnounce];
		}
		// Case 3 - User uses scissors.
		if (uReply == "scissors" && replies[result] == "rock")
		{
			announce = wins[winAnnounce];
		}
		if (uReply == "scissors" && replies[result] == "paper")
		{
			announce = loses[loseAnnounce];
		}
		if (uReply == "scissors" && replies[result] == "scissors")
		{
			announce = ties[tieAnnounce];
		}

		// And finally, send the embed.
		const answerEmbed = new Discord.MessageEmbed()
			.setColor("RANDOM")
			.setTitle(message.author.username)
			.setDescription(announce)
			.addField("Your Pick", uReply)
			.addField("My Pick", replies[result]);
		message.channel.send(answerEmbed);
	}
};

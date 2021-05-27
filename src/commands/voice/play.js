const Discord = require("discord.js");
const { apiKeys } = require("../../config.json");
const fetch = require("node-fetch");
const ytdl = require("ytdl-core-discord");

module.exports =
{
	name: "play",
	aliases: ["p"],
	description: "Search and play music.",
	category: "Voice",
	usage: "[search arguments | YouTube link]",
	run: async (client, message, args) =>
	{
		/*
		*
		* TO DO
		* - Use the serverQueue collection and implement queues.
		* - Fix the "Unknown stream type" error at connection.play().
		*
		*/
		const voiceChannel = message.member.voice.channel;

		// If the member is not in a voice channel return this.
		const noVCEmbed = new Discord.MessageEmbed()
			    .setColor("RED")
			    .setTitle("Error")
			    .setDescription("You need to join a voice channel first.")
			    .setTimestamp();
		if (!voiceChannel) return message.reply(noVCEmbed);

		// If there are no arguments return this.
		const noArgsEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Error")
			.setDescription("Please specify the music you want to search or a video link.")
			.setTimestamp();
		if (!args[0]) return message.reply(noArgsEmbed);

		// If the argument is a link, replace the link so we only have the ID and search by ID.
		if (args.includes("https://www.youtube.com/watch?v=") === true) return args.replace("https://www.youtube.com/watch?v=", ""), searchVideoByID(args);
		// If the arguments is not a video ID, search by the arguments instead of ID.
		else args.join("_") && searchVideoByName(args);


		function searchVideoByName(videoToSearch)
		{
			fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${videoToSearch}&fields=items(id,snippet/title,snippet/thumbnails/medium,snippet/channelTitle)&type=video&key=${apiKeys.youtube}`)
				.then(res => res.json())
				.then(json =>
				{
					// Join our voice channel.
					voiceChannel.join()
						.then(connection =>
						{
							// Send a confirmation embed.
							const connectedEmbed = new Discord.MessageEmbed()
								.setColor("GREEN")
								.setDescription(`Successfully joined **${voiceChannel.name}**.`)
								.setTimestamp();
							message.channel.send(connectedEmbed);

							// Create our music stream.
							const stream = ytdl(`https://www.youtube.com/watch?v=${json.items[0].id.videoId}`, { filter: "audioonly" });
							// Create our dispatcher and start playing the stream.
							const dispatcher = connection.play(stream, { volume: 0.5 });

							// Check if the title includes a glitched apostrophe and replace it.
							let videoTitle = json.items[0].snippet.title;
							if (videoTitle.includes("#39;") === true) videoTitle.replace("#39;", "'");

							// Send a confirmation embed.
							const playingEmbed = new Discord.MessageEmbed()
								.setColor("ORANGE")
								.setTitle(`Now playing: ${videoTitle}`)
								.setURL(`https://www.youtube.com/watch?v=${json.items[0].id.videoId}`)
								.setDescription(`By ${json.items[0].snippet.channelTitle}`)
								.setImage(json.items[0].snippet.thumbnails.medium.url)
								.setTimestamp();
							message.reply(playingEmbed);

							dispatcher.on("finish", () =>
							{
								// When the current stream is over, pause the dispatcher.
								dispatcher.pause();
							});
						});
				})
				.catch(err =>
				{
					const errorEmbed = new Discord.MessageEmbed()
						.error("RED")
						.setTitle("Error")
						.setDescription(`${err.name}:${err.description}`);
					message.reply(errorEmbed);
				});
		}

		function searchVideoByID(idToSearch)
		{
			fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&relatedToVideoId=${idToSearch}&fields=items(id,snippet/title,snippet/thumbnails/medium,snippet/channelTitle)&type=video&key=${apiKeys.youtube}`)
				.then(res => res.json())
				.then(json =>
				{
					voiceChannel.join()
						.then(connection =>
						{
							const stream = ytdl(`https://www.youtube.com/watch?v=${json.items[0].id.videoId}`, { filter: "audioonly" });
							const dispatcher = connection.play(stream, { volume: 0.5 });

							let videoTitle = json.items[0].snippet.title;
							if (videoTitle.includes("#39;") === true) videoTitle.replace("#39;", "'");

							const playingEmbed = new Discord.MessageEmbed()
								.setColor("ORANGE")
								.setTitle(`Now playing: ${videoTitle}`)
								.setURL(`https://www.youtube.com/watch?v=${json.items[0].id.videoId}`)
								.setDescription(`By ${json.items[0].snippet.channelTitle}`)
								.setImage(json.items[0].snippet.thumbnails.medium.url)
								.setTimestamp();
							message.reply(playingEmbed);

							dispatcher.on("finish", () =>
							{
								dispatcher.pause();
							});
						});
				})
				.catch(err =>
				{
					const errorEmbed = new Discord.MessageEmbed()
						.error("RED")
						.setTitle("Error")
						.setDescription(`${err.name}:${err.description}`);
					message.reply(errorEmbed);
				});
		}
	}
};

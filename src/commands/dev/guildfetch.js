const Discord = require("discord.js");
const { devs, webhooks } = require("../../config.json");
const devHook = new Discord.WebhookClient(webhooks.devLog.id, webhooks.devLog.token);

module.exports =
{
	name: "guildfetch",
	aliases: ["gfetch"],
	description: "Fetches information about a server the bot is on.",
	category: "Dev",
	usage: "[server ID]",
	run: async (client, message, args) =>
	{
		// If the author is not a dev return this.
		const noPermEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Invalid Permissions")
			.setDescription("This is a developer command, you can't execute it.")
			.setTimestamp();
		if (!devs.includes(message.author.id)) return message.reply(noPermEmbed);

		// If there is no guild provided return this.
		const noGuildEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Error")
			.setDescription("Please provide the server's ID you want to search.")
			.setTimestamp();
		if (!args[0]) return message.reply(noGuildEmbed);

		// Create and send the embed.
		client.guilds.fetch(args[0])
			.then(guild =>
			{
				var guildCreated = guild.createdAt.toString().split(" ");

				const guildFetchEmbed = new Discord.MessageEmbed()
					.setColor("#2c3334")
					.setTitle(guild.name)
					.setThumbnail(guild.iconURL())
					.addFields
					(
						{ name: "Owner", value: guild.owner, inline: true },
						{ name: "Region", value: guild.region, inline: true },
						{ name: "Created at", value: guildCreated[2] + " " + guildCreated[1] + " " + guildCreated[3], inline: true },
						{ name: "Members", value: guild.memberCount, inline: true },
						{ name: "Channels", value: guild.channels.cache.size, inline: true },
						{ name: "Roles", value: guild.roles.cache.size, inline: true },
					)
					.setFooter(`ID: ${guild.id}`)
					.setTimestamp();
				message.channel.send(guildFetchEmbed);

				// Get the dev log webhook and send this embed.
				const devWebhookEmbed = new Discord.MessageEmbed()
					.setColor("DARK_BLUE")
					.setTitle("Guild Fetch")
					.setDescription(`By: ${message.author.tag}\nGuild ID: ${args[0]}`)
					.setTimestamp();
				devHook.send(devWebhookEmbed);

				console.log(`[DEV] - ${message.author.tag} fetched the guild info of ${args[0]}.`);
			})
			.catch(() =>
			{
				const notFoundEmbed = new Discord.MessageEmbed()
					.setColor("RED")
					.setTitle("Not Found")
					.setDescription("Server not found. Maybe I am not in that server at the first place.")
					.setTimestamp();
				message.reply(notFoundEmbed);
			});
	}
};

const Discord = require("discord.js");
const { devs, webhooks } = require("../../config.json");
const devHook = new Discord.WebhookClient(webhooks.devLog.id, webhooks.devLog.token);
const guildsConfig = require("../../util/models/guildsConfig");
const guildsBackup = require("../../util/models/guildsBackup");

module.exports =
{
	name: "databasefetch",
	aliases: ["dbfetch"],
	description: "Fetches a server's config or backup document.",
	category: "Dev",
	usage: "[config | backup] [guild ID | 'this']",
	run: async (client, message, args) =>
	{
		// If the author is not a dev return this.
		const noPermEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Invalid Permissions")
			.setDescription("This is a developer command, you can't execute it.")
			.setTimestamp();
		if (!devs.includes(message.author.id)) return message.reply(noPermEmbed);

		// Define our subcommands.
		const subcommands = ["config", "backup"];

		// If there is no arg return this.
		const noArgEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Error")
			.setDescription("Please provide more arguments.")
			.setTimestamp();
		if (!args[0]) return message.reply(noArgEmbed);

		// If the user's arg doesn't match with the subcommands return this.
		const invalidArgEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Error")
			.setDescription(`You must pick one of the following subcommands: ${subcommands.join(", ")}`)
			.setTimestamp();
		if (!subcommands.includes(args[0])) return message.reply(invalidArgEmbed);

		switch (args[0])
		{
		case "config":
			fetchConfig(args[1]);
			break;
		case "backup":
			fetchBackup(args[1]);
		}

		function fetchConfig(serverID)
		{
			// If there is no guild ID provided return this.
			const noGuildEmbed = new Discord.MessageEmbed()
				.setColor("RED")
				.setTitle("Error")
				.setDescription("Please provide the guild's ID you want to search.")
				.setTimestamp();
			if (!serverID) return message.reply(noGuildEmbed);

			// If the "this" keyword is used set the guild ID to the guild the command was used.
			if (serverID === "this") serverID = message.guild.id;

			// If the guild ID is not a number, return. We need this because mongoose will error
			// with a falsely value below.
			const invalidGuildEmbed = new Discord.MessageEmbed()
				.setColor("RED")
				.setTitle("Error")
				.setDescription("That's not a valid guild ID.")
				.setTimestamp();
			if (isNaN(serverID)) return message.reply(invalidGuildEmbed);

			guildsConfig.findOne({ guildID: serverID }, (err, dbData) =>
			{
				if (err) return console.error(err);

				const notFoundEmbed = new Discord.MessageEmbed()
					.setColor("RED")
					.setTitle("Not Found")
					.setDescription("No config document found.")
					.setTimestamp();
				if (!dbData) return message.reply(notFoundEmbed);

				const trueOrFalseReplace = { true: "Yes", false: "No" };
				const nullReplace = { null: "None Set" };

				const guildConfigEmbed = new Discord.MessageEmbed()
					.setColor("YELLOW")
					.setTitle("Database Information")
					.addFields
					(
						{ name: "Server ID", value: dbData.guildID },
						{ name: "Prefix", value: dbData.prefix, inline: true },
						{ name: "Cooldown", value: `${dbData.cooldown} sec(s)`, inline: true },
						{ name: "Autorole", value: dbData.autorole, inline: true },
						{ name: "DM Users on Action", value: trueOrFalseReplace[dbData.moderation.dmOnAction], inline: true },
						{ name: "Muted Role ID", value: dbData.moderation.mutedRoleID, inline: true },
						{ name: "Mod Log Webhook", value: nullReplace[dbData.modLogWebhook.id], inline: true },
						{ name: "Message Log Webhook", value: nullReplace[dbData.messageLogWebhook.id], inline: true },
						{ name: "Member Log Webhook", value: nullReplace[dbData.memberLogWebhook.id], inline: true },
					)
					.setTimestamp();
				message.channel.send(guildConfigEmbed)
					.then(console.log(`[DEV] - ${message.author.tag} fetched the config document of ${dbData.guildID}.`));

				// Get the dev log webhook and send this embed.
				const devWebhookEmbed = new Discord.MessageEmbed()
					.setColor("DARK_BLUE")
					.setTitle("Database Fetch")
					.setDescription(`By: ${message.author.tag}\nType: Config\nGuild ID: ${dbData.guildID}`)
					.setTimestamp();
				devHook.send(devWebhookEmbed);
			});
		}

		function fetchBackup(serverID)
		{
			// If there is no guild ID provided return this.
			const noGuildEmbed = new Discord.MessageEmbed()
				.setColor("RED")
				.setTitle("Error")
				.setDescription("Please provide the guild's ID you want to search.")
				.setTimestamp();
			if (!serverID) return message.reply(noGuildEmbed);

			// If the "this" keyword is used set the guild ID to the guild the command was used.
			if (serverID === "this") serverID = message.guild.id;

			// If the guild ID is not a number, return. We need this because mongoose will error
			// with a falsely value below.
			const invalidGuildEmbed = new Discord.MessageEmbed()
				.setColor("RED")
				.setTitle("Error")
				.setDescription("That's not a valid guild ID.")
				.setTimestamp();
			if (isNaN(serverID)) return message.reply(invalidGuildEmbed);

			// Fetch the backup document of the guild...
			guildsBackup.findOne({ "data.backupData.guildID": serverID }, (err, dbData) =>
			{
				if (err) return console.error(err);

				const notFoundEmbed = new Discord.MessageEmbed()
					.setColor("RED")
					.setTitle("Not Found")
					.setDescription("No backup document found.")
					.setTimestamp();
				if (!dbData) return message.reply(notFoundEmbed);

				const bData = dbData.data.backupData;

				// I definitely did not just copy paste this from the backup cmd...
				const verLevel =
				{
					"NONE": "None",
					"LOW": "Low",
					"MEDIUM": "Medium",
					"HIGH": "High",
					"VERY_HIGH": "Very High"
				};

				const contentFilterLevel =
				{
					"DISABLED": "Disabled",
					"MEMBERS_WITHOUT_ROLES": "Only members without roles",
					"ALL_MEMBERS": "All Members"
				};

				const notifications =
				{
					"ALL": "All Messages",
					"MENTIONS": "Only Mentions"
				};

				const fixedRegions =
				{
					"amsterdam": "Amsterdam",
					"brazil": "Brazil",
					"dubai": "Dubai",
					"eu_central": "EU Central",
					"eu_west": "EU West",
					"europe": "Europe",
					"frankfurt": "Frankfurt",
					"hongkong": "Hongkong",
					"india": "India",
					"japan": "Japan",
					"london": "London",
					"russia": "Russia",
					"singapore": "Singapore",
					"south_korea": "South Korea",
					"southafrica": "South Africa",
					"sydney": "Sydney",
					"us_central": "US Central",
					"us_east": "US East",
					"us_south": "US South",
					"us_west": "US West",
					"vip_amsterdam": "VIP - Amsterdam",
					"vip_us_east": "VIP - US East",
					"vip_us_west": "VIP - US West",
				};

				let afkChannel;
				let afkTimeout;

				if (!bData.afk) afkChannel = "Not Set";
				else afkChannel = !bData.afk.name;
				if (!bData.afk) afkTimeout = "";
				else afkTimeout = ` - ${bData.afk.timeout / 60} mins`;

				let avatarLink;

				if (!bData.iconURL) avatarLink = "Not Set";
				else avatarLink = `[Link](${bData.iconURL})`;

				const totalChannels = [];
				const totalCategories = bData.channels.categories.length;
				const totalOtherChannels = bData.channels.others.length;

				bData.channels.categories.forEach(category =>
				{
					category.children.forEach(channel =>
					{
						totalChannels.push(channel);
					});
				});

				const channelsGrandTotal = totalCategories + totalChannels.length + totalOtherChannels;

				const backupDataEmbed = new Discord.MessageEmbed()
					.setColor("YELLOW")
					.setTitle(`Backup Information - "${bData.name}"`)
					.setDescription(`Server Region: ${fixedRegions[bData.region]}`)
					.addFields
					(
						{ name: "Verification Level", value: verLevel[bData.verificationLevel], inline: true },
						{ name: "Explicit Content Filter", value: contentFilterLevel[bData.explicitContentFilter], inline: true },
						{ name: "Notification Settings", value: notifications[bData.defaultMessageNotifications], inline: true },
						{ name: "Channels", value: channelsGrandTotal, inline: true },
						{ name: "Roles", value: bData.roles.length, inline: true },
						{ name: "Emojis", value: bData.emojis.length, inline: true },
						{ name: "AFK Settings", value: afkChannel, afkTimeout, inline: true },
						{ name: "Bans", value: bData.bans.length, inline: true },
						{ name: "Server Icon", value: avatarLink, inline: true }

					)
					.setTimestamp();
				message.channel.send(backupDataEmbed)
					.then(console.log(`[DEV] - ${message.author.tag} fetched the backup document of guild "${bData.name}" (${bData.guildID}).`));

				// Get the dev log webhook and send this embed.
				const devWebhookEmbed = new Discord.MessageEmbed()
					.setColor("DARK_BLUE")
					.setTitle("Database Fetch")
					.setDescription(`By: ${message.author.tag}\nType: Backup\nGuild ID: ${bData.guildID}`)
					.setTimestamp();
				devHook.send(devWebhookEmbed);
			});
		}
	}
};

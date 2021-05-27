const Discord = require("discord.js");
const backup = require("discord-backup");
const guildsBackup = require("../../util/models/guildsBackup");

module.exports =
{
	name: "backup",
	description: "Create, load, fetch or delete your server backup.",
	category: "Mod",
	usage: "[create | load | fetch | delete]",
	run: async (client, message, args) =>
	{
		// If the member isn't the owner of the server return this.
		const noPermEmbed = new Discord.MessageEmbed()
			.setColor("RED")
			.setTitle("Invalid Permissions")
			.setDescription("Only the **Server Owner** can execute this command.")
			.setTimestamp();
		if (message.guild.ownerID !== message.author.id) return message.reply(noPermEmbed);

		// Define the options for the backup create and load actions.
		const backupCreateOptions =
        {
        	maxMessagesPerChannel: 0,
        	jsonSave: false,
        	jsonBeautify: true,
        	saveImages: "base64"
        };
		const backupLoadOptions =
		{
			maxMessagesPerChannel: 0,
			clearGuildBeforeRestore: true
		};

		// Define our subcommands.
		const subcommands = ["create", "load", "fetch", "delete"];

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
			.setDescription(`You must pick one of the following actions: ${subcommands.join(", ")}`)
			.setTimestamp();
		if (!subcommands.includes(args[0])) return message.reply(invalidArgEmbed);

		// Action time.
		switch (args[0])
		{
		case "create":
			createBackup();
			break;
		case "load":
			loadBackup(message.guild.id);
			break;
		case "fetch":
			fetchBackup(message.guild.id);
			break;
		case "delete":
			deleteBackup(message.guild.id);
			break;
		}

		function createBackup()
		{
			// Send this embed.
			const backupStartCreationEmbed = new Discord.MessageEmbed()
				.setColor("BLUE")
				.setDescription("Please wait while we create your backup. This may take a bit...")
				.setTimestamp();
			message.channel.send(backupStartCreationEmbed)
				.then(msg =>
				{
					// Create our backup.
					backup.create(message.guild, backupCreateOptions).then((backupData) =>
					{
						// Create our document.
						const serverBackup = new guildsBackup
						({
							ownerID: message.author.id,
							data: { backupData },
						});

						// Save the document and log into the console.
						serverBackup.save()
							.then(console.log(`[DATABASE] - Backup for server "${message.guild.name}" (${message.guild.id}) created by ${message.author.tag}.`))
							.catch(err => console.error(err));

						// Edit the previous embed with this one.
						const backupCreatedEmbed = new Discord.MessageEmbed()
							.setColor("GREEN")
							.setTitle("Success")
							.setDescription("Server backup successfully created.")
							.setTimestamp();
						msg.edit(backupCreatedEmbed);
					});
				});
		}

		function loadBackup(serverID)
		{
			guildsBackup.findOne({ "data.backupData.guildID": serverID },(err, dbData) =>
			{
				if (err) return console.error(err);

				// If the backup doesn't exist, return this.
				const notFoundEmbed = new Discord.MessageEmbed()
					.setColor("RED")
					.setTitle("Not Found")
					.setDescription("This guild has no backup saved.")
					.setTimestamp();
				if (!dbData) return message.reply(notFoundEmbed);

				// If it does, send this embed...
				const confirmationEmbed = new Discord.MessageEmbed()
					.setColor("ORANGE")
					.setTitle("WARNING")
					.setDescription("You are about to load your backup.\n**THIS WILL CLEAR THE CURRENT SERVER AND ITS CONTENTS**\nAre you sure you want to continue? Type either ``confirm`` or ``cancel``.\n Note: your backup will be deleted when it's loaded.")
					.setTimestamp();
				message.channel.send(confirmationEmbed);

				// and request for confirmation using a message collector.
				const filter = m => (m.author.id === message.author.id);
				message.channel.awaitMessages(filter, { max: 1, time: 10000, errors: ["time"] })
					.then(collected =>
					{
						// The action was confirmed...
						if (collected.first().content === "confirm")
						{
							if (err) return console.error(err);

							// load the backup ...
							backup.load(dbData.data.backupData, message.guild, backupLoadOptions).then(() =>
							{
								// and delete it from the database.
								guildsBackup.deleteOne({ "data.backupData.guildID": serverID })
									.then(console.log(`[DATABASE] - Backup for server "${message.guild.name}" (${message.guild.id}) loaded and deleted by ${message.author.tag}.`))
									.catch(err => console.error(err));

							}).catch(err => console.error(err));
						}
						else
						{
							const canceledEmbed = new Discord.MessageEmbed()
								.setColor("DARK_RED")
								.setDescription("Backup loading cancelled.")
								.setTimestamp();
							return message.channel.send(canceledEmbed);
						}
					}).catch(() =>
					{
						const commandTimeoutEmbed = new Discord.MessageEmbed()
							.setColor("DARK_RED")
							.setTitle("Command Timeout")
							.setDescription("Backup loading automatically cancelled.")
							.setTimestamp();
						return message.channel.send(commandTimeoutEmbed);
					});
			});
		}

		function fetchBackup(serverID)
		{
			// Fetch the backup...
			guildsBackup.findOne({ "data.backupData.guildID": serverID }, (err, dbData)=>
			{
				if (err) return console.error(err);

				// If the backup doesn't exist, return this.
				const notFoundEmbed = new Discord.MessageEmbed()
					.setColor("RED")
					.setTitle("Not Found")
					.setDescription("This guild has no backup saved.")
					.setTimestamp();
				if (!dbData) return message.reply(notFoundEmbed);

				const bData = dbData.data.backupData;

				// replace A LOT of stuff because fuck you...
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

				// do this in order to get our final AFK settings...
				let afkChannel;
				let afkTimeout;

				if (!bData.afk) afkChannel = "Not Set";
				else afkChannel = !bData.afk.name;
				if (!bData.afk) afkTimeout = "";
				else afkTimeout = ` - ${bData.afk.timeout / 60} mins`;

				// and this for the server icon...
				let avatarLink;

				if (!bData.iconURL) avatarLink = "Not Set";
				else avatarLink = `[Link](${bData.iconURL})`;

				// and some magic here for the total channels...
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

				// and then send the embed.
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
					.then(console.log(`[DATABASE] - ${message.author.tag} fetched the backup of guild "${bData.name}" (${bData.guildID}).`));
			});
		}

		function deleteBackup(serverID)
		{

			guildsBackup.findOneAndDelete({ "data.backupData.guildID": serverID }, (err, dbData) =>
			{
				if (err) return console.error(err);

				// If the backup doesn't exist, return this.
				const notFoundEmbed = new Discord.MessageEmbed()
					.setColor("RED")
					.setTitle("Not Found")
					.setDescription("This guild has no backup saved.")
					.setTimestamp();
				if (!dbData) return message.reply(notFoundEmbed);

				const bData = dbData.data.backupData;

				const backupDeletedEmbed = new Discord.MessageEmbed()
					.setColor("GREEN")
					.setTitle("Success")
					.setDescription("Backup successfully deleted.")
					.setTimestamp();
				message.channel.send(backupDeletedEmbed)
					.then(console.log(`[DATABASE] - ${message.author.tag} deleted the backup of guild "${bData.name}" (${bData.guildID}).`));
			});
		}
	}
};

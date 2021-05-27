const Discord = require("discord.js");
const guildsConfig = require("../util/models/guildsConfig");
const guildsBackup = require("../util/models/guildsBackup");
const { webhooks } = require("../config.json");
const guildHook = new Discord.WebhookClient(webhooks.guildLog.id, webhooks.guildLog.token);

module.exports = async (client, guild) =>
{
	console.log(`[EVENT] - Left "${guild.name}".`);

	// Find the server's config document we just left and delete it.
	guildsConfig.findOneAndDelete({ guildID: guild.id }, (err, dbData) =>
	{
		if (err) return console.error(err);
		// But if the document doesn't exist for whatever reason, just don't log to the console.
		if (!dbData) return;

		console.log(`[DATABASE] - Successfully deleted the config document of "${guild.name}".`);
	});

	// Do the same but for the leftover backup document.
	guildsBackup.findOneAndDelete({ "data.backupData.guildID": guild.id }, (err, dbData) =>
	{
		if (err) return console.error(err);
		if (!dbData) return;

		console.log(`[DATABASE] - Successfully deleted the leftover backup of "${guild.name}".`);
	});

	// Fetch the owner.
	const guildOwner = await client.users.fetch(guild.ownerID);

	// Get the guild log webhook and send this embed.
	const leftGuildEmbed = new Discord.MessageEmbed()
		.setColor("DARK_RED")
		.setThumbnail(guild.iconURL())
		.setTitle("Left Guild")
		.addFields
		(
			{ name: "Name", value: guild.name },
			{ name: "ID", value: guild.id },
			{ name: "Owner", value: `${guildOwner.username}#${guildOwner.discriminator} (${guildOwner.id})` },
		)
		.setTimestamp();
	guildHook.send(leftGuildEmbed);
};

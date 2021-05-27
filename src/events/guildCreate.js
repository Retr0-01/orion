const Discord = require("discord.js");
const guildsConfig = require("../util/models/guildsConfig");
const { defaultPrefix, defaultCooldown, webhooks } = require("../config.json");
const guildHook = new Discord.WebhookClient(webhooks.guildLog.id, webhooks.guildLog.token);

module.exports = async (client, guild) =>
{
	console.log(`[EVENT] - Joined "${guild.name}".`);

	// Create our document from the model.
	const config = new guildsConfig
	({
		guildID: guild.id,
		prefix: defaultPrefix,
		cooldown: defaultCooldown,
		autorole: null,
		moderation:
		{
			dmOnAction: false,
			mutedRoleID: null
		},
		modLogWebhook:
		{
			id: null,
			token: null
		},
		messageLogWebhook:
		{
			id: null,
			token: null
		},
		memberLogWebhook:
		{
			id: null,
			token: null
		}
	});

	guildsConfig.exists({ guildID: guild.id }, (err, result) =>
	{
		if (err) return console.error(err);

		// If the server already has a database document, return early to prevent the creation of a duplicate.
		if (result === true) return;

		// Save the document, log to console and catch any errors.
		config.save()
			.catch(err => console.error(err))
			.then(console.log(`[DATABASE] - Successfully wrote the config document of "${guild.name}".`));
	});

	// Fetch the owner.
	const guildOwner = await client.users.fetch(guild.ownerID);

	// Get the guild log webhook and send this embed.
	const joinedGuildEmbed = new Discord.MessageEmbed()
		.setColor("DARK_GREEN")
		.setThumbnail(guild.iconURL())
		.setTitle("Joined Guild")
		.addFields
		(
			{ name: "Name", value: guild.name },
			{ name: "ID", value: guild.id },
			{ name: "Owner", value: `${guildOwner.username}#${guildOwner.discriminator} (${guildOwner.id})` },
		)
		.setTimestamp();
	guildHook.send(joinedGuildEmbed);
};

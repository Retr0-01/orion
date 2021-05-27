const Discord = require("discord.js");
const { webhooks } = require("../config.json");
const devHook = new Discord.WebhookClient(webhooks.devLog.id, webhooks.devLog.token);

module.exports = async (client, warning) =>
{
	console.warn(warning);

	const warnEmbed = new Discord.MessageEmbed()
		.setColor("ORANGE")
		.setTitle("Bot Warn")
		.setDescription("The bot threw a warning!")
		.setTimestamp();
	devHook.send(warnEmbed);
	devHook.send(`\`\`\`\n${warning}\n\`\`\``);
};

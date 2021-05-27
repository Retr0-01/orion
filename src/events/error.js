const Discord = require("discord.js");
const { devs, webhooks } = require("../config.json");
const devHook = new Discord.WebhookClient(webhooks.devLog.id, webhooks.devLog.token);

module.exports = async (client, err) =>
{
	console.error(err);

	devHook.send(`<@${devs.join("> <@")}>`);
	const errorEmbed = new Discord.MessageEmbed()
		.setColor("DARK_RED")
		.setTitle("Bot Error")
		.setDescription("The bot threw an error! Check the error log immediately!")
		.setTimestamp();
	devHook.send(errorEmbed);
	devHook.send(`\`\`\`\n${err}\n\`\`\``);
};

const { prefix, cooldown } = require("../config.json");
const talkedRecently = new Set();

module.exports = (client, message) =>
{
	// If the message was not send in a guild, return.
	if (!message.guild) return;

	// If the guild the message was sent in is unavailable (e.g. has an outage), return.
	if (message.guild.available === false) return;

	// If the message's author is a bot return.
	if (message.author.bot) return;

	// If the message was send by the system (e.g. welcome messages), return.
	if (message.system) return;

	// If the message doesn't start with the prefix return.
	if (!message.content.startsWith(prefix)) return;

	// Get the bot's permissions for the channel the message was sent to.
	const channelPerms = message.channel.permissionsFor(client.user);
	const permissions = channelPerms.toArray();
	// If the bot cannot send messages, return.
	if (!permissions.includes("SEND_MESSAGES")) return;

	// Fetch the member that sent the message if it cannot be found (when the member is invisible).
	if (!message.member) message.member = message.guild.fetchMember(message);

	// If the same member that executed a command, executes another before the cooldown is over,
	// react with the emoji and return.
	if (talkedRecently.has(message.author.id)) return message.react("⏱️");

	// Configure the user that executed the command (individual users).
	talkedRecently.add(message.author.id);
	setTimeout(() =>
	{
		talkedRecently.delete(message.author.id);
	}, cooldown * 1000);
	//  ^ set the timeout (cooldown) in ms and then remove the author from talkedRecently.

	// Definition of arguments and commands.
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const cmd = args.shift().toLowerCase();

	// If there is no command, return.
	if (cmd.length === 0) return;

	// Fetch the commands using the handler.
	let command = client.commands.get(cmd);

	// If no command is found, fetch by alias.
	if (!command) command = client.commands.get(client.aliases.get(cmd));

	// Run the command.
	if (command)
	{
		command.run(client, message, args);
	}
};

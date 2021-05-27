const Discord = require("discord.js");
const { prefix, devs } = require("../../config.json");

module.exports =
{
	name: "help",
	aliases: ["commands"],
	description: "Seriously?",
	category: "Info",
	usage: "(command name)",
	run: async (client, message, args) =>
	{
		// Create a data array (used later) and get our commands from the collection.
		const data = [];
		const { commands } = client;

		// Filter the commands by category.
		const infoCMDs = commands.filter(infocommands => infocommands.category == "Info");
		const funCMDs = commands.filter(funcommands => funcommands.category == "Fun");
		const modCMDs = commands.filter(modcommands => modcommands.category == "Mod");
		const voiceCMDs = commands.filter(voicecommands => voicecommands.category == "Voice");
		const devCMDs = commands.filter(devcommands => devcommands.category == "Dev");


		// Create and send the help embed.
		if (!args.length)
		{
			const helpEmbed = new Discord.MessageEmbed()
				.setColor("BLUE")
				.setTitle(`${client.user.username} Bot Commands`)
				.setDescription(`You can send \`${prefix}help [command name]\` to get info on a specific command!`)
				.addFields
				(
					{ name: "Info Commands", value: infoCMDs.map(InfoCommands => InfoCommands.name).join(", ") },
					{ name: "Fun Commands", value: funCMDs.map(FunCommands => FunCommands.name).join(", ") },
					{ name: "Moderation & Administration Commands", value: modCMDs.map(ModCommands => ModCommands.name).join(", ") },
					{ name: "Voice Commands", value: voiceCMDs.map(VoiceCommands => VoiceCommands.name).join(", ") },
				)
				.setTimestamp();
				// If the author is a dev, add the dev commands field.
			if (devs.includes(message.author.id)) helpEmbed.addField("Developer Commands", `${devCMDs.map(DevCommands => DevCommands.name).join(", ")}`);
			return message.channel.send(helpEmbed);
		}

		// Get the command name for specific search.
		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		// If the command doesn't exist return this.
		if (!command)
		{
			const noCommandEmbed = new Discord.MessageEmbed()
				.setColor("RED")
				.setTitle("Error")
				.setDescription("That's not a valid command!")
				.setTimestamp();
			return message.reply(noCommandEmbed);
		}

		// Create the specific command help embed and push a field for every piece of data to data.
		const specificCommandHelpEmbed = new Discord.MessageEmbed()
			.setColor("BLUE");
		data.push(`**Name:** ${command.name}`);

		if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(", ")}`);
		if (command.description) data.push(`**Description:** ${command.description}`);
		if (command.category) data.push(`**Category:** ${command.category}`);
		if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`) && specificCommandHelpEmbed.setFooter("() = optional | [] = required ");

		specificCommandHelpEmbed.setDescription(data);
		specificCommandHelpEmbed.setTimestamp();

		message.channel.send(specificCommandHelpEmbed);

	},
};

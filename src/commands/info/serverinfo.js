const Discord = require("discord.js");

module.exports =
{
	name: "serverinfo",
	aliases: ["server", "guild"],
	description: "Get info about the current server.",
	category: "Info",
	run: async (client, message) =>
	{
		// Define the server.
		const server = message.guild;

		// Define the time the server was create at.
		const serverCreated = server.createdAt.toString().split(" ");

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

		// Create and send the embed.
		const serverInfoEmbed = new Discord.MessageEmbed()
			.setColor("#2c3334")
			.setTitle(server.name)
			.setThumbnail(server.iconURL())
			.addFields
			(
				{ name: "Owner", value: server.owner, inline: true },
				{ name: "Region", value: fixedRegions[server.region], inline: true },
				{ name: "Created at", value: serverCreated[2] + " " + serverCreated[1] + " " + serverCreated[3], inline: true },
				{ name: "Members", value: server.memberCount, inline: true },
				{ name: "Channels", value: server.channels.cache.size, inline: true },
				{ name: "Roles", value: server.roles.cache.size, inline: true },
			)
			.setFooter(`ID: ${server.id}`)
			.setTimestamp();
		message.channel.send(serverInfoEmbed);
	}
};

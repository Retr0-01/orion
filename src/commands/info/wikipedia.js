module.exports =
{
	name: "wikipedia",
	aliases: ["wiki", "wp"],
	description: "Search a Wikipedia article.",
	category: "Info",
	usage: "[article to search]",
	run: async (client, message, args) =>
	{
		if (args[0]) message.channel.send("n a h");
	}
};

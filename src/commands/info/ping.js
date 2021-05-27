module.exports =
{
	name: "ping",
	description: "Pong!",
	category: "Info",
	run: async (client, message) =>
	{
		// Post a message.
		const msg = await message.channel.send("Pinging....");

		// Edit the message so we can determine the latency.
		msg.edit(`**Pong!** \n> Latency: **${Math.floor(msg.createdTimestamp - message.createdTimestamp)}ms** \n> API Latency: **${Math.round(client.ws.ping)}ms**`);
	}
};

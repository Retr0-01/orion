const { botStatus } = require("../config.json");

module.exports = (client) =>
{
	console.log(`[EVENT] - Successfully connected to Discord! ${client.user.username} is now online.`);
	client.user.setActivity(botStatus.activity, { type: botStatus.activityType });
};

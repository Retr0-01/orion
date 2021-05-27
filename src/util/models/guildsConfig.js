const mongoose = require("mongoose");

// We create our model from a schema with the fields we want...
const guildsConfigSchema = new mongoose.Schema
({
	guildID: Number,
	prefix: String,
	cooldown: Number,
	autoroleID: Number,
	moderation:
	{
		dmOnAction: Boolean,
		mutedRoleID: Number
	},
	modLogWebhook:
	{
		id: Number,
		token: Number
	},
	messageLogWebhook:
	{
		id: Number,
		token: Number
	},
	memberLogWebhook:
	{
		id: Number,
		token: Number
	}
},{ collection: "guildsConfig", versionKey: false });

// and export it.
module.exports = mongoose.model("guildsConfig", guildsConfigSchema);

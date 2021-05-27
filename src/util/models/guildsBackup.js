const mongoose = require("mongoose");

// We create our model from a schema with the fields we want...
const guildsBackupSchema = new mongoose.Schema
({
	ownerID: Number,
	data: {},
},{ collection: "guildsBackup", versionKey: false });

// and export it.
module.exports = mongoose.model("guildsBackup", guildsBackupSchema);

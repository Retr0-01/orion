module.exports =
{
	apps :
  [{
  	name: "orion",
  	script: "./src/bot.js",
  	watch: true,
  	wait_ready: true,
  	shutdown_with_message: true,
  	ignore_watch: ["logs", "node_modules", ".vscode"],
  	log_date_format: "DD-MM-YYYY HH:mm Z",
  	error_file: "./logs/error.log",
  	out_file: "./logs/output.log"
  }]
};

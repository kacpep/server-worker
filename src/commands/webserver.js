const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("webserver")
		.setDescription("Server management.")
		.addSubcommand((option) =>
			option.setName("off").setDescription("Turn off the nginx.")
		)
		.addSubcommand((option) =>
			option.setName("on").setDescription("Turn on the nginx.")
		),
};

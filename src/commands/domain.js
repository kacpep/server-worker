const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("domain")
		.setDescription("Domain management on the server.")
		.addSubcommand((option) =>
			option
				.setName("manage")
				.setDescription("management")
				.addStringOption((option) =>
					option.setName("name").setDescription("Enter the domain name").setRequired(true)
				)
		)
		.addSubcommand((option) =>
			option.setName("list").setDescription("All enabled domains.")
		)
		.addSubcommand((option) =>
			option
				.setName("certificates")
				.setDescription("Certificate of all domains.")
		),
};

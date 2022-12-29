const { SlashCommandBuilder } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("domain")
		.setDescription("Domain management on the server.")
		.addStringOption((option) =>
			option
				.setName("name")
				.setDescription("Enter the domain name")
				.setRequired(true)
		),
};

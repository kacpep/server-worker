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
		)
		.addSubcommand((option) =>
			option.setName("restart").setDescription("Restart  nginx.")
		)
		.addSubcommandGroup((option) =>
			option
				.setName("users")
				.setDescription("Manage users on webserver.")
				.addSubcommand((option) =>
					option
						.setName("add")
						.setDescription("Add user to the webserver.")
						.addUserOption((option) =>
							option.setName("user").setDescription("Select user")
						)
				)
				.addSubcommand((option) =>
					option
						.setName("remove")
						.setDescription("Remove user from the webserver.")
						.addUserOption((option) =>
							option.setName("user").setDescription("Select user")
						)
				)
				.addSubcommand((option) =>
					option.setName("list").setDescription("List of users webserver.")
				)
		),
};

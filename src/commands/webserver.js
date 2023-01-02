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
		)
		.addSubcommandGroup((option) =>
			option
				.setName("message-visibility")
				.setDescription("Visibility of messages to everyone or only for one user.")
				.addSubcommand((option) =>
					option.setName("hiden").setDescription("Hide messages.")
				)
				.addSubcommand((option) =>
					option.setName("visible").setDescription("Show messages.")
				)
		),
};

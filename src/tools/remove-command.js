const { REST, Routes } = require("discord.js");
require("dotenv").config({ path: "../../.env" });

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

rest
	.delete(
		Routes.applicationCommand(process.env.CLIENT_ID, "1057973449097744444")
	)
	.then(() => console.log("Successfully deleted application command"))
	.catch(console.error);

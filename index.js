const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
require("dotenv").config();
const wait = require("node:timers/promises").setTimeout;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
var domain = "";
client.commands = new Collection();
const commandsPath = path.join(__dirname, "src/commands");
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

client.once(Events.ClientReady, () => {
	console.log("Ready!");
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	if (interaction.commandName === "domain") {
		domain =  interaction.options.getString("name");
		require("./src/actions/domainOptions").go(interaction);
	}
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isButton()) return;
	if (interaction.customId === "add") {
		require("./src/actions/domainAdd").add(interaction, domain);
	}
});

client.login(process.env.DISCORD_TOKEN);

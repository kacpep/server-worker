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
		let subCommand = interaction.options.getSubcommand();
		if (subCommand == "manage") {
			domain = interaction.options.getString("name");
			require("./src/actions/domainOptions").manage(interaction, domain);
		}
		if (subCommand == "list") {
			require("./src/actions/domainList").list(interaction);
		}
		if (subCommand == "certificates") {
			require("./src/actions/domainList").certificates(interaction);
		}
	}
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isButton()) return;
	if (
		interaction.customId === "add" ||
		interaction.customId === "remove" ||
		interaction.customId === "update"
	) {
		await interaction.message.delete();
		await interaction.deferReply();
	}
	if (interaction.customId === "add") {
		require("./src/actions/domainAdd").protocol(interaction, domain);
	}
	if (interaction.customId === "remove") {
		require("./src/actions/domainRemove").definitely(interaction, domain);
	}
	if (interaction.customId === "update") {
		require("./src/actions/domainUpdate").updateManage(interaction, domain);
	}
	if (interaction.customId === "removesure") {
		require("./src/actions/domainRemove").remove(interaction, domain);
	}
	if (interaction.customId === "cancelremove") {
		await interaction.message.delete();
	}
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isStringSelectMenu()) return;
	if (interaction.customId === "selectProtocol") {
		await interaction.message.delete();

		await interaction.deferReply();

		if (interaction.values == 443) {
			require("./src/actions/domainAdd").addHTTPS(interaction, domain);
		} else {
			require("./src/actions/domainAdd").addHTTP(interaction, domain);
		}
	}
});

client.login(process.env.DISCORD_TOKEN);

const fs = require("node:fs");
const path = require("node:path");
const {
	Client,
	Collection,
	Events,
	GatewayIntentBits,
	ChannelType,
} = require("discord.js");
require("dotenv").config();
const wait = require("node:timers/promises").setTimeout;
const readline = require("node:readline");
async function countLines(input) {
	let lineCount = 0;

	for await (const _ of readline.createInterface({
		input,
		crlfDelay: Infinity,
	})) {
		lineCount++;
	}

	return lineCount;
}
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

client.once(Events.ClientReady, async () => {
	console.log("Ready!");
	guild = client.guilds.cache.get(process.env.GUILD_ID);
	if (
		!guild.channels.cache.find(
			(channel) =>
				channel.type == ChannelType.GuildCategory &&
				channel.name == process.env.CATEGORY_NAME
		)
	) {
		await guild.channels.create({
			name: process.env.CATEGORY_NAME,
			type: ChannelType.GuildCategory,
		});
	}
	let category = await guild.channels.cache.find(
		(channel) =>
			channel.type == ChannelType.GuildCategory &&
			channel.name == process.env.CATEGORY_NAME
	);
	if (
		!guild.channels.cache.find(
			(c) => c.name.toLowerCase() === process.env.CHANNEL_NAME
		)
	) {
		guild.channels
			.create({
				name: process.env.CHANNEL_NAME,
				type: ChannelType.GuildText,
			})
			.then((channel) => {
				channel.setParent(category.id);
			});
	}
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (
		client.channels.cache.get(interaction.channelId).name ==
		process.env.CHANNEL_NAME
	) {
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
	} else {
		interaction.reply({
			content: `Wrong channel. Correct: 👉 <#${
				guild.channels.cache.find(
					(c) => c.name.toLowerCase() === process.env.CHANNEL_NAME
				).id
			}>`,
			ephemeral: true,
		});
	}
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isButton()) return;
	if (
		interaction.customId === "add" ||
		interaction.customId === "remove" ||
		interaction.customId === "update" ||
		interaction.customId === "changeProtocol"
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
	if (interaction.customId === "cancel") {
		await interaction.message.delete();
	}
	if (interaction.customId === "changeProtocol") {
		require("./src/actions/domainUpdate").selectChangeProtocol(
			interaction,
			domain
		);
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
	if (interaction.customId === "selectChangeProtocol") {
		await interaction.message.delete();

		if (interaction.values == 443) {
			if (
				(await countLines(
					fs.createReadStream(path.join("/etc/nginx/sites-available", domain))
				)) <= 11
			) {
				await interaction.deferReply({ ephemeral: false });

				require("./src/actions/domainUpdate").changeToHTTPS(
					interaction,
					domain
				);
			} else {
				await interaction.deferReply({ ephemeral: true });

				await interaction.editReply({
					content: `You cannot change the protocol to the same!`,
					ephemeral: true,
				});
			}
		} else {
			if (
				!(await countLines(
					fs.createReadStream(path.join("/etc/nginx/sites-available", domain))
				)) <= 11
			) {
				await interaction.deferReply({ ephemeral: false });

				require("./src/actions/domainUpdate").changeToHTTP(interaction, domain);
			} else {
				await interaction.deferReply({ ephemeral: true });

				await interaction.editReply({
					content: `You cannot change the protocol to the same!`,
					ephemeral: true,
				});
			}
		}
	}
});

client.login(process.env.DISCORD_TOKEN);

const fs = require("node:fs");
const path = require("node:path");
const nconf = require("nconf");

const configPath = path.join(__dirname, "src/configs/config.json");
nconf.file("default", configPath);

let root = nconf.get("root");

const {
	Client,
	Collection,
	Events,
	GatewayIntentBits,
	ChannelType,
	ActivityType,
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

	client.user.setActivity("better side..", { type: ActivityType.Watching });

	guild = client.guilds.cache.get(process.env.GUILD_ID);
	if (
		!guild.channels.cache.find(
			(channel) =>
				channel.type == ChannelType.GuildCategory &&
				channel.name == nconf.get("categoryName")
		)
	) {
		await guild.channels.create({
			name: nconf.get("categoryName"),
			type: ChannelType.GuildCategory,
		});
	}
	let category = await guild.channels.cache.find(
		(channel) =>
			channel.type == ChannelType.GuildCategory &&
			channel.name == nconf.get("categoryName")
	);
	if (
		!guild.channels.cache.find(
			(c) => c.name.toLowerCase() === nconf.get("channelName")
		)
	) {
		guild.channels
			.create({
				name: nconf.get("channelName"),
				type: ChannelType.GuildText,
			})
			.then((channel) => {
				channel.setParent(category.id);
			});
	}
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;
	nconf.file("default", configPath);
	let users = Object.assign([], nconf.get("users"));

	if (root != interaction.user.tag && !users.includes(interaction.user.tag)) {
		interaction.reply({
			content: `You aren't authorized!`,
			ephemeral: true,
		});
		return;
	}
	if (
		client.channels.cache.get(interaction.channelId).name !=
		nconf.get("channelName")
	) {
		interaction.reply({
			content: `Wrong channel. Correct one: 👉 <#${
				guild.channels.cache.find(
					(c) => c.name.toLowerCase() === nconf.get("channelName")
				).id
			}>`,
			ephemeral: true,
		});
		return;
	}

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
	if (interaction.commandName === "webserver") {
		let subCommand = interaction.options.getSubcommand();
		let subCommandGrup = interaction.options.getSubcommandGroup();

		if (subCommand == "off") {
			require("./src/actions/serverManage").off(interaction);
		}
		if (subCommand == "on") {
			require("./src/actions/serverManage").on(interaction);
		}

		if (interaction.user.tag == root) {
			if (subCommandGrup == "message-visibility") {
				if (subCommand == "hiden") {
					require("./src/actions/serverManage").hide(interaction);
				}
				if (subCommand == "visible") {
					require("./src/actions/serverManage").show(interaction);
				}
			}
			if (subCommandGrup == "users") {
				if (subCommand == "add") {
					require("./src/actions/serverManage").userAdd(interaction);
				}
				if (subCommand == "remove") {
					require("./src/actions/serverManage").userRemove(interaction);
				}
				if (subCommand == "list") {
					require("./src/actions/serverManage").usersList(interaction);
				}
			}
		} else {
			interaction.reply({
				content: `You haven't permission to do that!`,
				ephemeral: true,
			});
		}
	}
});
client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isButton()) return;
	nconf.file("default", configPath);
	let users = Object.assign([], nconf.get("users"));
	if (root != interaction.user.tag && !users.includes(interaction.user.tag)) {
		interaction.reply({
			content: `You aren't authorized!`,
			ephemeral: true,
		});
		return;
	}
	let domain = interaction.message.embeds[0].data.fields[0].value;

	if (
		interaction.customId === "add" ||
		interaction.customId === "remove" ||
		interaction.customId === "update" ||
		interaction.customId === "changeProtocol"
	) {
		if (!nconf.get("messageVisibility")) {
			await interaction.message.delete();

			await interaction.deferReply({
				ephemeral: nconf.get("messageVisibility"),
			});
		}
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
		if (!nconf.get("messageVisibility")) {
			await interaction.message.delete();
		} else {
			let enabled = {
				color: 0xff0000,
				title: "Canceled!",
				footer: {
					text: "made by ~ kacpep.dev",
					icon_url: "https://i.imgur.com/M0uWxCA.png",
				},
			};
			await interaction.update({
				content: "",
				embeds: [enabled],
				components: [],
				ephemeral: nconf.get("messageVisibility"),
			});
		}
	}
	if (interaction.customId === "changeProtocol") {
		require("./src/actions/domainUpdate").selectChangeProtocol(
			interaction,
			domain
		);
	}
	if (interaction.customId === "portForwarding") {
		require("./src/actions/domainUpdate").selectPortForwarding(
			interaction,
			domain
		);
	}
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isStringSelectMenu()) return;
	nconf.file("default", configPath);
	let users = Object.assign([], nconf.get("users"));

	if (root != interaction.user.tag && !users.includes(interaction.user.tag)) {
		interaction.reply({
			content: `You are not authorized!`,
			ephemeral: true,
		});
		return;
	}

	let domain = interaction.message.embeds[0].data.fields[0].value;

	if (interaction.customId === "selectProtocol") {
		if (!nconf.get("messageVisibility")) {
			await interaction.message.delete();
			await interaction.deferReply({
				ephemeral: nconf.get("messageVisibility"),
			});
		}

		if (interaction.values == 443) {
			require("./src/actions/domainAdd").addHTTPS(interaction, domain);
		} else {
			require("./src/actions/domainAdd").addHTTP(interaction, domain);
		}
	}
	if (interaction.customId === "selectChangeProtocol") {
		if (!nconf.get("messageVisibility")) await interaction.message.delete();

		if (interaction.values == 443) {
			if (
				(await countLines(
					fs.createReadStream(path.join("/etc/nginx/sites-available", domain))
				)) <= 10
			) {
				if (!nconf.get("messageVisibility"))
					await interaction.deferReply({
						ephemeral: nconf.get("messageVisibility"),
					});

				require("./src/actions/domainUpdate").changeToHTTPS(
					interaction,
					domain
				);
			} else {
				await interaction.deferReply({ ephemeral: true });
				await interaction.editReply({
					content: `You can't change the protocol to the same like it was!`,
					ephemeral: true,
				});
			}
		} else {
			if (
				!(await countLines(
					fs.createReadStream(path.join("/etc/nginx/sites-available", domain))
				)) <= 10
			) {
				if (!nconf.get("messageVisibility"))
					await interaction.deferReply({
						ephemeral: nconf.get("messageVisibility"),
					});

				require("./src/actions/domainUpdate").changeToHTTP(interaction, domain);
			} else {
				await interaction.deferReply({ ephemeral: true });

				await interaction.editReply({
					content: `You can't change the protocol to the same like it was!`,
					ephemeral: true,
				});
			}
		}
	}
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isModalSubmit()) return;
	nconf.file("default", configPath);
	let users = Object.assign([], nconf.get("users"));

	if (root != interaction.user.tag && !users.includes(interaction.user.tag)) {
		interaction.reply({
			content: `You aren't authorized!`,
			ephemeral: true,
		});
		return;
	}

	let domain = interaction.message.embeds[0].data.fields[0].value;
	if (!nconf.get("messageVisibility")) await interaction.message.delete();

	if (interaction.customId === "modalPortForwarding") {
		let port = interaction.fields.getTextInputValue("newPort");
		if (isNaN(port) && port != "default") {
			await interaction.deferReply({ ephemeral: true });

			interaction.editReply({
				content: "Port have to be a number!",
				ephemeral: true,
			});
			return;
		} else {
			require("./src/actions/domainUpdate").portForwarding(interaction, domain);
		}
	}
});

client.login(process.env.DISCORD_TOKEN);

process.on("uncaughtException", (error) => {
	console.log("-----handler-------");
	console.log(error);
	console.log("-----handler-------");
	process.exit(1);
});

const {
	ActionRowBuilder,
	StringSelectMenuBuilder,
	EmbedBuilder,
} = require("discord.js");

const fs = require("node:fs");
const path = require("node:path");
const { exec } = require("child_process");

async function protocol(interaction, domain) {
	if (!(await checkExists(interaction, domain))) return;

	const domainEmbed = new EmbedBuilder()
		.setColor(0x0099ff)
		.setTitle("Choose")
		.setDescription("What internet protocol do you want to choose?")
		.setThumbnail("https://i.imgur.com/w8hzuoa.png")

		.addFields({
			name: "Domain name:",
			value: `${domain}`,
			inline: true,
		})
		.setTimestamp()
		.setFooter({
			text: "made by ~ kacpep.dev",
			iconURL: "https://i.imgur.com/M0uWxCA.png",
		});
	const selectMenu = new ActionRowBuilder().addComponents(
		new StringSelectMenuBuilder()
			.setCustomId("selectProtocol")
			.setPlaceholder("Default HTTP")
			.addOptions(
				{
					label: "HTTP",
					description: "Standart port add (cloudflare proxy ssl)",
					value: "80",
				},
				{
					label: "HTTPS",
					description: "SSL certificate ~ certbot python",
					value: "443",
				}
			)
	);

	await interaction.reply({
		embeds: [domainEmbed],
		components: [selectMenu],
	});
}
async function checkExists(interaction, domain) {
	let htmlFolder = __dirname + "/var/www";
	let availableSiteFolder = __dirname + "/etc/nginx/sites-available";
	let enabledSiteFolder = __dirname + "/etc/nginx/sites-enabled";

	const publicHtml = path.join(__dirname, "/var/www");

	const filePath = path.join("/var/www", domain);
	const availablPath = path.join("/etc/nginx/sites-available", domain);
	const enabledPath = path.join("/etc/nginx/sites-enabled", domain);

	if (
		fs.existsSync(filePath) ||
		fs.existsSync(availablPath) ||
		fs.existsSync(enabledPath)
	) {
		const Embed = new EmbedBuilder()
			.setColor(0xf50101)
			.setTitle("!Error domain exists")
			.setThumbnail("https://i.imgur.com/w8hzuoa.png")
			.addFields({
				name: "Domain name:",
				value: `${domain}`,
				inline: true,
			})
			.setTimestamp()
			.setFooter({
				text: "made by ~ kacpep.dev",
				iconURL: "https://i.imgur.com/M0uWxCA.png",
			});

		await interaction.reply({
			embeds: [Embed],
			components: [],
		});
		return false;
	} else {
		return true;
	}
}
async function error(interaction, domain, err) {
	const Embed = new EmbedBuilder()
		.setColor(0x55ff00)
		.setTitle("!Error")
		.setDescription(`Error: ${err}`)

		.setThumbnail("https://i.imgur.com/w8hzuoa.png")
		.addFields({
			name: "Domain name:",
			value: `${domain}`,
			inline: true,
		})
		.setTimestamp()
		.setFooter({
			text: "made by ~ kacpep.dev",
			iconURL: "https://i.imgur.com/M0uWxCA.png",
		});

	await interaction.update({
		embeds: [Embed],
		components: [],
	});
	return true;
}

async function add(interaction, domain) {
	interaction.message.delete();

	const filePath = path.join("/var/www", domain);
	const availablPath = path.join("/etc/nginx/sites-available", domain);
	const enabledPath = path.join("/etc/nginx/sites-enabled", domain);
	const publicHtml = path.join(filePath, "public_html");

	fs.mkdirSync(publicHtml, { recursive: true });
	fs.writeFileSync(
		availablPath,
		eval(fs.readFileSync(__dirname + "/../templates/nginxHTTP", "utf8"))
	);
	fs.link(availablPath, enabledPath, (er) => {
		console.log(er);
	});
	exec("nginx -t", async (er, stdout, stderr) => {
		if (error) {
			console.log(`error: ${error.message}`);
			// if (await error(interaction, domain, error.message)) return;

			return;
		}
		if (stderr) {
			console.log(`stderr: ${stderr}`);
			exec("sudo systemctl restart nginx", async (er, stdout, stderr) => {
				if (error) {
					// if (await error(interaction, domain, error.message)) return;
					console.log(`error: ${error.message}`);
					return;
				}
				if (stderr) {
					console.log(`stderr: ${stderr}`);
					return;
				}
				console.log(`stdout: ${stdout}`);
			});
			return;
		}
		console.log(`stdout: ${stdout}`);
	});

	const Embed = new EmbedBuilder()
		.setColor(0x00ff00)
		.setTitle("Success")
		.setDescription(`Domain is deployed!`)
		.setURL(`http://${domain}`)
		.setThumbnail("https://i.imgur.com/w8hzuoa.png")
		.addFields({
			name: "Domain name:",
			value: `${domain}`,
			inline: true,
		})
		.setTimestamp()
		.setFooter({
			text: "made by ~ kacpep.dev",
			iconURL: "https://i.imgur.com/M0uWxCA.png",
		});

	await interaction.reply({
		content: "",
		embeds: [Embed],
		components: [],
	});
}

module.exports = { protocol, checkExists, add };

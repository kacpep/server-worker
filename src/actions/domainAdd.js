const {
	ActionRowBuilder,
	StringSelectMenuBuilder,
	EmbedBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require("discord.js");

const fs = require("node:fs");
const path = require("node:path");
const { execSync } = require("child_process");
const nconf = require("nconf");

async function protocol(interaction, domain) {
	if (!(await checkExists(interaction, domain))) return;

	const domainEmbed = new EmbedBuilder()
		.setColor(0x0099ff)
		.setTitle("?Choose?")
		.setDescription("Which protocol do you want to choose?")
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
					description: "Add default port (cloudflare proxy ssl)",
					value: "80",
				},
				{
					label: "HTTPS",
					description: "SSL certificate ~ certbot python",
					value: "443",
				}
			)
	);

	await interaction.update({
		content: "",
		embeds: [domainEmbed],
		components: [selectMenu],
		ephemeral: true,
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
			.setTitle("!Error, domain already exists!")
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
		const btns = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId("remove")
					.setLabel("remove")
					.setEmoji("💥")
					.setStyle(ButtonStyle.Danger)
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId("update")
					.setLabel("update")
					.setEmoji("⚙️")
					.setStyle(ButtonStyle.Secondary)
			);

		await interaction.update({
			content: "",
			embeds: [Embed],
			components: [btns],
			ephemeral: true,
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
		ephemeral: true,
	});
	return true;
}

async function addHTTP(interaction, domain) {
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

	execSync("nginx -t", { encoding: "utf8" });
	execSync("sudo systemctl restart nginx", {
		encoding: "utf8",
	});

	try {
		fs.copyFileSync(
			path.join(__dirname, "/../templates/index.html"),
			path.join(publicHtml, "index.html"),
			fs.constants.COPYFILE_EXCL
		);
	} catch {}
	const Embed = new EmbedBuilder()
		.setColor(0x00ff00)
		.setTitle("!Success")
		.setDescription(`Domain deployed successfully!`)
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

	await interaction.editReply({
		content: "",
		embeds: [Embed],
		components: [],
		ephemeral: true,
	});
}
async function addHTTPS(interaction, domain) {
	const filePath = path.join("/var/www", domain);
	const availablPath = path.join("/etc/nginx/sites-available", domain);
	const enabledPath = path.join("/etc/nginx/sites-enabled", domain);
	const publicHtml = path.join(filePath, "public_html");

	fs.mkdirSync(publicHtml, { recursive: true });
	fs.writeFileSync(
		availablPath,
		eval(
			fs.readFileSync(path.join(__dirname, "/../templates/nginxHTTP"), "utf8")
		)
	);
	fs.link(availablPath, enabledPath, (er) => {
		console.log(er);
	});

	execSync("nginx -t", { encoding: "utf8" });
	execSync("sudo systemctl restart nginx", {
		encoding: "utf8",
	});

	let sameCertificates = fs
		.readdirSync("/etc/letsencrypt/live/")
		.filter((file) => file.startsWith(domain));
	sameCertificates.unshift(domain);

	let certificate = sameCertificates[sameCertificates.length - 1];

	execSync(
		`certbot certonly --noninteractive --nginx --agree-tos --register-unsafely-without-email -d ${domain}`,
		{ encoding: "utf8" }
	);

	fs.writeFileSync(
		availablPath,
		eval(
			fs.readFileSync(path.join(__dirname, "/../templates/nginxHTTPS"), "utf8")
		)
	);

	execSync("nginx -t", { encoding: "utf8" });
	execSync("sudo systemctl restart nginx", {
		encoding: "utf8",
	});
	try {
		fs.copyFileSync(
			path.join(__dirname, "/../templates/index.html"),
			path.join(publicHtml, "index.html"),
			fs.constants.COPYFILE_EXCL
		);
	} catch {}

	const Embed = new EmbedBuilder()
		.setColor(0x00ff00)
		.setTitle("!Success")
		.setDescription(`Domain deployed successfully!`)
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

	await interaction.editReply({
		content: "",
		embeds: [Embed],
		components: [],
		ephemeral: true,
	});
}

module.exports = { protocol, checkExists, addHTTP, addHTTPS };

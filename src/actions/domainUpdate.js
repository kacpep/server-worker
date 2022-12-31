const {
	ActionRowBuilder,
	EmbedBuilder,
	ButtonBuilder,
	ModalBuilder,
	TextInputBuilder,
	TextInputStyle,
	StringSelectMenuBuilder,
	ButtonStyle,
} = require("discord.js");
const fs = require("node:fs");
const readline = require("node:readline");
const path = require("node:path");
const { execSync } = require("child_process");
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
async function updateManage(interaction, domain) {
	const Embed = new EmbedBuilder()
		.setColor(0x0099ff)
		.setTitle("?What do you want to update?")
		.setDescription("Select what you want to update on this domain")
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
				.setCustomId("portForwarding")
				.setLabel("port forwarding")
				.setEmoji("↗️")
				.setStyle(ButtonStyle.Secondary)
		)
		.addComponents(
			new ButtonBuilder()
				.setCustomId("changeProtocol")
				.setLabel("change the protocol")
				.setEmoji("🎚️")
				.setStyle(ButtonStyle.Secondary)
		);

	await interaction.editReply({
		embeds: [Embed],
		components: [btns],
	});
}
async function selectChangeProtocol(interaction, domain) {
	let currentProtocol = "HTTPS";
	let descriptionHTTP = "Standart port add (cloudflare proxy ssl)";
	let descriptionHTTPS = "SSL certificate ~ certbot python";
	if (
		(await countLines(
			fs.createReadStream(path.join("/etc/nginx/sites-available", domain))
		)) <= 10
	) {
		currentProtocol = "HTTP";
		descriptionHTTP = "Current";
	} else {
		descriptionHTTPS = "Current";
	}
	const domainEmbed = new EmbedBuilder()
		.setColor(0x0099ff)
		.setTitle("?Choose?")
		.setDescription("What internet protocol do you want to choose?")
		.setThumbnail("https://i.imgur.com/w8hzuoa.png")

		.addFields({
			name: "Domain name:",
			value: `${domain}`,
			inline: false,
		})
		.addFields({
			name: "Current protocol:",
			value: `${currentProtocol}`,
			inline: false,
		})
		.setTimestamp()
		.setFooter({
			text: "made by ~ kacpep.dev",
			iconURL: "https://i.imgur.com/M0uWxCA.png",
		});

	const selectMenu = new ActionRowBuilder().addComponents(
		new StringSelectMenuBuilder()
			.setCustomId("selectChangeProtocol")
			.setPlaceholder("Select")
			.addOptions(
				{
					label: "HTTP",
					description: descriptionHTTP,
					value: "80",
				},
				{
					label: "HTTPS",
					description: descriptionHTTPS,
					value: "443",
				}
			)
	);

	const btns = new ActionRowBuilder().addComponents(
		new ButtonBuilder()
			.setCustomId("cancel")
			.setEmoji("⛔")
			.setLabel("cancel")
			.setStyle(ButtonStyle.Danger)
	);

	await interaction.editReply({
		embeds: [domainEmbed],
		components: [selectMenu, btns],
		ephemeral: false,
	});
}
async function changeToHTTP(interaction, domain) {
	const filePath = path.join("/var/www", domain);
	const availablPath = path.join("/etc/nginx/sites-available", domain);
	const enabledPath = path.join("/etc/nginx/sites-enabled", domain);
	const publicHtml = path.join(filePath, "public_html");
	fs.mkdirSync(publicHtml, { recursive: true });
	fs.writeFileSync(
		availablPath,
		eval(fs.readFileSync(__dirname + "/../templates/nginxHTTP", "utf8"))
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
		.setTitle("!Success!")
		.setDescription(`Domain is updated!`)
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
	});
}
async function changeToHTTPS(interaction, domain) {
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
		.setTitle("!Success!")
		.setDescription(`Domain is updated!`)
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
	});
}
async function selectPortForwarding(interaction, domain) {
	const modal = new ModalBuilder()
		.setCustomId("modalPortForwarding")
		.setTitle("Set forwarding prot")
		.addComponents(
			new ActionRowBuilder().addComponents(
				new TextInputBuilder()
					.setCustomId("newPort")
					.setLabel("What port do you want to redirect to?")
					.setStyle(TextInputStyle.Short)
					.setMinLength(2)
					.setMaxLength(7)
					.setPlaceholder("3000 or default")
			)
		);
	await interaction.showModal(modal);
}
async function portForwarding(interaction, domain) {
	let port = interaction.fields.getTextInputValue("newPort");
	if (port != "default") {
		const availablPath = path.join("/etc/nginx/sites-available", domain);
		let file = fs.readFileSync(availablPath, "utf8");
		if (/location(.*?\s*)#ZW5k/gm.test(file)) {
			await interaction.deferReply();

			fs.writeFileSync(
				availablPath,
				file.replace(
					/location(.*?\s*)#ZW5k/gm,
					eval(
						fs.readFileSync(
							path.join(__dirname, "/../templates/nginxPortForwarding"),
							"utf8"
						)
					)
				)
			);
			execSync("nginx -t", { encoding: "utf8" });
			execSync("sudo systemctl restart nginx", {
				encoding: "utf8",
			});
			const Embed = new EmbedBuilder()
				.setColor(0x00ff00)
				.setTitle("!Success!")
				.setDescription(`Port forwarding done!`)
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
			});
		} else {
			await interaction.deferReply({ ephemeral: true });

			await interaction.editReply({
				content: "Error I can't change the port. try: remove and add domain",
				ephemeral: true,
			});
		}
	} else {
		const availablPath = path.join("/etc/nginx/sites-available", domain);
		let file = fs.readFileSync(availablPath, "utf8");

		await interaction.deferReply();

		fs.writeFileSync(
			availablPath,
			file.replace(
				/location(.*?\s*)#ZW5k/gm,
				eval(
					fs.readFileSync(
						path.join(__dirname, "/../templates/nginxPortDefault"),
						"utf8"
					)
				)
			)
		);
		execSync("nginx -t", { encoding: "utf8" });
		execSync("sudo systemctl restart nginx", {
			encoding: "utf8",
		});
		const Embed = new EmbedBuilder()
			.setColor(0x00ff00)
			.setTitle("!Success!")
			.setDescription(`Port forwarding done!`)
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
		});
	}
}
module.exports = {
	updateManage,
	selectChangeProtocol,
	changeToHTTP,
	changeToHTTPS,
	selectPortForwarding,
	portForwarding,
};

const fs = require("node:fs");
const nconf = require("nconf");

async function list(interaction) {
	let allEnabledDomain = fs
		.readdirSync("/etc/nginx/sites-enabled")
		.filter((file) => file != "default");
	let fieldsDomains = [
		{
			name: "\u200B",
			value: "Domain:",
			inline: false,
		},
	];
	if (allEnabledDomain.length == 0) {
		fieldsDomains.push({
			name: "--------------------------",
			value: `There is no domains.`,
			inline: false,
		});
	}

	for (let domain in allEnabledDomain) {
		fieldsDomains.push({
			name: "--------------------------",
			value: `${parseInt(domain) + 1}.  ${allEnabledDomain[domain]}`,
			inline: false,
		});
	}
	fieldsDomains.push({
		name: "--------------------------",
		value: "\u200B",
		inline: false,
	});
	let enabledDomain = {
		color: 0x0099ff,
		title: "Enabled domains",
		description: "What is this? All enabled domains",
		thumbnail: {
			url: "https://i.imgur.com/w8hzuoa.png",
		},
		fields: fieldsDomains,
		footer: {
			text: "made by ~ kacpep.dev",
			icon_url: "https://i.imgur.com/M0uWxCA.png",
		},
	};
	await interaction.reply({
		content: "",
		embeds: [enabledDomain],
		components: [],
		ephemeral: nconf.get("messageVisibility"),
	});
}
async function certificates(interaction) {
	let allCertificate = fs
		.readdirSync("/etc/letsencrypt/live/")
		.filter((file) => file != "README");
	let fieldsCertificate = [
		{
			name: "\u200B",
			value: "Cecertificate:",
			inline: false,
		},
	];
	if (allCertificate.length == 0) {
		fieldsCertificate.push({
			name: "--------------------------",
			value: `There is no certificates.`,
			inline: false,
		});
	}

	for (let cert in allCertificate) {
		fieldsCertificate.push({
			name: "--------------------------",
			value: `${parseInt(cert) + 1}.  ${allCertificate[cert]}`,
			inline: false,
		});
	}
	fieldsCertificate.push({
		name: "--------------------------",
		value: "\u200B",
		inline: false,
	});
	let certificate = {
		color: 0x0099ff,
		title: "All certificates",
		description: "What is this? Certificate of all domains (SSL).",
		thumbnail: {
			url: "https://i.imgur.com/w8hzuoa.png",
		},
		fields: fieldsCertificate,
		footer: {
			text: "made by ~ kacpep.dev",
			icon_url: "https://i.imgur.com/M0uWxCA.png",
		},
	};
	await interaction.reply({
		content: "",
		embeds: [certificate],
		components: [],
		ephemeral: nconf.get("messageVisibility"),
	});
}

module.exports = { list, certificates };

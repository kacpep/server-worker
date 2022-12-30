const fs = require("node:fs");

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
	});
}

module.exports = { list };

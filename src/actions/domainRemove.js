const fs = require("node:fs");
const path = require("node:path");
const { EmbedBuilder } = require("discord.js");

async function remove(interaction, domain) {
	const filePath = path.join("/var/www", domain);
	const availablPath = path.join("/etc/nginx/sites-available", domain);
	const enabledPath = path.join("/etc/nginx/sites-enabled", domain);
	const publicHtml = path.join(filePath, "public_html");
	if (
		fs.existsSync(filePath) ||
		fs.existsSync(availablPath) ||
		fs.existsSync(enabledPath)
	) {
		try {
			fs.rmSync(filePath, { recursive: true, force: true });
		} catch {}

		try {
			fs.rmSync(availablPath, { recursive: true, force: true });
		} catch {}
		try {
			fs.rmSync(enabledPath, { recursive: true, force: true });
		} catch {}
		const Embed = new EmbedBuilder()
			.setColor(0x00ff00)
			.setTitle("!Success")
			.setDescription(`Files deleted.`)
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
	} else {
		const Embed = new EmbedBuilder()
			.setColor(0xff0000)
			.setTitle("!Error ")
			.setDescription(`Error files doesn't exists.`)
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
	}
}
module.exports = { remove };

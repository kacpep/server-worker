const fs = require("node:fs");
const path = require("node:path");
const {
	EmbedBuilder,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
} = require("discord.js");
const { execSync } = require("child_process");

async function remove(interaction, domain) {
	await interaction.message.delete();
	await interaction.deferReply();

	const filePath = path.join("/var/www", domain);
	const availablPath = path.join("/etc/nginx/sites-available", domain);
	const enabledPath = path.join("/etc/nginx/sites-enabled", domain);
	const certificateSite = path.join("/etc/letsencrypt/live/", domain);

	const publicHtml = path.join(filePath, "public_html");
	if (
		fs.existsSync(filePath) ||
		fs.existsSync(availablPath) ||
		fs.existsSync(enabledPath) ||
		fs.existsSync(certificateSite)
	) {
		try {
			fs.rmSync(filePath, { recursive: true, force: true });
		} catch {}
		try {
			execSync(
				`certbot delete --nginx --noninteractive --cert-name ${domain}`,
				{
					encoding: "utf8",
				}
			);
		} catch {}

		try {
			fs.rmSync(availablPath, { recursive: true, force: true });
		} catch {}
		try {
			fs.rmSync(enabledPath, { recursive: true, force: true });
		} catch {}
		const Embed = new EmbedBuilder()
			.setColor(0x00ff00)
			.setTitle("!Success!")
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

		await interaction.editReply({
			embeds: [Embed],
			components: [],
		});
	} else {
		const Embed = new EmbedBuilder()
			.setColor(0xff0000)
			.setTitle("!Error!")
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
		const btns = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId("add")
					.setEmoji("🔨")
					.setLabel("add")
					.setStyle(ButtonStyle.Success)
			)
			.addComponents(
				new ButtonBuilder()
					.setCustomId("update")
					.setLabel("update")
					.setEmoji("⚙️")
					.setStyle(ButtonStyle.Secondary)
			);
		await interaction.editReply({
			embeds: [Embed],
			components: [btns],
		});
	}
}
async function definitely(interaction, domain) {
	const Embed = new EmbedBuilder()
		.setColor(0xff0000)
		.setTitle("?Are you sure?")
		.setDescription(`Are you sure you want to delete ${domain}`)
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
				.setCustomId("removesure")
				.setEmoji("✅")
				.setLabel("yes")
				.setStyle(ButtonStyle.Success)
		)
		.addComponents(
			new ButtonBuilder()
				.setCustomId("cancelremove")
				.setEmoji("⛔")
				.setLabel("cancel")
				.setStyle(ButtonStyle.Danger)
		);
	await interaction.editReply({
		embeds: [Embed],
		components: [btns],
	});
}
module.exports = { remove, definitely };

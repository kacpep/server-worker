const {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
} = require("discord.js");
const path = require("node:path");
const fs = require("node:fs");
const nconf = require("nconf");

async function manage(interaction, domain) {
	if (
		/([a-z0-9A-Z]\.)*[a-z0-9-]+\.([a-z0-9]{2,24})+(\.co\.([a-z0-9]{2,24})|\.([a-z0-9]{2,24}))*/g.test(
			domain
		)
	) {
		const domainEmbed = new EmbedBuilder()
			.setColor(0x0099ff)
			.setTitle("Manage this domain")

			.setDescription("What to do with this domain?")
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
		const btns = new ActionRowBuilder().addComponents(
			new ButtonBuilder()
				.setCustomId("add")
				.setEmoji("🔨")
				.setLabel("add")
				.setStyle(ButtonStyle.Success)
		);

		const filePath = path.join("/var/www", domain);
		const availablPath = path.join("/etc/nginx/sites-available", domain);
		const enabledPath = path.join("/etc/nginx/sites-enabled", domain);

		if (
			fs.existsSync(filePath) &&
			fs.existsSync(availablPath) &&
			fs.existsSync(enabledPath)
		) {
			btns.addComponents(
				new ButtonBuilder()
					.setCustomId("remove")
					.setLabel("remove")
					.setEmoji("💥")
					.setStyle(ButtonStyle.Danger)
			);
			btns.addComponents(
				new ButtonBuilder()
					.setCustomId("update")
					.setLabel("update")
					.setEmoji("⚙️")
					.setStyle(ButtonStyle.Secondary)
			);
		}

		await interaction.reply({
			embeds: [domainEmbed],
			components: [btns],
			ephemeral: true,
		});
	} else {
		await interaction.reply({
			content: `Invalid domain name!`,
			ephemeral: true,
		});
	}
}

module.exports = { manage };

const {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
} = require("discord.js");

async function go(interaction) {
	let domainName = interaction.options.getString("name");
	const domainEmbed = new EmbedBuilder()
		.setColor(0x0099ff)
		.setTitle("Manage this domain")

		.setDescription("What do you want to do with this domain?")
		.setThumbnail("https://i.imgur.com/w8hzuoa.png")

		.addFields({
			name: "Domain name:",
			value: `${domainName}`,
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

	await interaction.reply({
		embeds: [domainEmbed],
		components: [btns],
	});
	
}

module.exports = { go };

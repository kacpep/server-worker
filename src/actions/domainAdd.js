const {
	ActionRowBuilder,
	StringSelectMenuBuilder,
	EmbedBuilder,
} = require("discord.js");

async function add(interaction, domain) {
	console.log(domain);
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
			.setCustomId("select")
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

module.exports = { add };

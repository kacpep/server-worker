const { EmbedBuilder } = require("discord.js");
const { execSync } = require("child_process");

async function off(interaction) {
	execSync("sudo systemctl stop nginx");
	const embed = new EmbedBuilder()
		.setColor(0x00ff00)
		.setTitle("Server is off")

		.setDescription("Nginx is off.")
		.setThumbnail("https://i.imgur.com/w8hzuoa.png")

		.setTimestamp()
		.setFooter({
			text: "made by ~ kacpep.dev",
			iconURL: "https://i.imgur.com/M0uWxCA.png",
		});

	await interaction.reply({
		embeds: [embed],
	});
}
async function on(interaction) {
	execSync("sudo systemctl start nginx");

	const embed = new EmbedBuilder()
		.setColor(0x00ff00)
		.setTitle("Server is on")

		.setDescription("Nginx is on.")
		.setThumbnail("https://i.imgur.com/w8hzuoa.png")

		.setTimestamp()
		.setFooter({
			text: "made by ~ kacpep.dev",
			iconURL: "https://i.imgur.com/M0uWxCA.png",
		});

	await interaction.reply({
		embeds: [embed],
	});
}

module.exports = { off, on };

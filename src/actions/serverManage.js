const { EmbedBuilder } = require("discord.js");
const { execSync } = require("child_process");
const nconf = require("nconf");

function arrayRemove(arr, value) {
	return arr.filter(function (ele) {
		return ele != value;
	});
}

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
		ephemeral: true,
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
		ephemeral: true,
	});
}
async function restart(interaction) {
	execSync("sudo systemctl restart nginx");

	const embed = new EmbedBuilder()
		.setColor(0x00ff00)
		.setTitle("Server restarted")

		.setDescription("Nginx restarted")
		.setThumbnail("https://i.imgur.com/w8hzuoa.png")

		.setTimestamp()
		.setFooter({
			text: "made by ~ kacpep.dev",
			iconURL: "https://i.imgur.com/M0uWxCA.png",
		});

	await interaction.reply({
		embeds: [embed],
		ephemeral: true,
	});
}
async function userAdd(interaction) {
	let users = Object.assign([], nconf.get("users"));

	if (!users.includes(interaction.options.getUser("user").tag)) {
		users.push(interaction.options.getUser("user").tag);
		nconf.set("users", users);
		nconf.save();

		const embed = new EmbedBuilder()
			.setColor(0x00ff00)
			.setTitle("User added")

			.setTimestamp()
			.setFooter({
				text: "made by ~ kacpep.dev",
				iconURL: "https://i.imgur.com/M0uWxCA.png",
			});

		await interaction.reply({
			embeds: [embed],
			ephemeral: true,
		});
	} else {
		const embed = new EmbedBuilder()
			.setColor(0xff0000)
			.setTitle("User already exists")

			.setTimestamp()
			.setFooter({
				text: "made by ~ kacpep.dev",
				iconURL: "https://i.imgur.com/M0uWxCA.png",
			});

		await interaction.reply({
			embeds: [embed],
			ephemeral: true,
		});
	}
}
async function userRemove(interaction) {
	let users = Object.assign([], nconf.get("users"));

	if (!users.includes(interaction.options.getUser("user").tag)) {
		const embed = new EmbedBuilder()
			.setColor(0xff0000)
			.setTitle("There is no such a user")
			.setTimestamp()
			.setFooter({
				text: "made by ~ kacpep.dev",
				iconURL: "https://i.imgur.com/M0uWxCA.png",
			});

		await interaction.reply({
			embeds: [embed],
			ephemeral: true,
		});
	} else {
		nconf.set(
			"users",
			arrayRemove(users, interaction.options.getUser("user").tag)
		);

		nconf.save();

		const embed = new EmbedBuilder()
			.setColor(0x00ff00)
			.setTitle("User has been removed")

			.setTimestamp()
			.setFooter({
				text: "made by ~ kacpep.dev",
				iconURL: "https://i.imgur.com/M0uWxCA.png",
			});

		await interaction.reply({
			embeds: [embed],
			ephemeral: true,
		});
	}
}
async function usersList(interaction) {
	let allUsers = Object.assign([], nconf.get("users"));
	let fields = [
		{
			name: "Root:",
			value: nconf.get("root"),
			inline: false,
		},
		{
			name: "--------------------------",
			value: "Users:",
			inline: false,
		},
	];
	if (allUsers.length == 0) {
		fields.push({
			name: "--------------------------",
			value: `There are no users.`,
			inline: false,
		});
	}

	for (let user in allUsers) {
		fields.push({
			name: "--------------------------",
			value: `${parseInt(user) + 1}.  ${allUsers[user]}`,
			inline: false,
		});
	}
	fields.push({
		name: "--------------------------",
		value: "\u200B",
		inline: false,
	});
	let enabled = {
		color: 0x0099ff,
		title: "List of users",
		description: "This is a list of all users",
		thumbnail: {
			url: "https://i.imgur.com/w8hzuoa.png",
		},
		fields: fields,
		footer: {
			text: "made by ~ kacpep.dev",
			icon_url: "https://i.imgur.com/M0uWxCA.png",
		},
	};
	await interaction.reply({
		content: "",
		embeds: [enabled],
		components: [],
		ephemeral: true,
	});
}


module.exports = { off, on,restart, userAdd, userRemove, usersList };

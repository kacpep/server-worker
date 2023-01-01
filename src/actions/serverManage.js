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
async function userAdd(interaction) {
	nconf.file("default", "C:\\Users\\kacpeppp\\Desktop\\server-worker\\src\\configs\\config.json");

	let users = Object.assign([], nconf.get("users"));
	console.log(users);
	console.log(users.indexOf(interaction.user.tag));

	if (users.indexOf(interaction.user.tag) == -1) {
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
		});
	} else {
		const embed = new EmbedBuilder()
			.setColor(0xff0000)
			.setTitle("User already added")

			.setTimestamp()
			.setFooter({
				text: "made by ~ kacpep.dev",
				iconURL: "https://i.imgur.com/M0uWxCA.png",
			});

		await interaction.reply({
			embeds: [embed],
		});
	}
}
async function userRemove(interaction) {
	let users = Object.assign([], nconf.get("users"));
	console.log(!users.includes(interaction.user.tag));

	nconf.set(
		"users",
		arrayRemove(users, interaction.options.getUser("user").tag)
	);

	nconf.save();

	const embed = new EmbedBuilder()
		.setColor(0x00ff00)
		.setTitle("User removed")

		.setTimestamp()
		.setFooter({
			text: "made by ~ kacpep.dev",
			iconURL: "https://i.imgur.com/M0uWxCA.png",
		});

	await interaction.reply({
		embeds: [embed],
	});
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
		title: "Enabled domains",
		description: "What is this? All enabled domains",
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
	});
}

module.exports = { off, on, userAdd, userRemove, usersList };

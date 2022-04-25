const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('servers')
		.setDescription('Gets servers of bot.'),
	async execute(interaction, client) {
		const servers = interaction.client.guilds.cache
		const embed = new Discord.MessageEmbed()
			.setTitle('Servers')
			.setDescription(servers.map(server => `${server.name} (${server.id})`).join('\n'));
		interaction.reply({
			embeds: [embed]
		});
	}
};
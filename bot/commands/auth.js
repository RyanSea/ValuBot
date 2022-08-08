const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder } = require('discord.js')


/// CONNECT DISCORD ID TO ETH WALLET ///
module.exports = {
    /// Command Params
	data: new SlashCommandBuilder()
		.setName('auth')
		.setDescription('Authenticate Wallet')
        .setDMPermission(false),

    /// Command Execution
	async execute(interaction) {
        let embed = new EmbedBuilder()
            .setTitle('Choose wallet type')
            .setColor('#DBAAFE') // purple #DBAAFE, beige #FFB297

        let buttons = new ActionRowBuilder()
            .setComponents(
                new ButtonBuilder()
                    .setCustomId('metamask')
                    .setLabel('Browser Wallet')
                    .setEmoji('<:metamask:999040183024492594>')
                    .setStyle(1),
                new ButtonBuilder()
                    .setCustomId('walletconnect')
                    .setLabel('Wallet Connect')
                    .setEmoji('<:walletconnect:999039982276706404>')
                    .setStyle(1)
            )

        await interaction.reply({embeds: [embed], components: [buttons]}) 
	}
}
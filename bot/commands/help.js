const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')
const { valu } = require('../utils.js')
const rinkebyURL = "https://rinkeby.etherscan.io/token/"
const valuLogo = "https://i.imgur.com/RaMKZNU.png"

/// TABLE OF CONTENTS ///
module.exports = {
    /// Command Params
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Command Descriptions')
        .setDMPermission(false),

    /// Command Execution
	async execute(interaction) {
        let embed = new EmbedBuilder()
            .setTitle(`Commands`)
            .setDescription(
                '`/create` — Can be used once by server owner / admin to create *Engagement Tokens* for you server. This makses the server an *Engagement Sphere*!\n\n' +
                '`/auth` —  Allows users to link their ethereum wallet to so that they can start earning Engagement Tokens\n\n' +
                '`/sphere` — Gives the addresses for the staked and unstaked tokens for this Engagement Sphere'
            )
            .setThumbnail(valuLogo)
            .setColor('#DBAAFE')

        await interaction.reply({ embeds: [embed] })
	}
}
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')
const { valu } = require('../utils.js')
const rinkebyURL = "https://rinkeby.etherscan.io/token/"
const valuLogo = "https://i.imgur.com/RaMKZNU.png"

/// GET SPHERE ADDRESS ///
module.exports = {
    /// Command Params
	data: new SlashCommandBuilder()
		.setName('sphere')
		.setDescription('Sphere Info')
        .setDMPermission(false),

    /// Command Execution
	async execute(interaction) {
        let server = await interaction.guild.id
        let servername = await interaction.guild.name
        let profile = await valu.spheres(server)

        let embed = new EmbedBuilder()
            .setTitle(`${servername} Sphere Info:`)
            .setDescription(`**Token:** ${profile.symbol} \n${rinkebyURL + profile.token} \n**Staked Token:** 🤍${profile.symbol} \n${rinkebyURL + profile.sphere}`)
            .setThumbnail(valuLogo)
            .setColor('#DBAAFE')

        await interaction.reply({ embeds: [embed] })
	}
}
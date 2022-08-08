const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')
const { valu } = require('../utils.js')
const rinkebyURL = "https://rinkeby.etherscan.io/token/"
const valuLogo = "https://i.imgur.com/RaMKZNU.png"

/// CREATE ENGAGEMENET SPHERE ///
module.exports = {
    /// Command Params
	data: new SlashCommandBuilder()
		.setName('create')
		.setDescription('Create Engagement Sphere')
        .addStringOption(option => 
            option.setName('name')
                .setDescription('Engagement Token Name')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('symbol')
                .setDescription('Engagement Token Symbol')
                .setRequired(true))
        .setDefaultMemberPermissions(8)
        .setDMPermission(false),

    /// Command Execution
	async execute(interaction) {
        let name = await interaction.options.getString('name')
        let symbol = await interaction.options.getString('symbol')
        let server = await interaction.guild.id
        let servername = await interaction.guild.name

        let embed = new EmbedBuilder()
            .setTitle('Creating Sphere...')
            .setColor('#DBAAFE')

        await interaction.reply({ embeds: [embed] })

		// Create Sphere
        let tx = await valu.create(server, name, symbol)
        
        await tx.wait()

        // Grab the Profile struct of Sphere
        let profile = await valu.spheres(server)

        embed 
            .setTitle(`Sphere Created for ${servername}!`)
            .setDescription(`**Token:** ${symbol} \n${rinkebyURL + profile.token} \n**Staked Token:** 🤍${symbol} \n${rinkebyURL + profile.sphere}`)
            .setThumbnail(valuLogo)

        await interaction.editReply({ embeds: [embed] })
	}
}
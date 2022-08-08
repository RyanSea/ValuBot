const { SlashCommandBuilder } = require('@discordjs/builders')
const { EmbedBuilder } = require('discord.js')
const { valu } = require('../utils.js')
const ethers = require('ethers');

/// CONNECT ETH WALLET ///
module.exports = {
    /// Command Params
	data: new SlashCommandBuilder()
		.setName('connectwallet')
		.setDescription('Authenticate Wallet')
        .addStringOption(option => 
            option.setName('address')
                .setDescription('ETH Address')
                .setRequired(true))
        .setDMPermission(false),

    /// Command Execution
	async execute(interaction) {
		// Authenticate Wallet
        let address = await interaction.options.getString('address')
        let user = await interaction.user.id
        let server = await interaction.guild.id
        let embed = new EmbedBuilder().setColor('#DBAAFE')
        
        if (ethers.utils.isAddress(address)) {
            let tx = await valu.authenticate(server, user, address)
            console.log(tx.hash)

            embed.setTitle('Connecting Wallet...')
            await interaction.reply({ embeds: [embed] })

            console.log(tx)
            await tx.wait()
            console.log(await tx)

            embed.setTitle('Wallet Connected!')
            await interaction.editReply({ embeds: [embed] })

        } else {
            embed.setTitle('Please enter a valid Ethereum address')
            await interaction.reply({ embeds: [embed] })
        }
	}
}
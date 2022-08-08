const { Collection, InteractionType, EmbedBuilder, AttachmentBuilder } =  require('discord.js');
const { bot, valu } = require('./utils')
const ethers = require('ethers')

const { ValuBot, polygon, rinkeby } = require('../config/config.json')

const authLink = "https://discord.com/api/oauth2/authorize?client_id=975536229854638141&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&response_type=token&scope=identify"

/*///////////////////////////////////////////////////////////////
                        DISCORD COMMANDS
//////////////////////////////////////////////////////////////*/

const fs = require('node:fs');
const path = require('node:path');
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

bot.commands = new Collection();

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	bot.commands.set(command.data.name, command);
}

/*///////////////////////////////////////////////////////////////
                        WALLET CONNECT
//////////////////////////////////////////////////////////////*/


const WalletConnectProvider = require("@walletconnect/web3-provider");
const qr = require('qr-image');

const wcProvider = new WalletConnectProvider.default({
    rpc: {
        80001: polygon // http:// polygon_mumbai Alchemy url
    },
    qrcode: false
})

var qr_png
wcProvider.connector.on("display_uri", async (err, payload) => {
    console.log(payload)
    let code = payload.params[0]
    qr_png = qr.image(code, { type: 'png' });
});

wcProvider.connector.on('session_request', async (err, payload) => {
    console.log("Session Request:", payload)
})

wcProvider.connector.on('disconnect', async (err, payload) => {
	console.log('DISCONNECTED!')
})



// wcProvider.connector.on('connect', async (err, payload) => {
// 	address = await payload.params[0].accounts[0]
// 	//await valu.authenticate(msg.guildId, id, address)
// 	console.log(address)
// 	embed.setTitle('Connected!')
// 	await interaction.message.edit({ embeds: [embed] })
// 	await wcProvider.disconnect()
// 	return
// })

/*///////////////////////////////////////////////////////////////
                        	BOT
//////////////////////////////////////////////////////////////*/

bot.on('ready', async () => {
	console.log('ValuBot Arrived⚡️');
});

bot.on('messageReactionAdd', async (reaction, user) => {

    let engager = user.id

    let engagee = reaction.message.author.id;
    let msg = reaction.message;

    let engager_auth = await valu.getAddress(msg.guildId,engager)
    let engagee_auth = await valu.getAddress(msg.guildId,engagee)
  
    if(engager_auth !== ethers.constants.AddressZero && ethers.constants.AddressZero !== engagee_auth) {
        await valu.engage(msg.guildId,engager, engagee)
    }
    
})

bot.on('messageCreate', async msg => {
	// if (msg.author.bot) return
	// await msg.channel.send('`hi`')
})

bot.on('interactionCreate', async interaction => {
	try {
		// If Command
		if (interaction.type === InteractionType.ApplicationCommand) {
			// Get bot command from interaction.commandName
			const command = bot.commands.get(interaction.commandName);
			if (!command) return;

			await command.execute(interaction);
			
			// If Button
		} else if (interaction.isButton()) {

			if (interaction.customId === 'metamask') {
				// Send auth page link...
				
				let embed = EmbedBuilder.from(interaction.message.embeds[0])
				embed.setTitle('Follow Link!')
				await interaction.update({ embeds: [embed], components: [] })
				await interaction.followUp({ content: authLink + "&state=" + interaction.guildId, ephemeral: true })

			} else if (interaction.customId === 'walletconnect') {

				//let id = interaction.member.id
			
				await wcProvider.connector.createSession() 
				let qrCode = new AttachmentBuilder( qr_png )

				let embed = EmbedBuilder.from(interaction.message.embeds[0])
				embed.setTitle('Scan Code!')

				await interaction.update({ embeds: [embed], components: [] })
				await interaction.followUp({content:"\u200b",files: [qrCode], components: [], ephemeral: true})
				
				wcProvider.connector.on('connect', async (err, payload) => {
					address = await payload.params[0].accounts[0]

					//await valu.authenticate(msg.guildId, id, address)

					// Log the address
					console.log(address)
					embed.setTitle('Connected!')
					await interaction.message.edit({ embeds: [embed] })
					await wcProvider.disconnect()
					await wcProvider.connector.killSession()
					await wcProvider.close()
					return
				})

			}

		}



	} catch (error) {
        // DM me error
		await bot.users.cache.get('814847668706082837').send(String(error))

		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});


bot.login(ValuBot)
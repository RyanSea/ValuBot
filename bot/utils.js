const { Client, GatewayIntentBits } =  require('discord.js');
const bot = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildIntegrations] });


/*///////////////////////////////////////////////////////////////
                        	ETHERS
//////////////////////////////////////////////////////////////*/

const ethers = require('ethers')
const { abi } = require('../config/ValuDAO.json')
const { privateKey, polygon, rinkeby } = require('../config/config.json')
const valu_address = "0xABF71fbfB4cFbc0649fFbb55505797BcAFDDFD1c" // "0x079a43C132D3A8Ef7D0d62221247667251586b26"

const provider = new ethers.providers.WebSocketProvider(rinkeby);
const signer = new ethers.Wallet(privateKey, provider);
const valu = new ethers.Contract(valu_address, abi, signer)

exports.valu = valu
exports.bot = bot
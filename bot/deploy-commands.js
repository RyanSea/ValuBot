const fs = require('node:fs')
const path = require('node:path')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const { ValuBot, guildId, ValuBot_ID } = require('../config/config.json')

const commands = []
const commandsPath = path.join(__dirname, 'commands')
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file)
	const command = require(filePath)
	commands.push(command.data.toJSON())
}

const rest = new REST({ version: '9' }).setToken(ValuBot)

rest.put(Routes.applicationCommands(ValuBot_ID), { body: commands })
	.then(() => console.log('Successfully registered ValuBot\'s commands!'))
	.catch(console.error)

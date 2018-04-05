// Package Dependencies
const Backend = require('statsbot-backend')

// Local Dependencies
const { getData, setData } = require('../accessDB.js')

// JSDoc Typing
const Discord = require('discord.js')
const Command = Backend.Command // eslint-disable-line
const BackendClient = Backend.Client // eslint-disable-line
const DiscordMessage = Discord.Message // eslint-disable-line

/**
 * @typedef {Object} CommandProperties
 * @property {BackendClient} client
 * @property {DiscordMessage} message
 * @property {Command} command
 * @property {string[]} arguments
 */

/**
 * @param {CommandProperties} data Command Properties
 */
const main = async data => {
  // Get Guild
  const guild = data.message.guild

  // Define Custom Message
  const customMessage = new Backend.MessageBuilder()
    .setName('Roles')

  if (data.arguments.length === 0) {
    // Get List of Roles
    const settings = await getData(guild.id)
    const roleMap = settings.roles.map(x => data.message.guild.roles.get(x))

    let str = settings.roles.length === 0 ? 'No roles set.' : `Roles enabled: ${roleMap.map(x => `'${x.name}'`).join(', ')}`
    let message = customMessage.setMessage(str)
      .formattedMessage
    data.message.channel.send(message)
  } else if (data.arguments[0].toLowerCase() === 'reset') {
    // Reset roles
    let settings = await getData(guild.id)
    settings.roles = []
    await setData(guild.id, settings)
    let roleMap = settings.roles.map(x => data.message.guild.roles.get(x))

    let str = settings.roles.length === 0 ? 'No roles set.' :
      `Roles enabled: ${roleMap.map(x => `'${x.name}'`).join(', ')}`
    let message = customMessage.setMessage(str)
      .formattedMessage
    data.message.channel.send(message)
  } else {
    // Set List of Roles
    let roles = data.arguments.map(x => data.message.guild.roles.find('name', x))
      .filter(x => x !== undefined)

    if (roles.length === 0) {
      // Send error if no valid roles are found
      let message = customMessage.setError()
        .setMessage('No valid roles found.')
        .formattedMessage
      data.message.channel.send(message)
    } else {
      // Remove Duplicates
      let rolesFilter = Array.from(new Set(roles.map(x => x.id)))
      let roleMap = rolesFilter.map(x => data.message.guild.roles.get(x))

      let settings = await getData(guild.id)
      settings.roles = rolesFilter
      await setData(guild.id, settings)

      let str = settings.roles.length === 0 ? 'No roles set.' : `Roles enabled: ${roleMap.map(x => `'${x.name}'`).join(', ')}`
      let message = customMessage.setMessage(str)
        .formattedMessage
      data.message.channel.send(message)
    }
  }
}

const Roles = new Backend.Command()
  .setName('roles')
  .setDescription('Gets / sets roles to use.')
  .setMain(main)
  .setAdmin()
  .addArgument('?roles')

module.exports = Roles

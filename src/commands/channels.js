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
    .setName('Channels')

  if (data.arguments.length === 0) {
    // Get List of Channels
    const settings = await getData(guild.id)
    const IDs = settings.channels

    let str = settings.channels.length === 0 ? 'Notifications are disabled.' : `Notifications are enabled in: ${IDs.map(x => `<#${x}>`).join(' ')}`
    let message = customMessage.setMessage(str)
      .formattedMessage
    data.message.channel.send(message)
  } else if (data.arguments[0].toLowerCase() === 'reset') {
    // Reset channels
    let settings = await getData(guild.id)
    settings.channels = []
    await setData(guild.id, settings)

    let str = settings.channels.length === 0 ? 'Notifications are disabled.' :
      `Notifications are enabled in: ${settings.channels.map(x => `<#${x}>`).join(' ')}`
    let message = customMessage.setMessage(str)
      .formattedMessage
    data.message.channel.send(message)
  } else {
    // Set List of Channels
    let channels = data.arguments.map(x => x.replace(/<#([0-9]+)>/, '$1'))
      .map(x => data.client.channels.get(x))
      .filter(x => x !== undefined)

    if (channels.length === 0) {
      // Send error if no valid channels are found
      let message = customMessage.setError()
        .setMessage('No valid channels found.')
        .formattedMessage
      data.message.channel.send(message)
    } else {
      // Remove Duplicates
      let IDs = Array.from(new Set(channels.map(x => x.id)))

      let settings = await getData(guild.id)
      settings.channels = IDs
      await setData(guild.id, settings)

      let str = settings.channels.length === 0 ? 'Notifications are disabled.' : `Notifications are enabled in: ${IDs.map(x => `<#${x}>`).join(' ')}`
      let message = customMessage.setMessage(str)
        .formattedMessage
      data.message.channel.send(message)
    }
  }
}

const Channels = new Backend.Command()
  .setName('channels')
  .setDescription('Gets / sets announcement channels.')
  .setMain(main)
  .setAdmin()
  .addArgument('?channels')

module.exports = Channels

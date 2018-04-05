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
    .setName('Set Ping')

  if (data.arguments.length === 0) {
    // Get Status
    let settings = await getData(guild.id)
    let message = customMessage.setMessage(`Everyone pings are ${settings.mentionEveryone ? 'enabled' : 'disabled'}.`)
      .formattedMessage
    data.message.channel.send(message)
  } else {
    let state = parseArg(data.arguments[0])
    let settings = await getData(guild.id)
    settings.mentionEveryone = state
    await setData(guild.id, settings)

    let message = customMessage.setMessage(`Everyone pings are ${settings.mentionEveryone ? 'enabled' : 'disabled'}.`)
      .formattedMessage
    data.message.channel.send(message)
  }
}

const YES = [
  'true',
  't',
  'yes',
  'y',
  'enable',
  'enabled',
  'on',
]

/**
 * @param {string} arg Argument
 * @returns {boolean}
 */
const parseArg = arg => YES.includes(arg.toLowerCase())

/**
 * @param {string} arg Argument
 * @returns {boolean}
 */

const SetPing = new Backend.Command()
  .setName('setping')
  .setDescription('Toggles mention everyone for announcements.')
  .setMain(main)
  .setAdmin()

module.exports = SetPing

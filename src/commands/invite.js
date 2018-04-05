// Discord Permissions
const PERMISSIONS = [
  'MANAGE_ROLES',
  'CHANGE_NICKNAME',
  'VIEW_CHANNEL',
  'READ_MESSAGE_HISTORY',
  'SEND_MESSAGES',
  'MENTION_EVERYONE',
  'USE_EXTERNAL_EMOJIS',
]

const Backend = require('statsbot-backend')

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
  try {
    let url = await data.client.generateInvite(PERMISSIONS)
    try {
      await data.message.author.send(`<${url}>`)

      const sentMessage = new Backend.MessageBuilder()
        .setName('Invite')
        .setMessage('Invite URL Sent!')
        .formattedMessage

      if (data.message.guild !== null) await data.message.channel.send(sentMessage)
    } catch (err) {
      if (err.code === 50007) data.message.channel.send(`<${url}>`)
    }
  } catch (err) {
    // No Op
  }
}

const Invite = new Backend.Command()
  .setName('invite')
  .setDescription('DMs you a link to invite the bot to your server.')
  .setMain(main)

module.exports = Invite

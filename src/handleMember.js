// JSDoc Typing
const Backend = require('statsbot-backend')
const Discord = require('discord.js')
const BackendClient = Backend.Client // eslint-disable-line
const DiscordMember = Discord.GuildMember // eslint-disable-line

/**
 * @typedef {Object} GuildSettings
 * @property {string[]} roles
 * @property {string[]} channels
 * @property {string[]} liveIDs
 * @property {boolean} mentionEveryone
 */

// Local Dependencies
const { getData, setData } = require('./accessDB.js')

/**
 * Handle Member Update
 * @param {DiscordMember} member Member Object
 * @param {boolean} [announce] Announce to Channel?
 */
const handleMember = async (member, announce = true) => {
  const settings = await getData(member.guild.id)
  try {
    let activity = member.presence.activity
    let roles = settings.roles.map(x => member.guild.roles.get(x))
    if (activity !== null && activity.type === 'STREAMING') {
      // Add Roles
      for (let role of roles) { member.addRole(role) }
      // Announce
      if (announce) announceMessages(member, announce, settings)

      // Push to DB
      settings.liveIDs = Array.from(new Set([...settings.liveIDs, member.user.id]))
      await setData(member.guild.id, settings)
    } else {
      // Remove Roles
      for (let role of roles) { member.removeRole(role) }

      // Push to DB
      settings.liveIDs = settings.liveIDs.filter(x => x !== member.user.id)
      await setData(member.guild.id, settings)
    }
  } catch (err) {
    // Silently Fail
    console.error(err)
  }
}

/**
 * Handle Member Update
 * @param {DiscordMember} member Member Object
 * @param {boolean} announce Announce to Channel?
 * @param {GuildSettings} settings Settings Object
 */
const announceMessages = (member, announce, settings) => {
  if (settings.liveIDs.includes(member.user.id)) {
    // Do Nothing
  } else {
    // Announce to channels
    const channels = settings.channels.map(x => member.guild.channels.get(x))
    for (let channel of channels) {
      let str = ''
      if (settings.mentionEveryone) str += '@everyone\n'

      let client = member.user
      str += `**${client.username}#${client.discriminator}** just went live! ${member.presence.activity.url}`
      channel.send(str)
    }
  }
}

module.exports = handleMember

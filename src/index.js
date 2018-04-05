// Package Dependencies
const Backend = require('statsbot-backend')
const exitHook = require('async-exit-hook')

// Local Dependencies
const Registry = require('./registry.js')
const populateDB = require('./populateDB.js')
const handleMember = require('./handleMember.js')

// Environment Variables
const { TOKEN, PREFIX, OWNER, PREFIX_SPACE } = process.env

const bot = new Backend.Client()
  // Meta Data
  .setName('Stream Role Bot')
  .setAuthor('lolPants#2319')
  .setDescription('Automatically assigns / removes a role when someone starts / stops streaming.')
  // Command Registries
  .addRegistry(Backend.StandardRegistry)
  .addRegistry(Registry)
  // Bot Runtime
  .setPrefix(PREFIX)
  .setIgnorePrefixSpacing(PREFIX_SPACE === undefined)
  .addOwner(OWNER)

// Login to Discord
bot.login(TOKEN)

// Populate DB on events
bot.on('ready', () => { populateDB(bot.guilds.array().map(x => x.id)) })
bot.on('guildCreate', () => { populateDB(bot.guilds.array().map(x => x.id)) })
bot.on('guildDelete', () => { populateDB(bot.guilds.array().map(x => x.id)) })

// Handle Presence Updates
bot.on('ready', () => {
  for (let guild of bot.guilds.array()) {
    for (let member of guild.members.array()) {
      handleMember(member)
    }
  }
})
bot.on('guildCreate', guild => {
  for (let member of guild.members.array()) {
    handleMember(member)
  }
})
bot.on('presenceUpdate', (old, member) => { handleMember(member, true) })

/**
 * Logout Function
 * Handles CTRL+C and PM2
 */
exitHook(async exit => {
  // Check if logged in
  if (bot.readyAt !== null) {
    try {
      await bot.destroy()
      exit()
    } catch (err) { exit() }
  } else { exit() }
})

// Backend
const Backend = require('statsbot-backend')

// Commands
const Invite = require('./commands/invite.js')
const Channels = require('./commands/channels.js')
const Roles = require('./commands/roles.js')
const SetPing = require('./commands/setping.js')

const Registry = new Backend.Registry()
  .addCommand(Invite)
  .addCommand(Channels)
  .addCommand(Roles)
  .addCommand(SetPing)

module.exports = Registry

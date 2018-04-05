// Redis
const redis = require('./db.js')

/**
 * @param {string[]} guilds Array of Guild IDs
 */
const populateDB = guilds => {
  let tasks = guilds.map(id => fillGuild(id))
  Promise.all(tasks)
}

/**
 * @param {string} guild Guild ID
 * @returns {Promise.<void>}
 */
const fillGuild = async guild => {
  let test = await redis.get(guild)
  if (test === null) {
    const template = {
      roles: [],
      channels: [],
      liveIDs: [],
      mentionEveryone: false,
    }
    return redis.set(guild, JSON.stringify(template))
  } else {
    return null
  }
}

module.exports = populateDB

// Redis
const redis = require('./db.js')

/**
 * @typedef {Object} GuildSettings
 * @property {string[]} roles
 * @property {string[]} channels
 * @property {string[]} liveIDs
 * @property {boolean} mentionEveryone
 */

/**
 * Get Guild Settings
 * @param {string} guild Guild ID
 * @returns {Promise.<GuildSettings>}
 */
const getData = async guild => {
  /**
   * @type {GuildSettings}
   */
  let data = await redis.get(guild)
  return JSON.parse(data)
}

/**
 * Set Guild Settings
 * @param {string} guild Guild ID
 * @param {GuildSettings} settings Settings Object
 */
const setData = async (guild, settings) => {
  await redis.set(guild, JSON.stringify(settings))
}

module.exports = { getData, setData }

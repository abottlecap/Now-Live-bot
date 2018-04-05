// Package Dependencies
const Redis = require('ioredis')
const redis = new Redis(process.env.REDIS_HOST || 'redis')

module.exports = redis

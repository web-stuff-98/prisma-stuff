import {createClient} from "redis" 
import type { RedisClientType } from "redis"
let redisClient: RedisClientType | null = null
redisClient = redisClient || createClient(process.env.NODE_ENV === "development" ? {
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT)
    },
} : {
    url: process.env.REDIS_PRODUCTION_URL,
    password: process.env.REDIS_PRODUCTION_PASS,
})
redisClient.on('error', (err) => {
    console.error(`${err}`)
})
export default redisClient

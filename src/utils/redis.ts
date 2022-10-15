import {createClient} from "redis" 
import type { RedisClientType } from "redis"
let redisClient: RedisClientType | null = null
redisClient = redisClient || createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT)
    },
})
redisClient.on('error', (err) => {
    console.error(`${err}`)
})
export default redisClient

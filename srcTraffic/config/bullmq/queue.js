import {Queue as bullQueue} from "bullmq"
import "dotenv/config"

export const toProcessQueue = new bullQueue("toProcess", {
    connection: { // Conectando bullmq com o servidor Redis
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD
    }
})

import {Queue as bullQueue} from "bullmq"
import findConfig from "find-config"
import dotenv from "dotenv"
dotenv.config({path: findConfig('.env')})
console.log(process.env.REDIS_HOST)
export const toProcessQueue = new bullQueue("toProcess", {
    connection: { // Conectando bullmq com o servidor Redis
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD
    }
})

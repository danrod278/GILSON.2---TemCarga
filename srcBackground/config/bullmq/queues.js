import {Queue as bullQueue} from "bullmq"
import findConfig from "find-config"
import dotenv from "dotenv"
dotenv.config({path: findConfig('.env')})

export const toProcessQueue = new bullQueue("toRespond", {
    connection: { // Conectando bullmq com o servidor Redis
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD
    }
})

export const contactsHold = new bullQueue("contactsHold", {
    connection: { // Conectando bullmq com o servidor Redis
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD
    }
})

export const conversationsHold = new bullQueue("conversationsHold", {
    connection: { // Conectando bullmq com o servidor Redis
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD
    }
})

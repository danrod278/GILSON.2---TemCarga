import { Worker as bullWorker } from "bullmq";
import { performJob } from "./sendConversationsLogic.js";
import dotenv from "dotenv"
import findConfig from "find-config"
dotenv.config({ path: findConfig('.env') })

export const startProcessing = async () => {
    try {
        const worker = new bullWorker('conversationsHold', async job => {
            await performJob(job)
            await job.remove()

        }, {
            connection: {
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT,
                password: process.env.REDIS_PASSWORD
            },
            concurrency: 10,
            limiter: {
                max: 300,
                duration: 1000 * 60
            }
        })
    } catch (error) {
        console.error("Error when packing a message", error)
    }
}

startProcessing()

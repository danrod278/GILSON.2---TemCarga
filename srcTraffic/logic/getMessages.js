import { Worker as bullWorker } from "bullmq"
import "dotenv/config"

export const getMessages = (client) => {
    try{
        const worker = new bullWorker("toRespond", async job => {
            await client.sendMessage(job.data.to, job.data.subject)
            console.log("Mensagem enviada para:", job.data.to)
        }, {
            connection: {
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT,
                password: process.env.REDIS_PASSWORD
            },
            concurrency:10,
            limiter:{
                max:300,
                duration:1000*60
            }
        })
    }catch(error){
        console.error("Error to get job on redis.",error)
    }
}

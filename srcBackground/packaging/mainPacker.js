import { Worker as bullWorker } from "bullmq";
import dotenv from "dotenv"
import findConfig from "find-config"
import { packerLogic } from "./packerLogic.js";
dotenv.config({path: findConfig('.env')})


export const packer = async ()=>{
    try {
        const worker = new bullWorker('toProcess', async job => {
            packerLogic(job)
        },{
            connection: {
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT,
                password: process.env.REDIS_PASSWORD
            },
            concurrency:10
        })
    } catch (error) {
        console.error("Error when packing a message",error)
    }
}

packer()

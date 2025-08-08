import { toProcessQueue } from "../config/bullmq/queue.js"

export const addMessageOnQueue = async (data) => {
    try {
        await toProcessQueue.add('message', data) // Adiciona item a lista toProcess
        console.log("Adding message")
    } catch (error) {
        console.error("Error adding item to queue: toProcess.",error)
    }
}

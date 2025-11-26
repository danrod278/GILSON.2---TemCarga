import readlineSync from "readline-sync"
import { toProcessQueue } from "../config/bullmq/queue.js";



const create = async () => {
    const mensagem = readlineSync.question('mensagem: ');
    var nMensagem = {
        'br_99977186159': { texto: mensagem, data: Date.now() }
    }
    try {
        await toProcessQueue.add("message", nMensagem)
    } catch (error) {
        console.error("Error adding item to queue: toProcess.", error)
    }
}

while (1) {

    await create()
}

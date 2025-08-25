import readlineSync from "readline-sync"
import { toProcessQueue } from "../config/bullmq/queue.js";

const mensagem = readlineSync.question('mensagem: ');
var nMensagem = {
    '2323223232': { texto: mensagem, data: Date.now() }
}

const create = async ()=>{
    try {       
        await toProcessQueue.add("message", nMensagem)
    } catch (error) {
        console.error("Error adding item to queue: toProcess.",error)
    }
}
create()
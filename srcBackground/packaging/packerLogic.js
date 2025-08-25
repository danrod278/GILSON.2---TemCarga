import findConfig from "find-config"
import { conversationsHold } from '../config/bullmq/queues.js';
import { contactsHold } from '../config/bullmq/queues.js';
import dotenv from "dotenv"
dotenv.config({ path: findConfig('.env') })


export async function packerLogic(job) {
    const data = job.data
    const number = Object.keys(data)[0]
    const dataSearchHoldingQueue = await searchContactOnHolding(number)
    if (dataSearchHoldingQueue[0]) {
        console.log('Juntando mensagens')
        await joinMessages(number, data[number].texto)
        return
    } else {
        console.log("criando item")
        await newContactOnQueue(number)
        await addMessageToHold(data, number)

        return
    }
}

async function joinMessages(number, content) {
    try {
        //searching message
        const jobId = `br${number}`
        const rawMessage = await conversationsHold.getJob(jobId)
        if (!rawMessage) {
            console.error("job not found")
            return false
        }
        //joing
        const messageData = rawMessage.data[number]
        if (!messageData.texto || !messageData.data) {
            console.error("Json syntax error")
            return false
        }
        const newText = messageData.texto + '\n' + content

        //updating
        await rawMessage.updateData({
            ...rawMessage.data,
            [number]:
            {
                ...rawMessage.data[number],
                texto: newText,
                data: Date.now()
            }
        })
    } catch (error) {
        console.error("Error when updating a register on conversationsHold:", error)
    }
}

async function addMessageToHold(data, number) {
    try {
        number = `br${number}`
        await conversationsHold.add("AddMessageOnHold", data, { jobId: number })
        console.log("Message added to Hold queue.");

    } catch (error) {
        console.error("Error when adding message on queue messageHold", error)

    }
}


async function newContactOnQueue(number) {
    try {
        await contactsHold.add("newContact", number)
        console.log("Number added to queue conntactsHold");
        return true

    } catch (error) {
        console.error("Error when adding a number on queue contactsHold:", error)
        return false
    }
}


const searchContactOnHolding = async (number) => {
    try {
        const activeContacts = await contactsHold.getWaiting()
        const queueSearch = activeContacts.filter(contact => { return contact.data == number })
        if (queueSearch.length > 0) {
            return [true, queueSearch[0]]
        }
        return [false]

    } catch (error) {
        console.error("Error when searching contatct on the queue contactsHold", error)
        return [false]
    }
}

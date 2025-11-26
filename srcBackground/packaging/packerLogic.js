import findConfig from "find-config"
import { conversationsHold } from '../config/bullmq/queues.js';
import { contactsHold } from '../config/bullmq/queues.js';
import dotenv from "dotenv"

dotenv.config({ path: findConfig('.env') })

const originalLog = console.log;
console.log = (...args) => {
    originalLog("\x1b[36m%s\x1b[0m", args.join(" "));
};

const originalError = console.error;
console.error = (...args) => {
    originalError("\x1b[31m%s\x1b[0m", args.join(" "));
};


export async function packerLogic(job) {
    const data = job.data
    const number = Object.keys(data)[0]
    const dataSearchHoldingQueue = await searchContactOnHolding(number)
    if (dataSearchHoldingQueue[0]) {
        console.log('packerLogic.js :: Joing messages')
        await joinMessages(number, data[number].texto)
        return
    } else {
        await newContactOnQueue(number)
        await addMessageToHold(data, number)
        return
    }
}

async function joinMessages(number, content) {
    try {
        //searching message
        const jobId = `${number}`
        const rawMessage = await conversationsHold.getJob(jobId)
        console.log("packerLogic.js :: rawJob:", JSON.stringify(await rawMessage, null, 2))
        const stateJob = await rawMessage.getState()
        console.log("packerLogic.js :: stateJob:", stateJob)
        if (!rawMessage || stateJob !== "delayed") {
            console.error("packerLogic.js :: job not found")
            return false
        }
        //joing
        const messageData = rawMessage.data[number]
        if (!messageData.texto || !messageData.data) {
            console.error("packerLogic.js :: Json syntax error")
            return false
        }
        const newText = messageData.texto + '\n' + content

        //updating
        

        const newJob = {
            [number]:
            {
                texto: newText,
                data: Date.now()
            }
        }
        console.log("packerLogic.js :: newJob:", JSON.stringify(await newJob, null, 2))
        const job = await conversationsHold.add(rawMessage.name, newJob, {
            delay: 10000,
            jobId: jobId,
            removeOnComplete: true,
            removeOnFail: true
        })
        console.log("packerLogic.js :: job:", JSON.stringify(await job, null, 2));


    } catch (error) {
        console.error("packerLogic.js :: Error when updating a register on conversationsHold:", error)
    }
}

async function addMessageToHold(data, number) {
    try {
        const delay = 10000

        //adding message
        const job = await conversationsHold.add("addmessage", data, { jobId: number, delay: delay, removeOnComplete: true, removeOnFail: true })
        const state = await job.getState()

        console.log("packerLogic.js :: State job:", state)
        if (state == "delayed") {

            console.log("packerLogic.js :: Message added to Hold queue conversations.");
            return true
        } else {
            console.error("packerLogic.js :: Message not added to Hold queue conversations.");
            return false
        }

    } catch (error) {
        console.error("packerLogic.js :: Error when adding message on queue messageHold", error)

    }
}

async function newContactOnQueue(number) {
    try {
        console.log("packerLogic.js :: number:", number)
        //adding contact
        const responseadd = await contactsHold.add("newContact", number, { jobId: number })
        console.log("packerLogic.js :: Number added to queue conntactsHold:", responseadd);
        const stateJob = await responseadd.getState()
        if (stateJob == "waiting") {
            console.log("packerLogic.js :: Message added to Hold queue contacts.");
        } else {
            console.error("packerLogic.js :: Message not added to Hold queue contacts.");
        }
        return true

    } catch (error) {
        console.error("packerLogic.js :: Error when adding a number on queue contactsHold:", error)
        return false
    }
}


const searchContactOnHolding = async (number) => {
    try {

        //check if contact is there

        const activeContacts = await contactsHold.getWaiting()
        const queueSearch = activeContacts.filter(contact => { return contact.data == number })
        if (queueSearch.length > 0) {
            return [true, queueSearch[0]]
        }
        console.error("packerLogic.js :: Contato não encontrado na fila de espera")
        return [false]

    } catch (error) {
        console.error("packerLogic.js :: Error when searching contatct on the queue contactsHold", error)
        return [false]
    }
}

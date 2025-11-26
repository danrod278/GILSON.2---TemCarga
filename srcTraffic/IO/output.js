import { getMessages } from "../logic/getMessages.js";

export const sendMessages = async (client) => {
    try {
        getMessages(client)
        
    } catch (error) {
        console.error("Error to call getMEssages,",error)
    }
    
}

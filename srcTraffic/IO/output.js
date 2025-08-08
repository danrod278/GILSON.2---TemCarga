import { getMessages } from "../logic/getMessages.js";

export const sendMessages = async (client) => {
    try {
        getMessages(client)
        
    } catch (error) {
        console.error("Error socall getMEssages,",error)
    }
    console.log("MEnsagem enviada para:", nContato);

}


import { addMessageOnQueue } from "../logic/producer.js"

export const input = async (client) => {
    console.log('FOI')
    client.on("message", async message => {
        console.log('FOI')
        if (message.from.includes('@g.us')) {
            return // bloqueia mensagem de grupos
        }
        if (message.body == "") {
            return // bloqueia mensagens vazias
        }
        const numero = message.from
        var mensagem = message.body
        var nMensagem = {
            [numero]: { texto: mensagem, data: Date.now() }
        } //objeto que salva o telefone e a mensagem daquele contato
        console.log("Conteúdo mensagem:",nMensagem)
        await addMessageOnQueue(nMensagem)
    })
}

import { addMessageOnQueue } from "../logic/producer.js"

export const input = async (client) => {
    client.on("message", async message => {
        if (message.from.includes('@g.us')) {
            return // bloqueia mensagem de grupos
        }
        if (message.body == "") {
            return // bloqueia mesnganes vazias
        }
        const numero = message.from.split('@')[0];
        var mensagem = message.body
        var nMensagem = {
            [numero]: { texto: mensagem, data: Date.now() }
        } //objeto que salva o telefone e a mensagem daquele contato
        console.log("Conteudo mensagem:",nMensagem)
        await addMessageOnQueue(nMensagem)
    })
}

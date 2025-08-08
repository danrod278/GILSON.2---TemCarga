import whatsappWeb from "whatsapp-web.js"
const { Client, LocalAuth } = whatsappWeb
import qrcode from "qrcode-terminal"
import { input } from "../IO/input.js";
const client = new Client({
    authStrategy: new LocalAuth()
});

export const initializeBot =  async () => {
    client.on('disconnected', (reason) => {
        console.log('Cliente desconectado. Motivo:', reason);
        process.exit(); // ou tente reinicializar o bot aqui
    });

    // Mostra o QR Code no terminal
    client.on('qr', qr => {
        qrcode.generate(qr, { small: true });
    });

    // Confirma quando o bot estiver pronto
    client.on('ready', async () => {
        console.log('Bot está pronto!');
    });
    try {
        client.initialize();
    } catch (error) {
        client.destroy()
        console.error("Error to initialize client on whatsappclient,",error)
    }
    await input(client)
}


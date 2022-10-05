const { Client, MessageMedia, Location, Buttons, LocalAuth } = require('whatsapp-web.js');

const path = require("path");

let client = null;
var qr_text = null;

async function IniciarConexion2(req, res) {

    let send = "";

    console.log("Iniciando la conexion");
    client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                //  '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--single-process', // <- this one doesn't works in Windows
                // '--disable-gpu'
            ]
        }
    });
    client.on('ready', () => {
        console.log("Ready");
        sessions = 1;
        clienteWS = client;
        send = "ready";
    });

    client.on('qr', (qr) => {
        console.log("qrrr,", qr);
        clienteWS = client;
        qrWS = qr;
        send = "qr";
    });

    client.on('auth_failure', msg => {
        console.error('AUTHENTICATION FAILURE', msg);
        sessions = 0;
        clienteWS = null;
    });

    await client.initialize();

    client.on('disconnected', (reason) => {
        console.log('Whatsapp is disconnected! ' + reason);
        sessions = 0;
        client.destroy();
        clienteWS = null;
    });


    client.on("message", async (msg) => {
        const { from, to, body } = msg;
        console.log(from, to, body);

        let comando = body.trim().toLowerCase();

        if (comando == "/ayuda") {
            await client.sendMessage(from, textos.ayuda());
        }


        /*
        let iphone = '51981359205@c.us';
        if (from === iphone) {
            //await descargarMedia('http://localhost/api-sedapal/barra.php');
            const media = await MessageMedia.fromUrl('http://localhost/api-sedapal/barra.php');
            media.mimetype = "image/png";
            media.filename = "agua.png";
            await client.sendMessage('51998322450@c.us', media, { caption: 'Avisos en Proceso de Atencion de Agua' });
            //client.sendMessage('51998322450@c.us',"hola amix");
        }
        */
    });

    if (send == "qr")
        res.status(301).redirect("/qr");

    if (send == "ready")
        res.send("Conexion Ready")
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time * 800));
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


module.exports = { client, IniciarConexion2 }
const express  = require("express");
const router = express.Router();
const {buscar} = require("./mysql");

const {client,IniciarConexion2} = require('./whatsapp');
const qr = require('qrcode');



//console.log(textos.start());
var estado=0;

const ir_qr = (res) => {
    res.status(301).redirect("/qr");
}

const activo = (res) => {
    try {
        res.send("Activo");
        console.log("esta activo");

    } catch (error) {
        console.log(error);
    }
}

const salir = async (res) => {
    try {
        await clienteWS.destroy();
        //wait clienteWS.logout();
        clienteWS = null;
        console.log("se salio del ws");
        res.send("Ya se salio del WS");
    } catch (error) {
        console.log("salir error: " + error);
        //console.log(client);
        res.send("no se pudo" + error);
    }
}

const salir2 = async (res) => {
    try {
        //await clienteWS.destroy();
        await clienteWS.logout();
        clienteWS = null;
        console.log("se salio del ws");
        res.send("Ya se salio del WS");
    } catch (error) {
        console.log("salir error: " + error);
        //console.log(client);
        res.send("no se pudo" + error);
    }
}

router.get('/algo',(req,res)=>{
    res.send("algooooooo");
});

router.get('/envio/:telefono',async (req,res)=>{
  //  console.log(req.body);
    console.log(req.params);
    await clienteWS.sendMessage("51"+req.params.telefono+"@c.us","Bienvenido..!");
    res.send("envio");
});

router.get('/envio_dni/:dni',async (req,res)=>{
    //  console.log(req.body);
     // console.log(req.params);
      const row = await buscar(req.params.dni);
    let telefono = row[0].telefono;

     if(telefono.length==9){
        await clienteWS.sendMessage("51"+telefono+"@c.us","Bienvenido... "+row[0].nombres.toUpperCase());
     }
      res.send(telefono);
  });




router.get('/', async function (req, res) {

    if (clienteWS == null){
        await IniciarConexion2(req,res);
      
    }else {
        let estado = await clienteWS.getState();
        if(estado==null){
            res.status(301).redirect("/qr");
        }else
        res.send("El estado del Servidor es: " + estado);
    }

});

router.get("/qr", async function (req, res) {

    //console.log(clienteWS);
    if(clienteWS==null ){
        console.log("redirigimos al iniciio");
        res.redirect("/");
        return;
    }

      const estado = await clienteWS.getState();
    if (estado == "CONNECTED") {
        res.status(301).redirect("/activo");
        return;
    }
    //console.log(req.query);
    qr.toDataURL(qrWS, new Date, function (err, url) {
        if (err) return console.log("error occurred en el qr ", qrWS);
        res.render("index", { 'qr': url });
    })
});


router.get("/activo", async function (req, res) {
   // await clienteWS.sendMessage("51981359205@c.us","Ya esta listo para el trabajo");
    res.send("Ya esta ok");
   
});

router.get("/salir", function (req, res) {
    salir(res);
});

router.get("/salir2", function (req, res) {
    salir2(res);
});


module.exports = router;
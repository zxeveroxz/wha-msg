require('dotenv').config();
const mysql = require('mysql2/promise');
let connection = null;
async function conectar() {
    
    connection = await mysql.createConnection(
        {
            host: process.env.DB_HOSTNAME,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE
        });
 }  

async function buscar($dni){
    const [row, fields] = await connection.execute('SELECT * FROM tbl_participantes where tip_doc=? and nro_doc=?', ['dni',$dni]);
    return row;
}
conectar();


module.exports = {buscar}
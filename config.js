//estas son las configuraciones principales del servidor
const mysql = require('mysql');
module.exports = {
    port: process.env.PORT || 3000,
    connection:()=>{return mysql.createConnection({ 
        host: "sql136.main-hosting.eu",
        user: "u781201566_azzus", 
        password: "azzus123", 
        database: "u781201566_azzus" 
    })},  
}
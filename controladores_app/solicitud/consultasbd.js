'use strict'
let mysql = require('mysql');
let moment = require('moment');
let config = require('../../config');
let dbConnection = config.connection;
let request = require('request');
let basicas = require('../basicas');

//buscar operador va a recivir el id y un callback que es la funcion que ejecutara al encontrar al operador
// let buscarOperador = (id,callback) => {
//     let sql = `SELECT * FROM usuario WHERE id_usuario = ${id}`;
    
//     callback();
// }


let consultaBd = (sql, callback)=>{
    let connection = dbConnection();
    connection.query(sql,(err,result,fields)=>{
        if(err){
            console.log(`Error en : controladores_app/solicitud/consultas  let consultaBd ${err}`);
        }else if(result == ""){
            console.log(`sin resultados : controladores_app/solicitud/consultas  let consultaBd sin resultados `)
        } 
        callback(result);
        console.log('Se realizo consulta con exito ');
        connection.destroy();
    });
}


module.exports={
    consultaBd
}



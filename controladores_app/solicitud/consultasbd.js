'use strict'
let mysql = require('mysql');
let moment = require('moment');
let config = require('../../config');
let dbConnection = config.connection;
let request = require('request');
let basicas = require('../basicas');

//realizar consulta de bd
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



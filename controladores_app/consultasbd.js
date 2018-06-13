'use strict'
let mysql = require('mysql');
let moment = require('moment');
let config = require('../config');
let dbConnection = config.connection;
let request = require('request');
let basicas = require('./basicas');

//realizar consulta de bd
let consultaBd = (sql, callback)=>{
    let connection = dbConnection();
    connection.query(sql,(err,result,fields)=>{
        if(err){
            console.log(`Error en : controladores_app/solicitud/consultas  let consultaBd ${err}`);
            result= false;
        }else if(result == ""){
            console.log(`sin resultados : controladores_app/solicitud/consultas  let consultaBd sin resultados `);
            result= false;
        } 
        callback(result);
        console.log('Se realizo consulta con exito ');
        connection.destroy();
    });
}


//update 
let actualizar = (sql, callback) =>{
    let connection = dbConnection();
    connection.query(sql, function(err, result) {
        if (err){
            console.log(`Error al actualizar el dato : ${err} , sql = ${sql}`)
        }else if(result == ""){
            console.log(`sin resultados : controladores_app/solicitud/consultas  let consultaBd sin resultados `);
            result= false;
        } 
        callback(result);
        console.log('Se actualizo con exito ');
        connection.destroy();
    });
}

//update 
let insertar = (sql, callback) =>{
    let connection = dbConnection();
    connection.query(sql, function(err, result) {
        if (err){
            console.log(`Error al agregar el dato : ${err} , sql = ${sql}`)
        }else if(result == ""){
            console.log(`sin resultados : controladores_app/solicitud/consultas  let consultaBd sin resultados `);
            result= false;
        } 
        callback(result);
        console.log('Se agrego solicitud agendada con exito ');
        connection.destroy();
    });
}

module.exports={
    consultaBd,
    actualizar,
    insertar
}



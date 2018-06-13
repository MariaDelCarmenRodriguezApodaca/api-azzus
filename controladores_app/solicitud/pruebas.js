'use strict'
let mysql = require('mysql');
let moment = require('moment');
let config = require('../../config');
let dbConnection = config.connection;
let request = require('request');
let basicas = require('../basicas');
let consultaBd = require('../consultasBd');

let buscarOperador = (req,res)=>{
    // let sql = `SELECT * FROM usuarios WHERE id_usuario = ${req.params.id}`;
    // consultaBd.consultaBd(sql,(result)=>{
    //     if(result) console.log(result);
    // });
    var date = new Date();
    var formattedDate = moment(date).format('YYYYMMDD');
    console.log(formattedDate);
}


module.exports={
    buscarOperador
}
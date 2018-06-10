'use strict'
const mysql = require('mysql');
const moment = require('moment');
const config = require('../config');
const dbConnection = config.connection;


/**
 * 
 * ejemplo: obtener todas las quejas
 * 
 * localhost:3000/complains/all
 * 
 */


function getAllComplains(req, res) {
    var connection  = dbConnection();
    connection.query("SELECT * FROM queja", function(err, result, fields) {
        if (err) return res.status(500).send({ message: `Error al realizar la consulta : ${err}` });
        if (result == "") return res.status(404).send({ message: `no existen quejas` });
        res.status(200).send({ message: result });
        connection.destroy();
    });
};

//obtener todas las quejas por el remitente o para un destinatario
function getComplains(req, res) {
    //localhost:3000/complains/user/:id_usuario
    var connection  = dbConnection();
    var usuario = req.params.id_usuario;
    connection.query(`SELECT * FROM queja WHERE remitente= ${usuario} OR destinatario= ${usuario}`, function(err,result,fields){
        if (err) return res.status(500).send({ message: `Error al realizar la consulta : ${err}` });
        if (result == "") return res.status(404).send({ message: `no existe la queja` });
        res.status(200).send({ message: result });
        connection.destroy();    
    });

};


//obtener una queja por el remitente o para un destinatario
function getComplain(req, res) {
    //enviar de parametro el filtro
    //1 ) queja realizadas por un usuario
    //2 ) queja recividas de un usuario

};

//nueva queja
function newComplain(req, res) {

};

module.exports = {
    getAllComplains,
    getComplains,
    getComplain,
    newComplain
}
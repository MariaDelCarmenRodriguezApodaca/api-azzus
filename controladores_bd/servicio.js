'use strict'

const mysql = require('mysql');
const moment = require('moment');
const config = require('../config');
const dbConnection = config.connection;

//obtener todos los servicios
function getServices(req, res) {
    var connection  = dbConnection();
    connection.query("SELECT * FROM servicio", function(err, result, fields) {
        if (err) return res.status(500).send({ message: `Error al realizar la consulta : ${err}` });
        if (result == "") return  res.status(404).send({ message: `No hay servicios guardadas` });
        res.status(200).send({ message: result });
        connection.destroy();
    });
    
};

//obtener un servicio por id
function getServiceXId(req, res) {
    var connection  = dbConnection();
    connection.query("SELECT * FROM servicio WHERE id_servicio=" + req.params.id, function(err, result, fields) {
        if (err) return res.status(500).send({ message: `Error al realizar la consulta : ${err}` });
        if (result == "") return res.status(404).send({ message: `El servicio no existe` });
        res.status(200).send({ message: result });
        connection.destroy();
    });
};

//añadir un servicio
function newService(req, res) {
    var connection  = dbConnection();
    var sql = `INSERT INTO servicio (id_servicio,descripcion, costo_min, costo_max, azzus_comicion, estatus) VALUES (NULL,"${req.body.descripcion}","${req.body.costo_min}","${req.body.costo_max}","${req.body.azzus_comicion}","activo")`;
    connection.query(sql, function(err, result) {
        if (err) return res.status(500).send({ message: `Error al aguardar el servicio : ${err}` });
        if (result == "") return res.status(404).send({ message: `Error al guardar el servicio` });
        res.status(200).send({ message: result });
        connection.destroy();
    });
};

//modificar un servicio
function updateService(req, res) {


};

//dar de baja un servicio
function downService(req, res) {

};

//eliminar un servicio
function deleteService(req, res) {

};

module.exports = {
    getServices,
    getServiceXId,
    newService,
    updateService,
    downService,
    deleteService
};
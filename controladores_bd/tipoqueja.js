'use strict'

const mysql = require('mysql');
const moment = require('moment');
const config = require('../config');
const dbConnection = config.connection;

//obtener todos los tipos que queja
function getTypesComplains(req, res) {
    var connection  = dbConnection();
    connection.query("SELECT * FROM tipo_queja", function(err, result, fields) {
        if (err) return res.status(500).send({ message: `Error al realizar la consulta : ${err}` });
        if (result == "") return res.status(404).send({ message: `No hay quejas guardadas` });
        res.status(200).send({ message: result });
        connection.destroy();
    });
};

//obtener un tipo de queja por descripcion o por id
function getTypesComplain(req, res) {
    /**Nota
     * mandar por la url el filtro para obtenerna; por id, por nombre.
     */
    var filtro = req.params.filtro;
    var dato = req.params.dato;
    var connection  = dbConnection();
    switch (filtro) {
        case "id":
            connection.query("SELECT * FROM tipo_queja WHERE id_tipo_queja=" + dato, function(err, result, fields) {
                if (err) return res.status(500).send({ message: `Error al realizar la consulta : ${err}` });
                if (result == "") return res.status(404).send({ message: `El usuario no existe` });
                res.status(200).send({ message: result });
                connection.destroy();
            });
            break;
        case "descripcion":
            dato = "'" + dato + "'"
            connection.query("SELECT * FROM tipo_queja WHERE descripcion=" + dato, function(err, result, fields) {
                if (err) return res.status(500).send({ message: `Error al realizar la consulta : ${err}` });
                if (result == "") return res.status(404).send({ message: `El usuario no existe` });
                res.status(200).send({ message: result });
                connection.destroy();
            });
            break;

    }

};

//nuevo tipo de queja
function newTypesComplain(req, res) {

}



module.exports = {
    getTypesComplains,
    getTypesComplain,
    newTypesComplain
}
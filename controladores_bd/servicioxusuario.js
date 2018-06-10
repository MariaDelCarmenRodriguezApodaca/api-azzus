'use strict'
/**Nota: 
 * Tomar en cuenta las extrellas que tiene un usuario en cada servicio
 */
const mysql = require('mysql');
const moment = require('moment');
const config = require('../config');
const dbConnection = config.connection;

//ver toda la lista de servicios por un operador
function getServicesXUser(req, res) {

};
//ver un servicio de un operador
function getServiceXUser(req, res) {

};

//agregar nuevo sercicio a mi lista de servicios
function newServiceXUser(req, res) {

};

//modificar nuevo sercicio a mi lista de servicios
function updateServiceXUser(req, res) {

};

module.exports = {
    getServicesXUser,
    getServiceXUser,
    newServiceXUser,
    updateServiceXUser
}
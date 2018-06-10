'use strict'

const mysql = require('mysql');
const moment = require('moment');
const config = require('../config');
const dbConnection = config.connection;
var connection  = dbConnection();

//traer solicitudes
function getRequests(req, res) {
    var connection  = dbConnection();
    //agarra todas las solicitudes de la tabla 
    connection.query("SELECT * FROM solicitud", function(err, result, fields) {
        if (err) return res.status(500).send({ message: `Error al realizar la consulta : ${err}` });
        if (result == "") return res.status(404).send({ message: `No hay solicitudes guardadas guardadas` });
        res.status(200).send({ message: result });
        connection.destroy();
    });
}

function getRequestsXIdSolicitante(req, res){
    var connection  = dbConnection();
    //localhost:3000/requests/xs/:idSolicitante
    var id_solicitante = req.params.idSolicitante;
        /*
        * nombre cliente       ->lo sacaremos con el id    #2
        * nombre del operador  ->lo sacaremos con el id    #2
        * servicio             ->                          #1 
        * nombre del servicio  ->lo sacamos con el id      #3
        * fecha                ->                          #1
        * ---------
        * costo del servicio   ->                          #1
        */
    connection.query(`
        SELECT id_solicitud, id_solicitante, 
        soli.nombre AS "solicitante_nombre", 
        soli.ap AS "solicitante_ap", 
        soli.am AS "solicitante_am", 
        soli.telefono AS "solicitante_telefono", 
        serv.descripcion,
        ope.nombre AS "operador_nombre", 
        ope.ap AS "operador_ap", 
        ope.am AS "operador_am", 
        ope.telefono AS "operador_telefono"
        FROM solicitud_terminada
        INNER JOIN usuarios as soli 
        on solicitud_terminada.id_solicitante = soli.id_usuario 
        INNER JOIN servicio as serv 
        on serv.id_servicio = solicitud_terminada.id_servicio 
        INNER JOIN usuarios as ope 
        on solicitud_terminada.id_operador = ope.id_usuario 
        WHERE solicitud_terminada.id_solicitante=${id_solicitante}
        `, function(err, result, fields){
            if (err) return res.status(500).send({ message: `Error al realizar la consulta : ${err}` });
            if (result == "") return res.status(404).send({ message: `No hay solicitudes guardadas con ese usuario` });
            connection.query("",function(err,result,fields){

        });
        res.status(200).send({ message: result });
        connection.destroy();
    });
}

function getRequestsXIdOperador(req, res){
    //localhost:3000/requests/xo/:idOperador
    var idOperador = req.params.idOperador;
    var connection  = dbConnection();
        /*
        * nombre cliente       ->lo sacaremos con el id    #2
        * nombre del operador  ->lo sacaremos con el id    #2
        * servicio             ->                          #1 
        * nombre del servicio  ->lo sacamos con el id      #3
        * fecha                ->                          #1
        * ---------
        * costo del servicio   ->                          #1
        */
    connection.query(`
        SELECT id_solicitud, id_solicitante, 
        soli.nombre AS "solicitante_nombre", 
        soli.ap AS "solicitante_ap", 
        soli.am AS "solicitante_am", 
        soli.telefono AS "solicitante_telefono", 
        serv.descripcion,
        ope.nombre AS "operador_nombre", 
        ope.ap AS "operador_ap", 
        ope.am AS "operador_am", 
        ope.telefono AS "operador_telefono"
        FROM solicitud_terminada
        INNER JOIN usuarios as soli 
        on solicitud_terminada.id_solicitante = soli.id_usuario 
        INNER JOIN servicio as serv 
        on serv.id_servicio = solicitud_terminada.id_servicio 
        INNER JOIN usuarios as ope 
        on solicitud_terminada.id_operador = ope.id_usuario 
        WHERE solicitud_terminada.id_operador=${idOperador}
        `, function(err, result, fields){
            if (err) return res.status(500).send({ message: `Error al realizar la consulta : ${err}` });
            if (result == "") return res.status(404).send({ message: `No hay solicitudes guardadas con ese usuario` });
            connection.query("",function(err,result,fields){

        });
        res.status(200).send({ message: result });
        connection.destroy();
    });
}


//nueva solicitud
function newRequest(req, res) {
    var connection  = dbConnection();
    connection.query(`INSERT INTO solicitud (
                                id_solicitud,
                                id_solicitante,
                                id_operador,
                                id_servicio,
                                fecha,
                                hora,
                                lat_inicio,
                                lng_inicio,
                                lat_fin,
                                lng_fin,
                                costo,
                                estatus 
                            )
                            VALUES (
                                NULL,
                                ${req.body.id_solicitante},
                                ${req.body.id_operador},
                                ${req.body.id_servicio},
                                ${req.body.fecha},
                                ${req.body.hora},
                                ${req.body.lat_inicio},
                            )
                            `,
    function(err,result){
        //funcion
        connection.destroy();
    });
    
};

//modificar estado solicitud:
function updateStatusRequest(req, res) {

};

module.exports = {
    getRequests,
    newRequest,
    getRequestsXIdSolicitante,
    getRequestsXIdOperador,
    updateStatusRequest
};
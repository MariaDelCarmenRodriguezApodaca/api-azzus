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
        //Cambiar consulta hacer mas entendible quitando lo As a las tablas
    connection.query(`
            SELECT 
            solicitud.fecha,
            solicitud.hora,
            solicitud.costo,
            id_solicitud, id_solicitante, 
            soli.nombre AS "solicitante_nombre", 
            soli.ap AS "solicitante_ap", 
            soli.am AS "solicitante_am", 
            soli.telefono AS "solicitante_telefono", 
            serv.descripcion,
            ope.genero,
            ope.nombre AS "operador_nombre", 
            ope.ap AS "operador_ap", 
            ope.am AS "operador_am", 
            ope.telefono AS "operador_telefono"
            FROM solicitud
            INNER JOIN usuarios as soli 
            on solicitud.id_solicitante = soli.id_usuario 
            INNER JOIN servicio as serv 
            on serv.id_servicio = solicitud.id_servicio 
            INNER JOIN usuarios as ope 
            on solicitud.id_operador = ope.id_usuario 
            WHERE solicitud.id_solicitante=${id_solicitante}
            AND solicitud.estatus = 'TERMINADO'
        `, function(err, result, fields){
            if (err) return res.status(500).send({ message: `Error al realizar la consulta : ${err}` });
            if (result == "") return res.status(404).send({ message: `No hay solicitudes guardadas con ese usuario` });
            connection.query("",function(err,result,fields){

        });
        res.status(200).send({ message: result });
        connection.destroy();
    });
}

let getRequestsPendientesXIdSolicitante =(req, res)=>{
    var connection  = dbConnection();
    var id_solicitante = req.params.idSolicitante;
    connection.query(`
            SELECT 
            DATE_FORMAT(solicitud.fecha, "%Y-%m-%d") as fecha,
            solicitud.hora,
            solicitud.costo,
            id_solicitud, id_solicitante, 
            soli.nombre AS "solicitante_nombre", 
            soli.ap AS "solicitante_ap", 
            soli.am AS "solicitante_am", 
            soli.telefono AS "solicitante_telefono", 
            serv.descripcion,
            ope.genero,
            ope.nombre AS "operador_nombre", 
            ope.ap AS "operador_ap", 
            ope.am AS "operador_am", 
            ope.telefono AS "operador_telefono"
            FROM solicitud
            INNER JOIN usuarios as soli 
            on solicitud.id_solicitante = soli.id_usuario 
            INNER JOIN servicio as serv 
            on serv.id_servicio = solicitud.id_servicio 
            INNER JOIN usuarios as ope 
            on solicitud.id_operador = ope.id_usuario 
            WHERE solicitud.id_solicitante=${id_solicitante}
            AND solicitud.estatus = 'PENDIENTE' `
            , function(err, result, fields){
            if (err) return res.status(500).send({ message: `Error al realizar la consulta : ${err}` });
            if (result == "") return res.status(404).send({ message: `No hay solicitudes guardadas con ese usuario` });
            connection.query("",function(err,result,fields){
        });
        res.status(200).send({ message: result });
        connection.destroy();
    });
}

let getRequestsXIdOperador = (req, res) => {
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
        SELECT 
        DATE_FORMAT(solicitud.fecha, "%Y-%m-%d") as fecha,
        solicitud.hora,
        solicitud.costo,
        id_solicitud, id_solicitante, 
        soli.nombre AS "solicitante_nombre", 
        soli.ap AS "solicitante_ap", 
        soli.am AS "solicitante_am", 
        soli.genero AS solicitante_genero,
        soli.telefono AS "solicitante_telefono", 
        serv.descripcion,
        ope.nombre AS "operador_nombre", 
        ope.ap AS "operador_ap", 
        ope.am AS "operador_am", 
        ope.telefono AS "operador_telefono"
        FROM solicitud
        INNER JOIN usuarios as soli 
        on solicitud.id_solicitante = soli.id_usuario 
        INNER JOIN servicio as serv 
        on serv.id_servicio = solicitud.id_servicio 
        INNER JOIN usuarios as ope 
        on solicitud.id_operador = ope.id_usuario 
        WHERE solicitud.id_operador=${idOperador}
        AND solicitud.estatus = 'TERMINADO'
        `, function(err, result, fields){
            if (err) {
                res.status(500).send({ message: `Error al realizar la consulta : ${err}` });
            } else if (result == ""){
                res.status(404).send({ message: `No hay solicitudes guardadas con ese usuario` });
            } else 
            res.status(200).send({ message: result });
        connection.destroy();
    });
}

let getRequestsPendientesXIdOperador = (req, res) => {
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
        SELECT 
        DATE_FORMAT(solicitud.fecha, "%Y-%m-%d") as fecha,
        solicitud.hora,
        solicitud.costo,
        id_solicitud, id_solicitante, 
        soli.nombre AS "solicitante_nombre",
        soli.genero AS solicitante_genero, 
        soli.ap AS "solicitante_ap", 
        soli.am AS "solicitante_am", 
        soli.telefono AS "solicitante_telefono", 
        serv.descripcion,
        ope.nombre AS "operador_nombre", 
        ope.ap AS "operador_ap", 
        ope.am AS "operador_am", 
        ope.telefono AS "operador_telefono"
        FROM solicitud
        INNER JOIN usuarios as soli 
        on solicitud.id_solicitante = soli.id_usuario 
        INNER JOIN servicio as serv 
        on serv.id_servicio = solicitud.id_servicio 
        INNER JOIN usuarios as ope 
        on solicitud.id_operador = ope.id_usuario 
        WHERE solicitud.id_operador=${idOperador}
        AND solicitud.estatus = 'PENDIENTE'
        `, function(err, result, fields){
            if (err) {
                res.status(500).send({ message: `Error al realizar la consulta : ${err}` });
            } else if (result == ""){
                res.status(404).send({ message: `No hay solicitudes guardadas con ese usuario` });
            } else 
            res.status(200).send({ message: result });
        connection.destroy();
    });
}
//PERSONALIZADA:
//me mandara id_solicitante,filtro{dia,semana,mes}
let historialXFechaXSolicitante = (req,res) => {
    var idSolicitante = req.params.idSolicitante;
    let sql = `
    SELECT 
    solicitud.fecha,
    solicitud.hora,
    solicitud.costo,
    id_solicitud, id_solicitante, 
    soli.nombre AS "solicitante_nombre", 
    soli.ap AS "solicitante_ap", 
    soli.am AS "solicitante_am", 
    soli.telefono AS "solicitante_telefono", 
    serv.descripcion,
    ope.genero,
    ope.nombre AS "operador_nombre", 
    ope.ap AS "operador_ap", 
    ope.am AS "operador_am", 
    ope.telefono AS "operador_telefono"
    FROM solicitud
    INNER JOIN usuarios as soli 
    on solicitud.id_solicitante = soli.id_usuario 
    INNER JOIN servicio as serv 
    on serv.id_servicio = solicitud.id_servicio 
    INNER JOIN usuarios as ope 
    on solicitud.id_operador = ope.id_usuario 
    WHERE solicitud.id_solicitante= ${idSolicitante}
    AND solicitud.estatus = 'TERMINADO'
    `;
    if(req.params.filtro == 'dia'){
        sql += ' AND solicitud.fecha= CURDATE()';
    }else if(req.params.filtro == 'semana'){
        sql += ' AND solicitud.fecha > DATE_SUB(NOW(),INTERVAL 7 DAY)'
    }else if(req.params.filtro == 'mes'){
        sql += ' AND solicitud.fecha > DATE_SUB(NOW(),INTERVAL 1 MONTH)';
    }
    var connection = dbConnection();
    console.log('query de historial con filtros: ', sql);
    connection.query(sql, function (err, result, fields){
        if(err){
            console.log(`Error al realizar la consulta : ${err}`)
        }else if(result != ""){
            res.status(200).send({ message: result });
        }else{
            console.log('No hay resultados')
            res.status(200).send({ message: `No hay resultados` });
        } 
        connection.destroy();
    });
    
}

//PERSONALIZADA:
//me mandara id_solicitante, fecha_inicio, fecha_fin
let historialXFechaInicioFinXSolicitante = (req,res) => {
    let idSolicitante = req.params.idSolicitante;
    let fechaInicio = req.params.inicio;
    let fechaFin = req.params.fin;
    let sql = `
    SELECT 
    solicitud.fecha,
    solicitud.hora,
    solicitud.costo,
    id_solicitud, id_solicitante, 
    soli.nombre AS "solicitante_nombre", 
    soli.ap AS "solicitante_ap", 
    soli.am AS "solicitante_am", 
    soli.telefono AS "solicitante_telefono", 
    serv.descripcion,
    ope.genero,
    ope.nombre AS "operador_nombre", 
    ope.ap AS "operador_ap", 
    ope.am AS "operador_am", 
    ope.telefono AS "operador_telefono"
    FROM solicitud
    INNER JOIN usuarios as soli 
    on solicitud.id_solicitante = soli.id_usuario 
    INNER JOIN servicio as serv 
    on serv.id_servicio = solicitud.id_servicio 
    INNER JOIN usuarios as ope 
    on solicitud.id_operador = ope.id_usuario 
    WHERE solicitud.id_solicitante= ${idSolicitante}
    AND solicitud.fecha >= '${fechaInicio}' <= '${fechaFin}'
    AND solicitud.estatus = 'TERMINADO'
    `;
    var connection = dbConnection();
    console.log('query de historial con filtros: ', sql);
    connection.query(sql, function (err, result, fields){
        if(err){
            console.log(`Error al realizar la consulta : ${err}`)
        }else if(result != ""){
            res.status(200).send({ message: result });
        }else{
            console.log('No hay resultados')
            res.status(200).send({ message: `No hay resultados` });
        } 
        connection.destroy();
    });
    
}
let historialXFechaXOperador = (req,res) => {
    var idOperador = req.params.idOperador;
    let sql = `
    SELECT 
    solicitud.fecha,
    solicitud.hora,
    solicitud.costo,
    id_solicitud, id_solicitante, 
    soli.genero AS solicitante_genero,
    soli.nombre AS "solicitante_nombre", 
    soli.ap AS "solicitante_ap", 
    soli.am AS "solicitante_am", 
    soli.telefono AS "solicitante_telefono", 
    serv.descripcion,
    ope.genero,
    ope.nombre AS "operador_nombre", 
    ope.ap AS "operador_ap", 
    ope.am AS "operador_am", 
    ope.telefono AS "operador_telefono"
    FROM solicitud
    INNER JOIN usuarios as soli 
    on solicitud.id_solicitante = soli.id_usuario 
    INNER JOIN servicio as serv 
    on serv.id_servicio = solicitud.id_servicio 
    INNER JOIN usuarios as ope 
    on solicitud.id_operador = ope.id_usuario 
    WHERE solicitud.id_operador= ${idOperador}
    AND solicitud.estatus = 'TERMINADO'
    `;
    if(req.params.filtro == 'dia'){
        sql += ' AND solicitud.fecha= CURDATE()';
    }else if(req.params.filtro == 'semana'){
        sql += ' AND solicitud.fecha > DATE_SUB(NOW(),INTERVAL 7 DAY)'
    }else if(req.params.filtro == 'mes'){
        sql += ' AND solicitud.fecha > DATE_SUB(NOW(),INTERVAL 1 MONTH)';
    }
    var connection = dbConnection();
    console.log('query de historial con filtros: ', sql);
    connection.query(sql, function (err, result, fields){
        if(err){
            console.log(`Error al realizar la consulta : ${err}`)
        }else if(result != ""){
            res.status(200).send({ message: result });
        }else{
            console.log('No hay resultados')
            res.status(200).send({ message: `No hay resultados` });
        } 
        connection.destroy();
    });
    
}

//PERSONALIZADA:
//me mandara id_solicitante, fecha_inicio, fecha_fin
let historialXFechaInicioFinXOperador = (req,res) => {
    let idOperador = req.params.idOperador;
    let fechaInicio = req.params.inicio;
    let fechaFin = req.params.fin;
    let sql = `
    SELECT 
    solicitud.fecha,
    solicitud.hora,
    solicitud.costo,
    id_solicitud, id_solicitante,
    soli.genero AS solicitante_genero, 
    soli.nombre AS "solicitante_nombre", 
    soli.ap AS "solicitante_ap", 
    soli.am AS "solicitante_am", 
    soli.telefono AS "solicitante_telefono", 
    serv.descripcion,
    ope.genero,
    ope.nombre AS "operador_nombre", 
    ope.ap AS "operador_ap", 
    ope.am AS "operador_am", 
    ope.telefono AS "operador_telefono"
    FROM solicitud
    INNER JOIN usuarios as soli 
    on solicitud.id_solicitante = soli.id_usuario 
    INNER JOIN servicio as serv 
    on serv.id_servicio = solicitud.id_servicio 
    INNER JOIN usuarios as ope 
    on solicitud.id_operador = ope.id_usuario 
    WHERE solicitud.id_operador= ${idOperador}
    AND solicitud.fecha >= '${fechaInicio}' <= '${fechaFin}'
    AND solicitud.estatus = 'TERMINADO'
    `;
    var connection = dbConnection();
    console.log('query de historial con filtros: ', sql);
    connection.query(sql, function (err, result, fields){
        if(err){
            console.log(`Error al realizar la consulta : ${err}`)
        }else if(result != ""){
            res.status(200).send({ message: result });
        }else{
            console.log('No hay resultados')
            res.status(200).send({ message: `No hay resultados` });
        } 
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
    updateStatusRequest,
    historialXFechaXSolicitante,
    historialXFechaInicioFinXSolicitante,
    historialXFechaXOperador,
    historialXFechaInicioFinXOperador,
    getRequestsPendientesXIdOperador,
    getRequestsPendientesXIdSolicitante
};
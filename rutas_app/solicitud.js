'use strict'
const express = require('express');
const ruta = express.Router();
const ctrlSolicitud = require('../controladores_app/solicitud/solicitud');

//http://localhost/solicitud/

//eschar al operador 
ruta.get('/listening/operador/:id/:lat/:lng',ctrlSolicitud.escucharOperadores);
//cuando el solicitante manda solicitud
ruta.post('/request',ctrlSolicitud.nuevaSolicitud);
//escuchar al operador despues de mandar una solicitud
ruta.get('/listening/solicitante/:id',ctrlSolicitud.responderSolicitudASolicitante);
//cuando el operador se desactiva
ruta.get('/listening/operador/logout/:id',ctrlSolicitud.operadorDesactivado);
//cuandon el operador acepta la solicitud
ruta.get('/operador/aceptar/:id/:id_solicitante',ctrlSolicitud.operadorAceptoSolicitud);

ruta.get('/operador/rechazar/:id/:id_solicitante',ctrlSolicitud.operadorRechazoSolicitud);

module.exports = ruta;

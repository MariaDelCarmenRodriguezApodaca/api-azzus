'use strict'
const express = require('express')
const ruta = express.Router()
const ctrlSolicitud = require('../controladores_bd/solicitud')



ruta.get("/all", ctrlSolicitud. getRequests);
ruta.get("/xs/:idSolicitante", ctrlSolicitud.getRequestsXIdSolicitante);
ruta.get("/xo/:idOperador", ctrlSolicitud.getRequestsXIdOperador);
ruta.get("/xs/:idSolicitante/:filtro", ctrlSolicitud.historialXFechaXSolicitante);
ruta.get("/xs/:idSolicitante/:inicio/:fin", ctrlSolicitud.historialXFechaInicioFinXSolicitante);
ruta.get("/xo/:idOperador/:filtro", ctrlSolicitud.historialXFechaXOperador);
ruta.get("/xo/:idOperador/:inicio/:fin", ctrlSolicitud.historialXFechaInicioFinXOperador);

ruta.get("/pendiente/xs/:idSolicitante", ctrlSolicitud.getRequestsPendientesXIdSolicitante);
ruta.get("/pendiente/xo/:idOperador", ctrlSolicitud.getRequestsPendientesXIdOperador);


module.exports = ruta;
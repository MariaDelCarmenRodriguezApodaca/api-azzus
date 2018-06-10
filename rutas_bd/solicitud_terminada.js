'use strict'
const express = require('express')
const ruta = express.Router()
const ctrlSolicitud = require('../controladores_bd/solicitud_terminada')



ruta.get("/all", ctrlSolicitud. getRequests);
ruta.get("/xs/:idSolicitante", ctrlSolicitud.getRequestsXIdSolicitante);
ruta.get("/xo/:idOperador", ctrlSolicitud.getRequestsXIdOperador);




module.exports = ruta;
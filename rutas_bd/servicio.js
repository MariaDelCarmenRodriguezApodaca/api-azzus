'use strict'
const express = require('express')
const ruta = express.Router()
const ctrlServicios = require('../controladores_bd/servicio')

//localhost:3000/services
//mostrar servicios
ruta.get("/all", ctrlServicios.getServices);
ruta.get("/id/:id", ctrlServicios.getServiceXId);

//agregar servicios
ruta.post("/new", ctrlServicios.newService);

module.exports = ruta;
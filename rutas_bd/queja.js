'use strict'
const express = require('express')
const ruta = express.Router()
const ctrlquejas = require('../controladores_bd/queja')

ruta.get("/all", ctrlquejas.getAllComplains);
ruta.get("/user/:id_usuario", ctrlquejas.getComplains);


module.exports = ruta;
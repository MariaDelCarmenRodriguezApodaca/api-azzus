'use strict'
const express = require('express')
const ruta = express.Router()
const ctrlQuejas = require('../controladores_bd/tipoqueja')

//buscar y mostrar quejas:
ruta.get("/all", ctrlQuejas.getTypesComplains);
ruta.get("/:filtro/:dato", ctrlQuejas.getTypesComplain);

module.exports = ruta;
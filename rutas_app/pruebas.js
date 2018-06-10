'use strict'
const express = require('express');
const ruta = express.Router();
const ctrlPruebas = require('../controladores_app/solicitud/pruebas');

ruta.get('/operador/:id',ctrlPruebas.buscarOperador);

module.exports=ruta;
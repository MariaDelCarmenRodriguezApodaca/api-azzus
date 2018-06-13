'use strict'
const express = require('express')
const ruta = express.Router()
const ctrlPerfil = require('../controladores_app/perfil/perfil');

ruta.post('/actualizar/:id',ctrlPerfil.modificarPerfil);

module.exports = ruta;
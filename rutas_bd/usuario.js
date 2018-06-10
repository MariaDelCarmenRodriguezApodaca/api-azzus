'use strict'
const express = require('express')
const ruta = express.Router()
const ctrlUsuarios = require('../controladores_bd/usuario')

//buscar usuarios:ctrlUsuarios
ruta.get("/all", ctrlUsuarios.getUsers);
ruta.get("/id/:userId", ctrlUsuarios.getUserXId);
ruta.get("/idsf/:userId", ctrlUsuarios.getUserXIdSinFoto);
ruta.get("/tel/:userTel", ctrlUsuarios.getUserXTel);
ruta.get("/correo/:userCorreo", ctrlUsuarios.getUserXCorreo);
//guardar usuarios:ctrlUsuarios
ruta.post("/signIn", ctrlUsuarios.saveUser);
//actualizar usuario:ctrlUsuarios
ruta.put("/update/:tipoidentificador/:tipodato/", ctrlUsuarios.updateUser);



module.exports = ruta;
'use strict'
const mysql = require('mysql');
let consultaBd = require('../consultasBd');


let modificarPerfil = (req,res)=>{
    let id_usuario = req.params.id;
    let correo = req.body.correo;
    let telefono = req.body.telefono;
    let sql = `UPDATE usuarios SET telefono= '${telefono}', correo = '${correo}' WHERE id_usuario= ${id_usuario} `;
    consultaBd.actualizar(sql,(result)=>{
        if(result != false){
            res.status(200).send({message:[{'flag':'true'}]});
        }else{
            res.status(200).send({message:[{'flag':'false'}]});
        }
    })
}


module.exports = {
    modificarPerfil
}
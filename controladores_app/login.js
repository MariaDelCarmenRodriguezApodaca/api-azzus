const mysql = require('mysql');
const moment = require('moment');
const config = require('../config');
const dbConnection = config.connection;



//localhost:3000/login/
function login(req,res){
    var usuario = req.body.usuario; 
    var password = req.body.password;
    var correo = usuario.indexOf("@");
    var sql = "";
    if(correo != -1){
        //console.log('es correo');
        sql = `SELECT id_usuario,nombre, ap,am,correo, telefono,password,estatus FROM usuarios WHERE correo = '${usuario}'`;
    }else{
        //console.log('es telefono');
        sql = `SELECT id_usuario,nombre, ap,am,correo, telefono,password,estatus FROM usuarios WHERE telefono = '${usuario}'`;
    }
    var connection = dbConnection();
    connection.query(sql,(err,result,fields)=>{
        if(err)  res.status(500).send({'codigo':'501','cuerpo':`Error en la base de datos: ${err}`});
        if(result == "")  res.status(404).send({'codigo':'404','cuerpo':`No existe el usuario`});
        if (result !="" && !err){
            var objUsuario =result[0];
            if(objUsuario.password == password){
                //console.log(result)
                res.status(200).send({'codigo':'200','cuerpo':result});
            }else{
                res.status(500).send({'codigo':'500','cuerpo':[`Contraseña Incorrecta`]});
            };
        }
        connection.destroy();
    });

};


module.exports = {
    login
}
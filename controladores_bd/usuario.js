'use strict'

/**NOTAS:
 * estus disponibles para usuarios:
 * alta:alta
 * baja:baja
 */


const mysql = require('mysql');
const moment = require('moment');
const config = require('../config');
const dbConnection = config.connection;


function getUsers(req, res) {
    var connection  = dbConnection();    
    connection.query("SELECT * FROM usuarios", function(err, result, fields) {
        if (err) return res.status(500).send({ message: `Error al realizar la consulta : ${err}` });
        if (result == "") return res.status(404).send({ message: `El usuario no existe` });
        res.status(200).send({ message: result });
        connection.destroy();
    });
};



function getUserXId(req, res) {
    var connection  = dbConnection(); 
    connection.query("SELECT * FROM usuarios WHERE id_usuario=" + req.params.userId, function(err, result, fields) {
        if (err) return res.status(500).send({ message: `Error al realizar la consulta : ${err}` });
        if (result == "") return res.status('404').send({ message: `El usuario no existe` });
        res.status(200).send({ message: result });
        connection.destroy();
    });
};

function getUserXIdSinFoto(req, res) {
    var connection  = dbConnection(); 
    connection.query("SELECT id_usuario,nombre, ap,am,correo, telefono,password,estatus FROM usuarios WHERE id_usuario=" + req.params.userId, function(err, result, fields) {
        if (err) return res.status(500).send({ message: `Error al realizar la consulta : ${err}` });
        if (result == "") return res.status(404).send({ message: `El usuario no existe` });
        res.status(200).send({ message: result });
        connection.destroy();
    });

};

function getUserXTel(req, res) {
    var connection  = dbConnection(); 
    connection.query("SELECT * FROM usuarios WHERE telefono=" + req.params.userTel, function(err, result, fields) {
        if (err) return res.status(500).send({ message: `Error al realizar la consulta : ${err}` });
        if (result == "") return res.status(404).send({ message: `El usuario no existe` });
        res.status(200).send({ message: result });
        connection.destroy();
    });
};

function getUserXCorreo(req, res) {
    var connection  = dbConnection(); 
    var correo = "'" + req.params.userCorreo + "'"
    connection.query("SELECT * FROM usuarios WHERE correo=" + correo, function(err, result, fields) {
        if (err) return res.status(500).send({ message: `Error al realizar la consulta : ${err}` });
        if (result == "") return res.status(404).send({ message: `El usuario no existe` });
        res.status(200).send({ message: result });
        connection.destroy();
    })
};


function saveUser(req, res) {
    if (!req.body.nombre|| req.body.nombre=="" || req.body.nombre == "" || !req.body.ap || req.body.ap == "" || !req.body.am || req.body.am == "" || !req.body.genero || req.body.genero == "" || !req.body.correo || req.body.correo == "" || !req.body.telefono || req.body.telefono == "") {
        return res.status(500).send({ message: `No se enviaron todos los campos` });
    };
    var connection  = dbConnection(); 
    var fechaRegistro = moment().format("YYYY-MM-DD HH:mm:ss");
    var sql = `INSERT INTO usuarios (id_usuario,nombre, ap, am, genero, correo, telefono, fecha_registro, estatus, password) VALUES (NULL,"${req.body.nombre}","${req.body.ap}","${req.body.am}","${req.body.genero}","${req.body.correo}","${req.body.telefono}","${fechaRegistro}","activo","${req.body.password}")`;
    connection.query(sql, function(err, result) {
        if (err) {
            console.log(err);
            return res.status(500).send({ message: `Error al aguardar el usuario` });
        }
        if (result == "") return res.status(404).send({ message: `Error al guardar el usuario` });
        res.status(200).send({ message: `Guardado` });
        connection.destroy();
    });
};

function updateUser(req, res) {
    /**NOTA
     * url formato: http://localhost:3000/update/:tipoidentificador/:identificador/:tipodato/
     * url ejemplo: http://localhost:3000/users/update/id_usuario/telefono
     * 
     * en el body se enviaran los siguientes datos: 
     * identificador : identificador
     * dato: dato
     * ejemplo en caso de telefono
     * dato : 6681831886
     * ejemplo correo : 
     * identificador : 2
     * dato = coore@correo.com
     * 
     * datos probados para modificar :telefono, correo, avatar
     */
    var tipoIdentificador = req.params.tipoidentificador;
    var identificador = req.body.identificador;
    var tipodato = req.params.tipodato;
    var dato = req.body.dato;
    var correo = "" + dato + "";
    var connection  = dbConnection(); 
    var sql = `UPDATE usuarios SET ${tipodato} = '${correo}' WHERE ${tipoIdentificador} = ${identificador}`;
    connection.query(sql, function(err, result) {
        if (err) return res.status(500).send({ message: `Error al actualizar el dato : ${err} ###sql = ${sql}` });
        console.log(result.affectedRows + " record(s) updated");
        res.status(200).send({ message: result });
        connection.destroy();
    });

};

function deleteUser() {

};

function comprimirimg(img){

}






module.exports = {
    getUsers,
    getUserXId,
    getUserXTel,
    getUserXCorreo,
    saveUser,
    updateUser,
    deleteUser,
    getUserXIdSinFoto
}
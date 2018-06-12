    'use strict'
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql');
const morgan = require('morgan');  //para ver las peticiones por consola
//ruta de las configuraciones globales
const config = require('./config'); 

//midlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); //para enterder los datos que envian los clientes en formato json
app.use(morgan('dev')); //que utilice morgan en su configuracion de desarrollo

//rutas de la base de datos
const rutasUsuario = require('./rutas_bd/usuario'); //rutas de los usuario
const rutasTipoServicios = require('./rutas_bd/servicio'); //rutas de tipos de servicios
const rutasTipoQuejas = require('./rutas_bd/tipoqueja'); //rutas de tipos de quejas
const rutasComplains = require('./rutas_bd/queja'); //rutas de quejas
const rutasRequests = require('./rutas_bd/solicitud'); //ruta de solicitudes
//------------------rutas para la la solicitud------------------------------lado del solicitante
const rutasSolicitudPendiente = require('./rutas_app/solicitud');
const rutaNuevaSolicitud=""; //falta
const rutaLogin = require('./rutas_app/login'); 
//-----------------ruta para pruebas----------------------------------------
const rutapruebas = require('./rutas_app/pruebas');



//incluir controladores de tutas para app:
app.use('/users', rutasUsuario); //localhost:3000/users/all <-- ejemplo
app.use('/typecomplains', rutasTipoQuejas); //localhost:3000/typecomplains/all <-- ejemplo
app.use('/services', rutasTipoServicios); //localhost:3000/services/all <-- ejemplo
app.use('/complains', rutasComplains); //localhost:3000/complains/all <-- ejemplo
app.use('/requests',rutasRequests) //localhost:3000/requests/all <-- ejemplo


//rutas de la aplicacion
app.use('/solicitud',rutasSolicitudPendiente);
app.use('/login/login',rutaLogin);
app.use('/pruebas',rutapruebas);
//------------------ruta para la solicitud----------------------------------lado del operador

//exportamos todas las configuraciones de la app
module.exports = app;
'use strict'
const moment = require('moment');
const request = require('request');
// let basicas = require('../basicas');
const consultaBd = require('../consultasBd');
//TABLA DE OPERADORES ACTIVOS 
let operadores = []; 
//TABLA DE SOLICITUDES 
let solicitudes=[]; 
//TABLA DE SOLICITUDES RECHAZADAS: idSolicitante:2, idOperador:1
let arregloSolicitudRechazada=[];
let operadoresAdecuador=[];
operadores.push({id: "id", lat: "lat", lng:"lng",estatus:"estatus"});

let buscarOperador = (id) => {
    var flag;
    for(var i = operadores.length ; i>0 ; i--){

        if(operadores[i-1].id == id){
            flag= true;
            break;
        }else{
            flag=false;
        }
    }
    return {flag:flag,i:i};//regregsa la posicion de una solicitud en la tabla
}

function buscarSolicitud(id){
    var i;
    var solicitud;
    for(i=solicitudes.length; i > 0 ; i--){
        if(solicitudes[i-1].id_solicitante==id){
            solicitud=solicitudes[i-1];
            return i-1;
        }
    }
    return i-1;
}
function buscarSolicitudXOperador(id){
    var i;
    var solicitud;
    for(i=solicitudes.length; i > 0 ; i--){
        if(solicitudes[i-1].operador==id){
            solicitud=solicitudes[i-1];
            return i-1;
        }
    }
    return i-1;
}
function buscarSolicitudPendiente(){
    if (solicitudes.length > 0){
        var flag = solicitudes.length;
        var encontrada = false;
        var i;
        for(i = 0; i < flag ; i++){ //recorremos la tabla de solicitudes
            if(solicitudes[i].estatus=='pendiente'){ //si hay una pendiente
                encontrada = true;
                break;
            }
        }
    }
    if (encontrada == true){
        return({flag:true,pos:i}); //returnamos su posicion
    }else{
        return({flag:false,pos:null});    
    }
}
function verificarRechazo(id){
    var flag = false;
    var pos = 0;
    if (arregloSolicitudRechazada.length > 0 ){
        var tam = arregloSolicitudRechazada.length;
        for(var i = tam-1; i>=0; i-- ){
            if(arregloSolicitudRechazada[i].idOperador == id){
                flag=true;
            }
            pos+=1;
        }
    }
    return {flag:flag,pos:pos};
}
//returna la distancia entre dos puntos
 function calcularDistancia(lat1,lng1,lat2,lng2){
    //https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=25.7502756,-108.9813402&destinations=25.7646791,-108.987061&key=AIzaSyBtWTMHlkpHzWZ943bH9yK5N3e78VgB8Gs
    var url = "https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins="+lat1+","+
                lng1+"&destinations="+lat2+","+lng2+"&key=AIzaSyBtWTMHlkpHzWZ943bH9yK5N3e78VgB8Gs";
    var headers = {
        'User-Agent':'Super Agent/0.0.1',
        'Content-Type':'application/x-www-form-urlencoded'
    }
    var options = {
        url     : url,
        method  : 'GET',
        jar     : true,
        headers : headers
    }
    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
        var res = JSON.parse(body);
        console.log(res.rows[0].elements[0].distance.value);
            return (res.rows[0].elements[0].distance.value);
        }
    });
}

function buscarOperadorPorFiltros(id_solicitante){
    if(operadores.length>1){
        var rechazada, encontrado;
        let row = buscarSolicitud(id_solicitante);
        let id_servicio = solicitudes[row].id_servicio;
        let sql = `SELECT * FROM servicioxusuario WHERE id_servicio = ${id_servicio}`;
        
        console.log('sql: ',sql);
        
        
        consultaBd.consultaBd(sql,(result)=>{ 
            if(result!=false){
                for(var i= 0; i < result.length; i++){
                    var activo = buscarOperador(result[i].id_usuario);
                    if(activo.flag){
                        let idOperadorSeleccionado = operadores[activo.i-1];
                        encontrado = operadores[activo.i-1].id;
                        rechazada = verificarRechazo(encontrado).flag;
                        if(encontrado != "" && rechazada == false){
                            console.log(`operador encontrado: ${ encontrado }`);
                            sql =`SELECT  id_usuario,nombre, ap, am,correo, telefono,password,estatus FROM usuarios WHERE id_usuario = ${encontrado}`;
                            if( solicitudes[row].hombre == 'true' ){ 
                                sql += ` AND genero = 'H'`;
                                console.log('sql: ',sql);
                            }else if( solicitudes[row].mujer == 'true' ){
                                sql += ` AND genero = 'M'`;
                                console.log('sql: ',sql);
                            }
                            consultaBd.consultaBd(sql,(result)=>{
                                if(result != false){
                                    solicitudes[row].operador = result[0].id_usuario;
                                    solicitudes[row].estatus = "pendiente";
                                    console.log(solicitudes[row]);
                                }else
                                console.log('Aun no hay operadores activos');
                            })           
                        }
                    }
                }
            } 
        }) 
    }else{
        console.log('Aun no hay operadores activos');
    }
}

//cuando un solicitante manda solicitud
function nuevaSolicitud(req,res){
    //agarramos todos lo datos
    let id_solicitante = req.body.id_user, lat = req.body.lat, lng = req.body.lng,valoracion = req.body.valoracion,
    mayorCosto = req.body.mayorCosto,menorCosto = req.body.menorCosto,hombre = req.body.hombre,
    mujer = req.body.mujer,conTransporte = req.body.conTransporte,idServicio = req.body.id_servicio,
    fecha = req.body.fecha,hora = req.body.hora, descripcion=req.body.descripcion, nombreServicio = req.body.nombre_servicio;
    
    

    
    let sql = `SELECT * FROM usuarios WHERE id_usuario= ${id_solicitante}`;
    consultaBd.consultaBd(sql,(result)=>{
        if(result) {
            //console.log(result);
            let nombreSolicitante = result[0].nombre + " " + result[0].ap + " " + result[0].am ;  
            let telefono = result[0].telefono;
            let correo = result[0].correo;
            let genero = result[0].genero;
            //guardamos la solicitud en la tabla en ram:
            solicitudes.push({id_servicio :idServicio,  servicio: nombreServicio,   id_solicitante:id_solicitante,
                                nombre:nombreSolicitante,   telefono: telefono,   correo:correo,
                                fecha:fecha,    hora: hora,   lat:lat,    
                                lng:lng,    costo:"",   estatus:"pendiente",
                                operador:"",   valoracion:valoracion,   mayorCosto:mayorCosto,
                                menorCosto:menorCosto,  hombre:hombre,  mujer:mujer,
                                conTransporte:conTransporte, descripcion:descripcion, generoSolicitante:genero
                            }); 
            res.status(200).send({ message: `Nueva solicitud enviada de : ${ nombreSolicitante }` });
        }

    });
}
//res servidor a solicitante /EL SERVIDOR RESPONDE A SOLICITANTES DESPUES DE MANDAR SOLICITUD
function responderSolicitudASolicitante(req,res){
    let id_solicitante = req.params.id;
    let solicitud= buscarSolicitud(id_solicitante); //verificamos si la aceptaron
    if(solicitudes[solicitud].estatus=='aceptada' && solicitudes[solicitud].operador != ''){
        console.log(`PRUEBA: si la aceptaron`);
        let id_operador=solicitudes[solicitud].operador;
        let lat = solicitudes[solicitud].latOperador;
        let lng = solicitudes[solicitud].lngOperador;
        let id_servicio = solicitudes[solicitud].id_servicio;
        let data = {};
        
        let sql = `Select * FROM usuarios WHERE id_usuario = ${ id_operador }`; 
        consultaBd.consultaBd(sql,(result)=>{
            if(result){
                console.log(`PRUEBA: si la aceptaron 2`);
                data.nombreOperador = result[0].nombre + " " + result[0].ap + " " + result[0].am ;
                data.telefonoOperador = result[0].telefono;
                
            }
        })
        sql = `SELECT * FROM servicio WHERE id_servicio = ${id_servicio}`;
        consultaBd.consultaBd(sql,(result)=>{
            if(result){
                console.log(`PRUEBA: si la aceptaron 3`);
                    data.servicio=result[0].descripcion;
                    data.costoMax = result[0].costo_max;
                    data.costoMin=  result[0].costo_min;
                    data.lat = lat;
                    data.lng = lng;
                    res.status(200).send({message:[{'flag':'true','cuerpo':[data]}]});
            }
        })                  
    
    }else if(solicitudes[solicitud].estatus=='pendiente'){
        buscarOperadorPorFiltros(solicitudes[solicitud].id_solicitante); //si aun no la aceptan se busca al operador de nuevo
        res.status(200).send({message:[{'flag':'false','cuerpo':[{'nombre':'estatus pendiente'}]}]});
        //console.log(solicitudes[solicitud]);
    }else if(solicitudes[solicitud].estatus=='enEspera'){
        res.status(200).send({message:[{'flag':'false','cuerpo':[{'nombre':'Esperando respuesta de operador'}]}]});
    }else{
        res.status(200).send({message:[{'flag':'false','cuerpo':[{'nombre':'buscando operador'}]}]});
    }
}

//comunicacion con el operador /   EL SERVIDOR ESCUCHAR OPERADORES
function escucharOperadores(req,res){
    let id_operador = req.params.id, lat_operador = req.params.lat, lng_operador = req.params.lng;
    let flag=buscarOperador(id_operador) 
    //ver si el operador esta en linea para actualizar lat y lng o agregarlo al arreglo
    if(flag.flag==true){
        operadores[flag.i-1].lat=lat_operador;
        operadores[flag.i-1].lng=lng_operador;
    }else{
        operadores.push({id:id_operador,lat:lat_operador,lng:lng_operador});
    }
    let operadorOcupado = false;
    let pos;
    for(let i=0; i< solicitudes.length; i++){
        var rechazada = verificarRechazo(id_operador);
        if(rechazada.flag == false){//verificamos si alguien rechazo la solicitud
            if(solicitudes[i].operador == id_operador && solicitudes[i].estatus=='pendiente'){
                let solicitud= buscarSolicitud(solicitudes[i].id_solicitante);
                if(solicitudes[solicitud].estatus=='pendiente'){
                    solicitudes[solicitud].estatus='enEspera';
                }
                operadorOcupado=true;
                pos = i;
            }
        }
    }
    if(operadorOcupado==true){
        res.status(200).send({message:[{'flag':'true','cuerpo':[solicitudes[pos]]}]});
    }else{
        res.status(200).send({message:[{'flag':'false','cuerpo':[]}]});
    }   
    
}
//cuando un operador se desconecta
function operadorDesactivado(req,res){
    var id_operador = req.params.id; 
    var flag=buscarOperador(id_operador);
    if(flag.flag==true){
        operadores.splice(flag.i-1,1);
        res.status(200).send({message:[{'flag':'guardada','se guardo solicitud en la base de datos':[]}]});
        console.log('Operador desconectado...Tabla Operadores Actualizada: ');
        console.log(operadores);
        res.status(200).send({message:['Estado: Desconectado']})
    }else{
        res.status(404).send({message:['Error: No se encontro el operador']})
    }
}


//cuando el operador acepta lamsolicitud: *
function operadorAceptoSolicitud(req,res){
    let id_operador= req.params.id, id_solicitante = req.params.id_solicitante;
    let solicitud = buscarSolicitud(id_solicitante);
    let flag=buscarOperador(id_operador);


    solicitudes[solicitud].estatus='aceptada';
    solicitudes[solicitud].operador= id_operador;
    solicitudes[solicitud].latOperador = operadores[flag.i-1].lat;
    solicitudes[solicitud].lngOperador = operadores[flag.i-1].lng;

    console.log('SOLICITUD AGENDADA:',solicitudes[solicitud]);

   //AQUI VA LA FECHA POR EJEMPLO
   var date = new Date();
   var fechaActual = moment(date).format('YYYY-MM-DD');
   console.log(` fechas ${ fechaActual } == ${solicitudes[solicitud].fecha}`);
   if(fechaActual < solicitudes[solicitud].fecha ){
       //aqui se guardara
       console.log(`se guardardo en base de datos solicitud agendada`);
       let sql = `INSERT INTO solicitud 
                (id_solicitud, id_solicitante, id_operador, id_servicio, fecha, hora, lat_inicio, lng_inicio, lat_fin, lng_fin, costo, estatus) 
                VALUES 
                ('NULL', 
                '${solicitudes[solicitud].id_solicitante}',
                '${id_operador}',
                '${solicitudes[solicitud].id_servicio}', 
                '${solicitudes[solicitud].fecha}', 
                '${solicitudes[solicitud].hora}', 
                '${operadores[flag.i-1].lat}', 
                '${operadores[flag.i-1].lng}', 
                '${solicitudes[solicitud].lat}', 
                '${solicitudes[solicitud].lng}', 
                '100', 
                'AGENDADA'
                )`;
       consultaBd.insertar(sql,(result)=>{
            if(result){
                console.log('se guardo en la base de datos solicitud agendada');
                res.status(200).send({message:[{'flag':'guardado','cuerpo':[]}]});
                solicitudes.splice(solicitud,1);
            }
       })
   }else{
        //buscamos al solicitante en la base de datos
        
        console.log(`solicitud de : ${ solicitudes[solicitud].id_solicitante } fue ${ solicitudes[solicitud].estatus }
        por el operador: ${ id_operador }`);
        //buscamos la lat y lng del operador para agregarlos al row de la solicitud en el arreglo
        let flag=buscarOperador(id_operador);
        solicitudes[solicitud].latOperador = operadores[flag.i-1].lat;
        solicitudes[solicitud].lngOperador = operadores[flag.i-1].lng;
        if(flag.flag){//verificamos que el operador este en el arreglo
            operadores.splice(flag.i-1,1);
            let rechazada = verificarRechazo(id_operador);
            if(rechazada.flag){//verificamos si alguien rechazo la solicitud
                arregloSolicitudRechazada.splice(rechazada.pos,1); //la eliminamos del arreglo de rechazadas
            }
            res.status(200).send({message:['Estado: Desconectado']})
        }else{
            res.status(404).send({message:['Error: No se encontro el operador']})
        }
   }
}
//cuando el operador rechaza una solicitud
function operadorRechazoSolicitud(req,res){
    console.log('rechazo solicitud');
    let id_operador= req.params.id, id_solicitante = req.params.id_solicitante;
    let solicitud = buscarSolicitud(id_solicitante);
    solicitudes[solicitud].estatus='pendiente';
    arregloSolicitudRechazada.push({idSolicitante:id_solicitante,idOperador:id_operador});
    console.log(`El operador ${ arregloSolicitudRechazada[0].idSolicitante } rechazo la solicitud de ${ id_solicitante }`);
    res.status(200).send({message:['Mamon']});
}

let solicitudTerminada = ( req,res ) => {
    let id_operador = req.params.idOperador;
    let id_solicitante = req.params.idSolicitante;
    let solicitud = buscarSolicitud(id_solicitante);
    //let flag=buscarOperador(id_operador);

    console.log('solicitud terminada: ',solicitudes[solicitud]);
    let sql = `INSERT INTO solicitud 
                (id_solicitud, id_solicitante, id_operador, id_servicio, fecha, hora, lat_inicio, lng_inicio, lat_fin, lng_fin, costo, estatus) 
                VALUES 
                ('NULL', 
                '${solicitudes[solicitud].id_solicitante}',
                '${id_operador}',
                '${solicitudes[solicitud].id_servicio}', 
                '${solicitudes[solicitud].fecha}', 
                '${solicitudes[solicitud].hora}', 
                '${solicitudes[solicitud].latOperador}', 
                '${solicitudes[solicitud].lngOperador}', 
                '${solicitudes[solicitud].lat}', 
                '${solicitudes[solicitud].lng}', 
                '100', 
                'TERMINADO'
                )`;
       consultaBd.insertar(sql,(result)=>{
            if(result){
                console.log('se guardo en la base de datos solicitud terminada');
                res.status(200).send({message:[{'flag':'guardado','cuerpo':[]}]});
                solicitudes.splice(solicitud,1);
            }
       })
}


module.exports={
    escucharOperadores,
    nuevaSolicitud,
    responderSolicitudASolicitante,
    operadorDesactivado,
    operadorAceptoSolicitud,
    operadorRechazoSolicitud,
    solicitudTerminada
};
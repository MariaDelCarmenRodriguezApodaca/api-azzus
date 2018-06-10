'use strict'

function limpiarPantalla(){
    var lines = process.stdout.getWindowSize()[1];
        for(var i = 0; i < lines; i++) {
            console.log('\r\n');
        }
    return;
}


module.exports = {
    limpiarPantalla
}
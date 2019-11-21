const mysql = require('mysql');
const {promisify} = require('util');
const {database} = require('./keys');

const pool = mysql.createPool(database);
pool.getConnection((error, conexion) =>{
    if (error){
        if (error.code === 'PROTOCOL_CONNECTION_LOST'){
            console.error('la conexion con la base de datos fue cerrada');
        }
        else if(error.code === 'ER_CON_COUNT_ERROR'){
            console.error('MAXIMO DE CONEXIONES PERMITIDO AGOTADO');
        }
        else if(error.code === 'ECONNREFUSED'){
            console.error('CONEXION RECHAZADA A LA BASE DE DATOS');
        }
    }

    if (conexion) conexion.release();
    console.log('conexion exitosa a la base de datos');

    return;

});

pool.query = promisify(pool.query);

module.exports = pool;

/*============================[Modulos]============================*/

import minimist from 'minimist'
import CustomError from '../../../classes/CustomError.class.js'
import logger from '../../../config/loggers.js'


/*----------- Minimist -----------*/

let options = { alias: { d: "db" }, default: { d: "Mongo" } }
let args = minimist(process.argv.slice(2), options)

const dbElegida = args.db



/*----------- DAOS -----------*/

let productosDao
let carritosDao
let mensajesDao
let ordenesDao


switch (dbElegida) {

    case 'Mongo':
        const { default: ProductosDaoMongoDb } = await import('./productos/ProductosDaoMongoDb.js')
        const { default: CarritosDaoMongoDb } = await import('./carritos/CarritosDaoMongoDb.js')
        const { default: MensajesDaoMongoDb } = await import('./mensajes/MensajesDaoMongoDb.js')
        const { default: OrdenesDaoMongoDb } = await import('./ordenes/OrdenesDaoMongoDb.js')

        productosDao = new ProductosDaoMongoDb()
        carritosDao = new CarritosDaoMongoDb()
        mensajesDao = new MensajesDaoMongoDb()
        ordenesDao = new OrdenesDaoMongoDb()

        break
    default:
        const cuserr = new CustomError(500, 'Base de datos no encontrada', error);
        logger.error(cuserr);
        throw cuserr;
}

export default {productosDao, carritosDao, mensajesDao, ordenesDao}
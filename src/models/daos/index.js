/*----------- Minimist -----------*/
import minimist from 'minimist'

let options = { alias: { d: "db" }, default: { d: "Mongo" } }
let args = minimist(process.argv.slice(2), options)

const dbElegida = args.db



/*----------- DAOS -----------*/

let productosDao
let carritosDao


switch (dbElegida) {

    case 'Mongo':
        const { default: ProductosDaoMongoDb } = await import('./productos/ProductosDaoMongoDb.js')
        const { default: CarritosDaoMongoDb } = await import('./carritos/CarritosDaoMongoDb.js')

        productosDao = new ProductosDaoMongoDb()
        carritosDao = new CarritosDaoMongoDb()
        
        break
    default:
        console.log("Base de datos no encontrada")
        break
}

export default {productosDao, carritosDao}
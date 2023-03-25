import productosDao from "../models/daos/index.js"
import { createdFakeProducts } from "../mocks/productos-fake.js"


import CustomError from "../../classes/CustomError.class.js"
import logger from "../../config/loggers.js"


export const productosDB = productosDao.productosDao

const getProductosController = async (req, res)=>{
    try {
        productosDB.listarAll().then((productos)=>{
            res.json(productos)

            //Para cuando haya una vista ->
            // res.render('productos-disponibles', { contador: req.user.contador, datos: datosUsuario })
        })
    } catch (error) {
        const cuserr = new CustomError(500, 'Error al listarAll()', error);
        logger.error(cuserr);
        throw cuserr;
    }
}


const getProductosControllerById = async (req,res)=>{
    try {

        let id = req.params.id

        productosDB.listarProducto(id).then((producto)=>{
            res.json(producto)
        })

    } catch (error) {
        const cuserr = new CustomError(500, 'Error al listarbyId()', error);
        logger.error(cuserr);
        throw cuserr;
    }
}

const postProductosController = async (req,res)=>{
    try {
        
        const {title, price, thumbnail, stock} = req.body

        const newProduct = {
            title: title,
            price: price,
            thumbnail: thumbnail,
            stock: stock
        }

        productosDB.guardar(newProduct)
        res.send("Producto subido correctamente")

    } catch (error) {
        const cuserr = new CustomError(500, 'Error al guardar', error);
        logger.error(cuserr);
        throw cuserr;
    }
}

const updateProductosController = async (req,res)=>{
    try {
        let id = req.params.id
        
        const {title, price, thumbnail, stock} = req.body

        const newProduct = {
            title: title,
            price: price,
            thumbnail: thumbnail,
            stock: stock
        }

        productosDB.actualizarProducto(id, newProduct)
        res.send("Producto actualizado correctamente")

    } catch (error) {
        const cuserr = new CustomError(500, 'Error al actualizar:', error);
        logger.error(cuserr);
        throw cuserr;
    }
}

const deleteProductosController = async (req,res)=>{
    try {

        let id = req.params.id
        productosDB.borrarProducto(id)
        res.send("Producto eliminado correctamente")

    } catch (error) {
        const cuserr = new CustomError(500, 'Error al borrar', error);
        logger.error(cuserr);
        throw cuserr;
    }
}

const fakeProductosController = async (req,res)=>{
    try {
        res.json(createdFakeProducts(10))
    } catch (error) {
        const cuserr = new CustomError(500, 'Error al crear productos con Faker', error)
        logger.error(cuserr);
        throw cuserr;
    }
}













export {
    getProductosController,
    getProductosControllerById,
    postProductosController,
    updateProductosController,
    deleteProductosController,
    fakeProductosController
}


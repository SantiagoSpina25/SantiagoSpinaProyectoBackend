
/*============================[Modulos]============================*/

import productosDao from "../models/daos/index.js"
import { createdFakeProducts } from "../mocks/productos-fake.js"

import CustomError from "../../classes/CustomError.class.js"
import logger from "../../config/loggers.js"


export const productosDB = productosDao.productosDao

const getProductosController = async (req, res)=>{
    try {
        productosDB.listarAll().then((productos)=>{
            
            const datosUsuario = {
                nombre: req.user.username,
                email: req.user.email,
                edad: req.user.edad,
                telefono: req.user.telefono,
                adress: req.user.adress,
                foto: req.user.foto,
                carritoId: req.user.carrito
            }

            res.render('productos-disponibles', { productos: productos, datos: datosUsuario})
        })
    } catch (error) {
        const cuserr = new CustomError(500, 'Error al listarAll()', error);
        logger.error(cuserr);
        res.json(cuserr)
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
        res.json(cuserr)
    }
}

const postProductosController = async (req,res)=>{
    try {
        
        const {title, price, thumbnail, category} = req.body

        const newProduct = {
            title: title,
            price: price,
            thumbnail: thumbnail,
            category: category
        }

        productosDB.guardar(newProduct)
        res.send("Producto subido correctamente")

    } catch (error) {
        const cuserr = new CustomError(500, 'Error al guardar', error);
        logger.error(cuserr);
        res.json(cuserr)
    }
}

const updateProductosController = async (req,res)=>{
    try {
        let id = req.params.id
        
        const {title, price, thumbnail, category} = req.body

        const newProduct = {
            title: title,
            price: price,
            thumbnail: thumbnail,
            category: category
        }

        productosDB.actualizarProducto(id, newProduct)
        res.send("Producto actualizado correctamente")

    } catch (error) {
        const cuserr = new CustomError(500, 'Error al actualizar:', error);
        logger.error(cuserr);
        res.json(cuserr)
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
        res.json(cuserr)
    }
}

const fakeProductosController = async (req,res)=>{
    try {
        res.json(createdFakeProducts(10))
    } catch (error) {
        const cuserr = new CustomError(500, 'Error al crear productos con Faker', error)
        logger.error(cuserr);
        res.json(cuserr)
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


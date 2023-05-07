
/*============================[Modulos]============================*/

import carritosDao from "../models/daos/index.js"
import { productosDB } from '../controllers/productosController.js';
import CustomError from "../../classes/CustomError.class.js";
import logger from "../../config/loggers.js";


export const carritosDB = carritosDao.carritosDao


const getCarritosController = async (req,res)=>{
    try {
        carritosDB.listarAll().then((carritos)=>{
            res.json(carritos)
        })
    } catch (error) {
        const cuserr = new CustomError(500, 'Error al listarAll()', error);
        logger.error(cuserr);
        res.json(cuserr);
    }
}


const getCarritosControllerById = async (req,res)=>{
    try {

        const datosUsuario = {
            nombre: req.user.username,
            email: req.user.email,
            edad: req.user.edad,
            telefono: req.user.telefono,
            adress: req.user.adress,
            foto: req.user.foto,
            carritoId: req.user.carrito
        }


        const carrito = await carritosDB.listarCarrito(datosUsuario.carritoId).then((carrito)=>{
            const carritoEncontrado = carrito.find(carrito => carrito._id == datosUsuario.carritoId)
            return carritoEncontrado
        })
    
        
        res.render("carrito", {datos: datosUsuario, carrito: carrito})



    } catch (error) {
        const cuserr = new CustomError(500, 'Error al listarbyId()', error);
        logger.error(cuserr);
        res.json(cuserr);
    }
}

const postCarritosController = async (req,res)=>{
    try {
        const {email, timestamp, products, adress} = req.body
    
        const newCart = {
            email: email,
            timestamp: timestamp,
            products: products,
            adress: adress
        }
    
        carritosDB.guardar(newCart)
        res.send("Carrito subido correctamente")

    } catch (error) {
        const cuserr = new CustomError(500, 'Error al guardar', error);
        logger.error(cuserr);
        res.json(cuserr);
    }
}

const putCarritosController = async (req,res)=>{
    try {

        let id = req.params.id
        
        const {email, timestamp, products, adress} = req.body
    
        const newCart = {
            email: email,
            timestamp: timestamp,
            products: products,
            adress: adress
        }

        carritosDB.actualizarCarrito(id, newCart)

        res.send("Carrito actualizado correctamente")
    } catch (error) {
        const cuserr = new CustomError(500, 'Error al actualizar:', error);
        logger.error(cuserr);
        res.json(cuserr);
    }
}


const deleteCarritosController = async (req,res)=>{
    try {
        let id = req.params.id
        carritosDB.borrarCarrito(id)
        res.send("Carrito eliminado correctamente")
    } catch (error) {
        const cuserr = new CustomError(500, 'Error al borrar', error);
        logger.error(cuserr);
        res.json(cuserr);
    }
}

const getProductosCarritoControllerById = async (req,res)=>{
    try {
       
        let id = req.params.id

        const carrito = await carritosDB.listarCarrito(id).then((carrito)=>{
            const carritoEncontrado = carrito.find(carrito => carrito._id == id)
            return carritoEncontrado
        })

        const carritoReal = carrito._doc
        const carritoConProductos = carritoReal.products

        res.json(carritoConProductos)

    } catch (error) {
        const cuserr = new CustomError(500, 'Error al listarbyId()', error);
        logger.error(cuserr);
        res.json(cuserr);
    }
}

const postProductosACarritoController = async (req,res)=>{
    try {
        let prod_id = req.body.id

        const productos = await productosDB.listarProducto(prod_id).then((producto)=>{
            const productoEncontrado = producto.find(producto => producto._id == prod_id)
            return productoEncontrado
        })

        
        let id = req.params.id

        const carrito = await carritosDB.listarCarrito(id).then((carrito)=>{
            const carritoEncontrado = carrito.find(carrito => carrito._id == id)
            return carritoEncontrado
        })
        const carritoReal = carrito._doc

        const carritoConProductos = carritoReal.products.push(productos)

        const newCart = {...carritoReal, carritoConProductos}
        carritosDB.actualizarCarrito(id, newCart)

        res.send("Producto subido al carrito correctamente")
    } catch (error) {
        const cuserr = new CustomError(500, 'Error al guardar', error);
        logger.error(cuserr);
        res.json(cuserr);
    }
}

const deleteProductoCarritoController = async (req,res)=>{
    try {
        let prod_id = req.params.prod_id

        let id = req.params.id
    
        const carrito = await carritosDB.listarCarrito(id).then((carrito)=>{
            const carritoEncontrado = carrito.find(carrito => carrito._id == id)
            return carritoEncontrado
        })
    
        const carritoReal = carrito._doc
        const carritoConProductos = carritoReal.products
    
        const index = carritoConProductos.findIndex(prod => prod._id == prod_id)
    
        const carritoConProductoEliminado = carritoConProductos.splice(index, 1)
    
        const newCart = {...carritoReal, carritoConProductoEliminado}
        carritosDB.actualizarCarrito(id, newCart)
    
        res.send("Producto borrado del carrito correctamente")
    
    } catch (error) {
        const cuserr = new CustomError(500, 'Error al borrar', error);
        logger.error(cuserr);
        res.json(cuserr);
    }
}

export {
    getCarritosController,
    getCarritosControllerById, 
    postCarritosController, 
    putCarritosController, 
    deleteCarritosController, 
    getProductosCarritoControllerById, 
    postProductosACarritoController, 
    deleteProductoCarritoController
}
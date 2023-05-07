
/*============================[Modulos]============================*/

import { Router } from 'express'

import { 
    getCarritosController,
    getCarritosControllerById, 
    postCarritosController, 
    putCarritosController, 
    deleteCarritosController, 
    getProductosCarritoControllerById, 
    postProductosACarritoController, 
    deleteProductoCarritoController
} from '../controllers/carritosController.js';

import { isAuth } from '../../server.js';


const carritosRouter = new Router()


/*============================[Rutas]============================*/


//Obtener todos los carritos

carritosRouter.get("/", getCarritosController)


//Obtener un carrito por su ID

carritosRouter.get("/:id", isAuth, getCarritosControllerById)


//Subir un carrito

carritosRouter.post("/", postCarritosController)


//Actualizar un carrito por su ID

carritosRouter.put("/:id", putCarritosController)


//Borrar un carrito por su ID

carritosRouter.delete("/:id", deleteCarritosController)


//Obtener los productos de un carrito por su ID 

carritosRouter.get('/:id/productos', getProductosCarritoControllerById)


//Subir productos a un carrito

carritosRouter.post('/:id', postProductosACarritoController)


//Eliminar producto de un carrito

carritosRouter.delete('/:id/productos/:prod_id', deleteProductoCarritoController)


export default carritosRouter
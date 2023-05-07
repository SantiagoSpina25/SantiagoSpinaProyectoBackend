
/*============================[Modulos]============================*/

import { Router } from 'express'
import { getProductosController, getProductosControllerById, postProductosController, updateProductosController, deleteProductosController} from '../controllers/productosController.js'
import { isAuth } from '../../server.js'


const productosRouter = new Router()


//Obtener todos los productos

productosRouter.get("/", isAuth, getProductosController)


//Obtener un producto por su ID

productosRouter.get("/:id", getProductosControllerById)


//Obtener un producto por su categoria

productosRouter.get("/:category", getProductosControllerById)


//Subir un producto

productosRouter.post("/", postProductosController)



//Actualizar un producto por su ID

productosRouter.put("/:id", updateProductosController)


//Borrar un producto por su ID

productosRouter.delete("/:id", deleteProductosController)


export default productosRouter
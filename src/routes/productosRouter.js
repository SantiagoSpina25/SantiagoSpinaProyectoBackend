import { Router } from 'express'
import { getProductosController, getProductosControllerById, postProductosController, updateProductosController, deleteProductosController} from '../controllers/productosController.js'


const productosRouter = new Router()


//Obtener todos los productos

productosRouter.get("/", getProductosController)


//Obtener un producto por su ID

productosRouter.get("/:id", getProductosControllerById)


//Subir un producto

productosRouter.post("/", postProductosController)



//Actualizar un producto por su ID

productosRouter.put("/:id", updateProductosController)


//Borrar un producto por su ID

productosRouter.delete("/:id", deleteProductosController)


export default productosRouter
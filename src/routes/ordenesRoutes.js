
/*============================[Modulos]============================*/

import { Router } from 'express'
import { getOrdenesController, getOrdenesControllerById, postOrdenesController, updateOrdenesController, deleteOrdenesController} from '../controllers/ordenesController.js'


const ordenesRouter = new Router()


//Obtener todos las ordenes

ordenesRouter.get("/", getOrdenesController)


//Obtener una orden por su ID 

ordenesRouter.get("/:id", getOrdenesControllerById)

//Subir una orden

ordenesRouter.post("/", postOrdenesController)

//Actualizar una orden

ordenesRouter.put("/:id", updateOrdenesController)

//Borrar una orden

ordenesRouter.delete("/:id", deleteOrdenesController)


export default ordenesRouter
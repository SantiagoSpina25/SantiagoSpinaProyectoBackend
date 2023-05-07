
/*============================[Modulos]============================*/

import { Router } from 'express'
import { getMensajesController, getMensajesControllerByEmail, postMensajesController, deleteMensajesController} from '../controllers/mensajesController.js'
import { isAuth } from '../../server.js'

const mensajesRouter = new Router()


//Obtener todos los mensajes

mensajesRouter.get("/", isAuth, getMensajesController)


//Obtener un mensaje por su ID 

mensajesRouter.get("/:email", getMensajesControllerByEmail)

//Subir un mensaje

mensajesRouter.post("/", postMensajesController)

//Borrar un mensaje

mensajesRouter.delete("/:id", deleteMensajesController)


export default mensajesRouter
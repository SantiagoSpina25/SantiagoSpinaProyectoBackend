
/*============================[Modulos]============================*/

import { Router } from 'express'
import { fakeProductosController } from '../controllers/productosController.js'


const productosFake = new Router()


//Productos generados con faker

productosFake.get('/', fakeProductosController)

export default productosFake
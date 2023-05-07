
/*============================[Modulos]============================*/

import CustomError from "../../../../classes/CustomError.class.js";
import logger from "../../../../config/loggers.js";
import ContenedorMongoDb from "../../containers/ContenedorMongoDb.js"

class OrdenesDaoMongoDb extends ContenedorMongoDb {

    constructor() {
        super("ordenes", {
            items: { type: Array, required: true },
            orderNumber: { type: Number, required: true },
            date: { type: Number, required: true },
            state: { type: String, required: true },
            email: { type: String, required: true }
        })
    }

    async listarOrdenById(id){
        const readItem = await this.coleccion.find({ "_id": id })
        if (readItem.length == 0){
            const cuserr = new CustomError(500, 'No se encontró la orden', "error");
            logger.error(cuserr);
            throw cuserr;
        }
        else{
            return readItem
        }
    }
    
    async actualizarOrden(id, newOrder){
        const {items, orderNumber, date, state, email} = newOrder

        const updateOrder = await this.coleccion.replaceOne({"_id": id},{items: items,orderNumber: orderNumber,date: date,state: state, email: email })
        return updateOrder
    }

    async borrarOrden(id){
        await this.coleccion.deleteOne({ "_id": id })
    }
    
}

export default OrdenesDaoMongoDb
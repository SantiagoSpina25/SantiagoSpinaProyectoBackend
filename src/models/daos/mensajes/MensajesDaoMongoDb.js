
/*============================[Modulos]============================*/

import CustomError from "../../../../classes/CustomError.class.js";
import logger from "../../../../config/loggers.js";
import ContenedorMongoDb from "../../containers/ContenedorMongoDb.js"

class MensajesDaoMongoDb extends ContenedorMongoDb {

    constructor() {
        super("mensajes", {
            email: { type: String, required: true },
            type: { type: String, required: true },
            date: { type: Number, required: true },
            message: { type: String, required: true }
        })
    }

    async listarMensajeByEmail(email){
        const readItem = await this.coleccion.find({ "email": email })
        if (readItem.length == 0){
            const cuserr = new CustomError(500, 'No se encontró el mail', "error");
            logger.error(cuserr);
            throw cuserr;
        }
        else{
            return readItem
        }
    }
    
    async actualizarMensaje(id, newMsj){
        const {email, type, date, message} = newMsj

        const updateMessage = await this.coleccion.replaceOne({"_id": id},{email: email,type: type,date: date,message: message})
        return updateMessage
    }

    async borrarMensaje(id){
        await this.coleccion.deleteOne({ "_id": id })
    }
    
}

export default MensajesDaoMongoDb
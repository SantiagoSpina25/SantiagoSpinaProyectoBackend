
/*============================[Modulos]============================*/

import CustomError from "../../../../classes/CustomError.class.js";
import logger from "../../../../config/loggers.js";
import ContenedorMongoDb from "../../containers/ContenedorMongoDb.js"

class ProductosDaoMongoDb extends ContenedorMongoDb {

    constructor() {
        super("productos", {
            title: { type: String, required: true },
            price: { type: Number, required: true },
            thumbnail: { type: String, required: false },
            category: { type: String, required: true }
        })
    }

    async listarProducto(id){
        try {
            const readItem = await this.coleccion.find({ "_id": id })
            if (readItem.length == 0){
                const cuserr = new CustomError(500, 'No se encontró el id:', id);
                logger.error(cuserr);
                return cuserr;
            }
            else{
                return readItem
            }
        } catch (error) {
            const readItemCategory = await this.coleccion.find({ "category": id })
            if (readItemCategory.length == 0){
                const cuserr = new CustomError(500, 'No se encontró la categoria:', id);
                logger.error(cuserr);
                return cuserr;
            }
            else{
                return readItemCategory
            }
        }
        
    }

    async actualizarProducto(id, newProduct){
        const {title, price, thumbnail, category} = newProduct

        const updateProduct = await this.coleccion.replaceOne({"_id": id},{title: title,price: price,thumbnail: thumbnail,category: category})
        return updateProduct
    }

    async borrarProducto(id){
        await this.coleccion.deleteOne({ "_id": id })
    }
    
}

export default ProductosDaoMongoDb
import mongoose from "mongoose";
import config from "../../config.js"

mongoose.set("strictQuery", false);

mongoose.connect(config.mongodb.cnxStr, config.mongodb.options)

class ContenedorMongoDb {

    constructor(nombreColeccion, esquema) {
        this.coleccion = mongoose.model(nombreColeccion, esquema)
    }

    async listar(username) {
        const readItem = await this.coleccion.find({ "username": username })
        return readItem
    }

    async listarItem(id){
        const readItem = await this.coleccion.find({ "_id": id })
        if (readItem.length == 0){
            throw new Error('No se encontro el producto/carrito')
        }
        else{
            return readItem
        }
    }


    async listarAll() {
        const readItems = await this.coleccion.find()
        return readItems
    }

    async guardar(nuevoItem) {
        const saveItem = this.coleccion(nuevoItem)
        await saveItem.save()
    }

    async actualizar(username, newItem) {
        const {newUsername, password, email, edad, telefono, foto} = newItem

        const updateItem = await this.coleccion.replaceOne({"username": username}, {username: newUsername,password: password,email: email,edad: edad, telefono: telefono, foto: foto})
        return updateItem
    }

    async actualizarProducto(id, newProduct){
        const {title, price, thumbnail, stock} = newProduct

        const updateProduct = await this.coleccion.replaceOne({"_id": id},{title: title,price: price,thumbnail: thumbnail,stock: stock})
        return updateProduct
    }

    async actualizarCarrito(id, newCart){
        const {productos} = newCart

        const updateCart = await this.coleccion.replaceOne({"_id": id},{productos: productos})
        return updateCart
    }

    async borrar(username) {
        await this.coleccion.deleteOne({"username": username})
    }

    async borrarItem(id){
        await this.coleccion.deleteOne({ "_id": id })
    }

}

export default ContenedorMongoDb

import { Router } from 'express'
import { createdFakeProducts } from "../mocks/productos-fake.js"
import ContenedorMongoDb from "../contenedores/ContenedorMongoDb.js"

export const productosDB = new ContenedorMongoDb("productos", {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    thumbnail: { type: String, required: false },
    stock: { type: Number, required: true }
})


const productosRouter = new Router()


//Obtener todos los productos
productosRouter.get("/", (req,res) => {
    try {
        productosDB.listarAll().then((productos)=>{

            res.json(productos)

            // res.render('productos-disponibles', { contador: req.user.contador, datos: datosUsuario })
        })
    } catch (error) {
        res.send(`Error: ${error}`)
    }
})

//Obtener un producto por su ID
productosRouter.get("/:id", (req,res) => {
    try {

        let id = req.params.id
    
        productosDB.listarItem(id).then((producto)=>{
            res.json(producto)
        })

    } catch (error) {
        res.send(`Error: ${error}`)
    }
})

//Subir un producto
productosRouter.post("/", (req,res) => {
    try {
        const {title, price, thumbnail, stock} = req.body
    
        const newProduct = {
            title: title,
            price: price,
            thumbnail: thumbnail,
            stock: stock
        }
    
        productosDB.guardar(newProduct)
        res.send("Producto subido correctamente")
    } catch (error) {
        res.send(`Error: ${error}`)
    }
})

//Actualizar un producto por su ID
productosRouter.put("/:id", (req,res) => {
    try {

        let id = req.params.id
        
        const {title, price, thumbnail, stock} = req.body

        const newProduct = {
            title: title,
            price: price,
            thumbnail: thumbnail,
            stock: stock
        }

        productosDB.actualizarProducto(id, newProduct)
        res.send("Producto actualizado correctamente")
    } catch (error) {
        res.send(`Error: ${error}`)
    }
})


//Borrar un producto por su ID
productosRouter.delete("/:id", (req,res) => {
    try {
        let id = req.params.id
        productosDB.borrarItem(id)
        res.send("Producto eliminado correctamente")
    } catch (error) {
        res.send(`Error: ${error}`)
    }
})


//Productos generados con faker
productosRouter.get('/fake', (req, res) => { 
    try {
        res.json(createdFakeProducts(10))
    } catch (error) {
        res.send(`Error: ${error}`)
    }
})

export default productosRouter
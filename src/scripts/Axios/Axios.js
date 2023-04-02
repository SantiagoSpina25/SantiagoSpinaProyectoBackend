import axios from "axios";


/*============================[GET]============================*/

async function obtenerInfo(){
    const res = await axios.get(`http://localhost:8080/productos`, {
        baseURL: `http://localhost:8080`,
        headers: {
            'Content-Type':'application/json'
        }
    });
    return res.data;
}

// const get = await obtenerInfo()
// console.log(get)




/*============================[GET BY ID]============================*/

async function obtenerInfoConId(id){
    const res = await axios.get(`http://localhost:8080/productos/${id}`, {
        baseURL: `http://localhost:8080`,
        headers: {
            'Content-Type':'application/json'
        }
    });
    return res.data;
}


// const getById = await obtenerInfoConId("640e3c11e56ada42be963d25")
// console.log(getById)



/*============================[POST]============================*/

async function subirProducto(producto){
    await axios.post(`http://localhost:8080/productos`, producto);
    console.log("Producto subido con exito")
}


let productoEjemplo = {
    "title": "libro 5",
    "price": 40,
    "thumbnail": "url",
    "stock": 5
}

// subirProducto(productoEjemplo)



/*============================[PUT]============================*/

async function actualizarProducto(id, producto){
    await axios.put(`http://localhost:8080/productos/${id}`, producto);
    console.log("Producto actualizado con exito")
}

// actualizarProducto("6429896abadfa214d7ac05e6", productoEjemplo)



/*============================[DELETE]============================*/

async function borrarProducto(id){
    await axios.delete(`http://localhost:8080/productos/${id}`);
    console.log("Producto borrado con exito")
}

// borrarProducto("6429896abadfa214d7ac05e6")

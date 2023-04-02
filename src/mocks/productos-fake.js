import faker from "faker"
faker.locale = 'es'

function createdFakeProducts(n) {
    const productos = []
    for (let i = 1; i <= n; i++) {
        const prod = createFakeProduct(i)
        productos.push(prod)
    }
    return productos
}

function createFakeProduct(id) {
    const prod = {
        title: faker.commerce.product(),
        price: faker.commerce.price(),
        thumbnail: `url`,
        stock: Math.round(Math.random()*30)
    }
    return prod
}

export {
    createFakeProduct,
    createdFakeProducts
}
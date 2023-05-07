
/*============================[Modulos]============================*/

import bcrypt from 'bcrypt'



// Metodos de Auth con Bcrypt
async function generateHashPassword(password) {
    const hashPassword = await bcrypt.hash(password, 10)
    return hashPassword
}

async function verifyPass(userPassword, password) {
    const match = await bcrypt.compare(password, userPassword)
    return match
}


export {generateHashPassword, verifyPass}
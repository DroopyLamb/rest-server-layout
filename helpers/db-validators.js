// Importación modelo Rol
const Role = require('../models/rol');
// Importación modelo Usuario
const Usuario = require('../models/usuario');
//------------------------------------------------

const esRolValido = async(rol = '') => {
    const existeRol = await Role.findOne({ rol });

    if (!existeRol) {
        throw new Error(`El rol ${ rol } no está registrado en la base de datos`);
    }
}

const emailExiste = async(correo = '') => {
    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El correo: ${correo} ya está registrado`);
    }
}


const exiteUsuarioPorId = async(id) => {
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario) throw new Error(`El Usuario con ${id} no existe`);
}

module.exports = {
    esRolValido,
    emailExiste,
    exiteUsuarioPorId
}
const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');




const validarJWT = async(req = request, res = response, next) => {

    // Tomamos el token de los headers
    const token = req.header('x-token'); // Nombre del token 

    // Verificamos que venga el token
    if (!token) {
        return res.status(404).json({
            msg: 'No hay token en la petición'
        });
    }

    // Si el usuario envió el header
    try {

        // Verificamos que el JWT sea válido
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        // creamos una propiedad nueva en el objeto request
        // y le añadimos el id
        req.uid = uid;

        // Traer los datos del usuario
        const usuario = await Usuario.findById(uid);

        // Verifica que el usuario exista en la base de datos
        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe en DB'
            });
        }

        // Verificar que el estado sea true
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no válido - usuario con estado false'
            });
        }

        req.usuario = usuario;


        next();


    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido'
        });
    }
}


module.exports = {
    validarJWT
}
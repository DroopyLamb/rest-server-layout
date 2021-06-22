const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');



const login = async(req, res) => {
    const { correo, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ correo });

        // verificar si el email existe

        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            });
        }

        // verificar si el usuario está activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - estado : false'
            });
        }
        // verificar contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }

        // Generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });
    } catch (error) {

        console.log(error);
        res.status(500).json({
            msg: 'Algo salío mal, hable con el administrador'
        });
    }

}


const googleSigin = async(req, res = response) => {
    // Recibimos token desde el frontend
    const { id_token } = req.body;

    // Manejo de errores
    try {
        // Importación y utilización del helper google-verify.js
        const { correo, nombre, img } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ correo });


        if (!usuario) {
            // Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: '1234',
                img,
                google: true
            };
            // Subir usuario
            usuario = new Usuario(data);
            await usuario.save();

        }

        // Si el usuario en Base de datos y tiene estado false (usuario borrado)
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar JWT
        const token = await generarJWT(usuario.id);
        // respuesta al front-end
        res.json({
            usuario,
            token
        });

    } catch (error) { // Manejo del error
        console.log(error);
        res.status(400).json({
            msg: 'Token de Google no es válido'
        })
    }
}

module.exports = {
    login,
    googleSigin

}
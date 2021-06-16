const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');


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


module.exports = {
    login
}
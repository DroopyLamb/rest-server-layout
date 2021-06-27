const { response } = require('express');

const esAdminRole = (req, res = response, next) => {

    // Validar que en req, esté el objeto usuario
    if (!req.usuario) {
        return res.status(500).json({
            msg: 'Se requiere verificar el role sin validar el token primero'
        });
    }

    const { rol, nombre } = req.usuario;

    if (rol !== 'ADMIN_ROLE') {
        return res.status(404).json({
            msg: `${ nombre } no es administrador - No puede realizar esta operación`
        });
    }


    next();
}

// Capturamos todos los roles
const tieneRole = (...roles) => {

    // Retornamos una funcion tipo middleware
    return (req, res, next) => {

        // Validar que en req, esté el objeto usuario
        if (!req.usuario) {
            return res.status(500).json({
                msg: 'Se requiere verificar el role sin validar el token primero'
            });
        }

        // Validar todos los roles
        if (!roles.includes(req.usuario.rol)) {
            res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${ roles }`
            });
        }

        next();
    }

}


module.exports = {
    esAdminRole,
    tieneRole
}
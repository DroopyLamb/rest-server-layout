// Importaciones que requiere nuestro middleware para funcionar
// Solo y exclusivamente para este middleware si no lo requiriera
// no es obligatorio poner la importación.
const { validationResult } = require('express-validator');

// Lógica del middleware
const validarCampos = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }

    next();
}

module.exports = {
    validarCampos
}
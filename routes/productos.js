// Rutas
const { Router } = require('express');
const { check } = require('express-validator');
const {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
} = require('../controllers/productos');

const {
    existeProductoPorId,
    existeCategoriaPorId
} = require('../helpers/db-validators');
const { validarCampos, validarJWT, tieneRole } = require('../middlewares');

const router = Router();

router.get('/', obtenerProductos);

router.get('/:id', [
    check('id', 'No es un id de Mongo').isMongoId(),
    check('id', ).custom(existeProductoPorId),
    validarCampos,
], obtenerProducto);

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es Obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de Mongo').isMongoId(),
    check('categoria', ).custom(existeCategoriaPorId),
    validarCampos
], crearProducto);

router.put('/:id', [
    validarJWT,
    check('id', 'No es un id válido').isMongoId(),
    tieneRole('ADMIN_ROLE'),
    validarCampos,
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto);

router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'No es un id válido de mongo').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], borrarProducto);


module.exports = router;
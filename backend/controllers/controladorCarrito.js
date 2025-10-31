// Rutas para carrito (acceso cliente: agregar, listar, checkout)
const express = require('express');
const router = express.Router();
const daoCarrito = require('../daos/DaoCarrito');

router.post('/', async (req, res) => {
  try {
    const { idUsuario = 1, idProducto, cantidad } = req.body;  // Usuario demo 1
    const carrito = await daoCarrito.agregar(idUsuario, idProducto, cantidad);
    res.json({ mensaje: 'Item agregado al carrito', data: carrito });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:idUsuario', async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const items = await daoCarrito.obtenerPorUsuario(idUsuario);
    const total = daoCarrito.calcularTotal(items);
    res.json({ mensaje: 'Carrito obtenido', data: items, total });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

router.post('/:idUsuario/checkout', async (req, res) => {
  try {
    const { idUsuario } = req.params;
    const resultado = await daoCarrito.checkout(idUsuario);
    res.json(resultado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
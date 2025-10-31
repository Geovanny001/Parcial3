// Controlador de rutas para pedidos (endpoints REST)
const express = require('express');
const router = express.Router();
const daoPedido = require('../daos/DaoPedido');

// POST /pedidos – Crear pedido con pago
router.post('/', async (req, res) => {
  try {
    const { idProducto, cantidad } = req.body;
    const pedido = await daoPedido.crear(idProducto, cantidad);
    res.status(201).json({ mensaje: 'Pedido creado y pagado exitosamente', data: pedido });
  } catch (err) {
    res.status(400).json({ error: err.message });  // Error en pago o stock
  }
});

// GET /pedidos – Lista todos
router.get('/', async (req, res) => {
  const pedidos = await daoPedido.obtenerTodos();
  res.json({ mensaje: 'Lista de pedidos', data: pedidos });
});

module.exports = router;
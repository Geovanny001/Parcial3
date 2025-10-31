// Controlador de productos para cliente (solo lectura: GET)
const express = require('express');
const router = express.Router();
const daoProducto = require('../daos/DaoProducto');

// GET /productos – Lista todos los productos (para frontend cliente)
router.get('/', async (req, res) => {
  try {
    const productos = await daoProducto.obtenerTodos();
    res.json({ 
      mensaje: 'Lista de productos obtenida', 
      data: productos  // Array para frontend (e.g., map en React)
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos: ' + err.message });
  }
});

// GET /productos/:id – Detalle de un producto (para frontend detalle)
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const producto = await daoProducto.obtenerPorId(id);
    res.json({ 
      mensaje: 'Producto encontrado', 
      data: producto  // Objeto para frontend
    });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

module.exports = router;
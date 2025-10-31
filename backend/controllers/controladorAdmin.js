// Controlador para admin (CRUD productos + ver pedidos)
const express = require('express');
const router = express.Router();
const daoProducto = require('../daos/DaoProducto');
const daoPedido = require('../daos/DaoPedido');

// POST /admin/productos – Crear producto (admin)
router.post('/productos', async (req, res) => {
  try {
    const { nombre, precio, inventario } = req.body;
    const producto = await daoProducto.crear(nombre, precio, inventario);
    res.status(201).json({ 
      mensaje: 'Producto creado exitosamente', 
      data: producto  // Para mostrar en frontend admin
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /admin/productos/:id/inventario – Actualizar inventario (admin)
router.put('/productos/:id/inventario', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { cantidad } = req.body;
    const producto = await daoProducto.actualizarInventario(id, cantidad);
    res.json({ 
      mensaje: 'Inventario actualizado', 
      data: producto 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /admin/productos/:id – Eliminar producto (admin)
router.delete('/productos/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await daoProducto.eliminar(id);
    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// GET /admin/pedidos – Ver todos los pedidos (admin)
router.get('/pedidos', async (req, res) => {
  try {
    const pedidos = await daoPedido.obtenerTodos();
    res.json({ 
      mensaje: 'Lista de pedidos para admin', 
      data: pedidos  // Array con include Producto para frontend
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener pedidos: ' + err.message });
  }
});

module.exports = router;
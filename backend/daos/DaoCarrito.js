// DAO para Carrito (CRUD con caché Redis)
const Carrito = require('../models/Carrito');
const { redisClient } = require('../db');
const daoPedido = require('./DaoPedido');

class DaoCarrito {
  async agregar(idUsuario, idProducto, cantidad = 1) {
    if (cantidad < 1) throw new Error('Cantidad debe ser al menos 1');
    
    let item = await Carrito.findOne({ where: { idUsuario, idProducto } });
    if (item) {
      item.cantidad += cantidad;
      await item.save();
    } else {
      await Carrito.create({ idUsuario, idProducto, cantidad });
    }
    await this._invalidarCache(idUsuario);
    return await this.obtenerPorUsuario(idUsuario);
  }

  async obtenerPorUsuario(idUsuario) {
    const claveCache = `carrito:usuario:${idUsuario}`;
    let cacheado = await redisClient.get(claveCache);
    if (cacheado) {
      console.log('📦 Carrito de caché Redis');
      return JSON.parse(cacheado);
    }

    const items = await Carrito.findAll({ where: { idUsuario }, include: ['Producto'] });
    const serializado = JSON.stringify(items.map(i => ({
      id: i.id, idProducto: i.idProducto, nombre: i.Producto.nombre,
      precio: parseFloat(i.Producto.precio), cantidad: i.cantidad,
      subtotal: parseFloat(i.Producto.precio) * i.cantidad
    })));
    await redisClient.set(claveCache, serializado, { EX: 300 });
    return items;
  }

  calcularTotal(items) {
    return items.reduce((total, i) => total + (parseFloat(i.Producto.precio) * i.cantidad), 0);
  }

  async vaciar(idUsuario) {
    await Carrito.destroy({ where: { idUsuario } });
    await this._invalidarCache(idUsuario);
    return { mensaje: 'Carrito vaciado' };
  }

  async checkout(idUsuario) {
    const items = await this.obtenerPorUsuario(idUsuario);
    if (items.length === 0) throw new Error('Carrito vacío');

    let totalGeneral = 0;
    for (const item of items) {
      await daoPedido.crear(item.idProducto, item.cantidad);
      totalGeneral += parseFloat(item.Producto.precio) * item.cantidad;
    }
    await this.vaciar(idUsuario);
    return { mensaje: 'Checkout exitoso', total: totalGeneral };
  }

  async _invalidarCache(idUsuario) {
    await redisClient.del(`carrito:usuario:${idUsuario}`);
    console.log('🗑️ Caché de carrito invalidado');
  }
}

module.exports = new DaoCarrito();
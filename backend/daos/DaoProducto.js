// DAO para Producto: Abstrae operaciones CRUD con caché en Redis
const Producto = require('../models/Producto');
const { redisClient } = require('../db');

class DaoProducto {
  // Crear un nuevo producto (valida entradas)
  async crear(nombre, precio, inventario) {
    if (precio < 0 || inventario < 0) {
      throw new Error('Precio e inventario deben ser no negativos');  // Manejo de error inválido
    }
    const producto = await Producto.create({ nombre, precio, inventario });
    await this._invalidarCache();  // Limpia caché al crear
    return producto;
  }

  // Obtener todos los productos (usa caché Redis)
  async obtenerTodos() {
    const claveCache = 'productos:todos';
    let cacheado = await redisClient.get(claveCache);
    if (cacheado) {
      console.log('📦 Datos de caché Redis');  // Log para demo
      return JSON.parse(cacheado);
    }

    const productos = await Producto.findAll();  // Query a MySQL
    const serializado = JSON.stringify(productos.map(p => ({
      id: p.id,
      nombre: p.nombre,
      precio: parseFloat(p.precio),
      inventario: p.inventario
    })));
    await redisClient.set(claveCache, serializado, { EX: 300 });  // Expira en 5 min
    return productos;
  }

  // Obtener producto por ID
  async obtenerPorId(id) {
    const producto = await Producto.findByPk(id);
    if (!producto) {
      throw new Error('Producto no encontrado');  // Error si no existe
    }
    return producto;
  }

  // Actualizar inventario (reduce stock)
  async actualizarInventario(id, cantidad) {
    const producto = await this.obtenerPorId(id);
    if (producto.inventario < cantidad) {
      throw new Error('Inventario insuficiente');  // Manejo de error
    }
    producto.inventario -= cantidad;
    await producto.save();  // Guarda en MySQL
    await this._invalidarCache();
    return producto;
  }

  // Eliminar producto
  async eliminar(id) {
    const producto = await this.obtenerPorId(id);
    await producto.destroy();  // Elimina de MySQL
    await this._invalidarCache();
    return true;
  }

  // Función interna: Invalida caché
  async _invalidarCache() {
    await redisClient.del('productos:todos');
    console.log('🗑️ Caché invalidado');
  }
}

module.exports = new DaoProducto();  // Instancia singleton
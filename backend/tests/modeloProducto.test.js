// Pruebas unitarias para el modelo Producto
const Producto = require('../models/Producto');
const { sequelize } = require('../db');

beforeAll(async () => { 
  await sequelize.sync({ force: true });  // Limpia DB para tests
});
afterAll(async () => { await sequelize.close(); });

describe('Modelo de Producto', () => {
  test('creación con entradas válidas', async () => {
    const producto = await Producto.create({ 
      nombre: 'Laptop Gamer', 
      precio: 1200.50, 
      inventario: 5 
    });
    expect(producto.nombre).toBe('Laptop Gamer');
    expect(producto.precio).toBe(1200.50);
    expect(producto.inventario).toBe(5);
  });

  test('manejo de errores: entradas inválidas (precio negativo)', async () => {
    await expect(
      Producto.create({ nombre: 'Teclado', precio: -10, inventario: 10 })
    ).rejects.toThrow('Validation error');  // Sequelize lanza error de validación
  });

  test('integridad de operaciones CRUD básicas', async () => {
    const prod = await Producto.create({ nombre: 'Mouse', precio: 20, inventario: 20 });
    const conteo = await Producto.count();
    expect(conteo).toBe(1);  // Creado OK
    await prod.destroy();
    const conteoDespues = await Producto.count();
    expect(conteoDespues).toBe(0);  // Eliminado OK
  });
});
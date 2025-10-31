// Pruebas unitarias para el DAO de Producto
const daoProducto = require('../daos/DaoProducto');
const { sequelize } = require('../db');

beforeAll(async () => { await sequelize.sync({ force: true }); });
afterAll(async () => { await sequelize.close(); });

describe('DAO de Producto', () => {
  test('crear con entradas válidas + obtenerTodos (operaciones CRUD)', async () => {
    const p1 = await daoProducto.crear('P1 Test', 10.00, 1);
    expect(p1.nombre).toBe('P1 Test');

    const todos = await daoProducto.obtenerTodos();
    expect(todos.length).toBe(1);
    expect(todos[0].precio).toBe(10.00);

    // Actualizar inventario
    const actualizado = await daoProducto.actualizarInventario(p1.id, 1);
    expect(actualizado.inventario).toBe(0);

    // Eliminar
    const eliminado = await daoProducto.eliminar(p1.id);
    expect(eliminado).toBe(true);
    const despues = await daoProducto.obtenerTodos();
    expect(despues.length).toBe(0);
  });

  test('manejo de errores: entradas inválidas y casos edge', async () => {
    // Crear inválido
    await expect(daoProducto.crear('Test Inválido', -5.00, 1)).rejects.toThrow('no negativos');

    // Inventario insuficiente
    const p = await daoProducto.crear('P Bajo', 10, 0);
    await expect(daoProducto.actualizarInventario(p.id, 1)).rejects.toThrow('Inventario insuficiente');

    // No encontrado
    await expect(daoProducto.obtenerPorId(999)).rejects.toThrow('Producto no encontrado');
  });
});
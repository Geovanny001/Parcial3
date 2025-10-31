// Modelo de Pedido usando Sequelize (entidad para tabla Pedidos)
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const Producto = require('./Producto');  // Asociación con Producto

const Pedido = sequelize.define('Pedido', {
  idProducto: { 
    type: DataTypes.INTEGER, 
    allowNull: false  // Referencia a Producto
  },
  cantidad: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    validate: { min: 1 }  // Mínimo 1 unidad
  },
  total: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false 
  },
  estado: { 
    type: DataTypes.STRING, 
    defaultValue: 'pendiente'  // Estados: pendiente, pagado, etc.
  }
}, {
  tableName: 'Pedidos',
  timestamps: false
});

// Asociaciones entre modelos (Pedido pertenece a Producto)
Pedido.belongsTo(Producto, { foreignKey: 'idProducto' });
Producto.hasMany(Pedido, { foreignKey: 'idProducto' });

module.exports = Pedido;
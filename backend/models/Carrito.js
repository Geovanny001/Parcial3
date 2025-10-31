// Modelo para Carrito (items por usuario)
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');
const Producto = require('./Producto');

const Carrito = sequelize.define('Carrito', {
  idUsuario: { type: DataTypes.INTEGER, allowNull: false },  // Usuario demo: 1
  idProducto: { type: DataTypes.INTEGER, allowNull: false },
  cantidad: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1, validate: { min: 1 } }
}, { tableName: 'Carritos', timestamps: false });

Carrito.belongsTo(Producto, { foreignKey: 'idProducto' });
Producto.hasMany(Carrito, { foreignKey: 'idProducto' });

module.exports = Carrito;
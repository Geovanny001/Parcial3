// Modelo de Producto usando Sequelize (entidad para tabla Productos)
const { DataTypes } = require('sequelize');
const { sequelize } = require('../db');  // Importa conexión DB

const Producto = sequelize.define('Producto', {
  nombre: { 
    type: DataTypes.STRING, 
    allowNull: false  // No puede ser nulo
  },
  precio: { 
    type: DataTypes.DECIMAL(10, 2), 
    allowNull: false, 
    validate: { min: 0 }  // Validación: precio >= 0, lanza error si inválido
  },
  inventario: { 
    type: DataTypes.INTEGER, 
    defaultValue: 0, 
    validate: { min: 0 }  // Validación: inventario >= 0
  }
}, {
  tableName: 'Productos',  // Nombre de tabla en MySQL
  timestamps: false  // Sin campos createdAt/updatedAt para simplicidad
});

module.exports = Producto;
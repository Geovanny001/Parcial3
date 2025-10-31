// Configuración de la base de datos MySQL con Sequelize y Redis para caché
const { Sequelize } = require('sequelize');
const Redis = require('redis');
require('dotenv').config();  // Carga variables de .env (DB_HOST, DB_USER, etc.)

// Crea instancia de Sequelize para conectar a MySQL (XAMPP local)
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,  // localhost por defecto
  dialect: 'mysql',           // Dialecto para MySQL
});

// Prueba la conexión a la DB (autenticación)
sequelize.authenticate()
  .then(() => console.log('🟢 Conexión a MySQL exitosa – Base de datos lista'))
  .catch(err => console.error('🔴 Error de conexión a MySQL:', err.message));

// Cliente Redis para caché (e.g., listas de productos)
const redisClient = Redis.createClient({ url: process.env.REDIS_URL });
redisClient.on('error', err => console.error('🔴 Error en Redis:', err.message));
redisClient.connect().then(() => console.log('🟢 Redis conectado para caché'));

// Exporta para usar en otros archivos
module.exports = { sequelize, redisClient };
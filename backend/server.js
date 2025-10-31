// Servidor principal Express para la API de E-commerce
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./db');  // Importa conexión DB (se conecta aquí)

// Requires de controladores
const controladorProducto = require('./controllers/controladorProducto');
const controladorPedido = require('./controllers/controladorPedido');
const controladorCarrito = require('./controllers/controladorCarrito');
const controladorAdmin = require('./controllers/controladorAdmin');

const app = express();
const PUERTO = process.env.PORT || 3001;  // Puerto de .env o default

// Middleware: CORS para frontend (incluye localhost y Vercel), JSON para body
app.use(cors({ origin: ['http://localhost:3000', 'https://*.vercel.app'] }));
app.use(express.json());

// Rutas para cliente (lectura productos + carrito + pedidos básicos)
app.use('/productos', controladorProducto);  // GET para cliente (lista y detalle)
app.use('/carrito', controladorCarrito);     // POST agregar, GET listar, POST checkout
app.use('/pedidos', controladorPedido);      // GET/POST pedidos (para cliente si necesitas)

// Rutas para admin (full CRUD productos + ver pedidos)
app.use('/admin', controladorAdmin);         // POST/PUT/DELETE /admin/productos, GET /admin/pedidos

// Endpoint de salud (verifica DB)
app.get('/salud', (req, res) => {
  res.json({ estado: 'OK', timestamp: new Date().toISOString(), db: 'Conectada' });
});

// Sincroniza tablas en MySQL y arranca servidor
sequelize.sync({ force: false })  // false: no borra datos existentes
  .then(() => {
    console.log('📊 Tablas sincronizadas en MySQL (incluyendo Carritos)');
    app.listen(PUERTO, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PUERTO}`);
      console.log(`🔍 Prueba: http://localhost:${PUERTO}/salud`);
      console.log(`🛒 Cliente: /productos (GET), /carrito (POST/GET/POST checkout)`);
      console.log(`⚙️ Admin: /admin/productos (POST/PUT/DELETE), /admin/pedidos (GET)`);
    });
  })
  .catch(err => console.error('🔴 Error al sincronizar DB:', err.message));
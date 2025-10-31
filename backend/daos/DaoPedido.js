// DAO para Pedido: Crea pedidos con pago Stripe y actualiza inventario
const Pedido = require('../models/Pedido');
const DaoProducto = require('./DaoProducto');
const stripe = require('stripe')(process.env.STRIPE_KEY);  // Clave de .env

class DaoPedido {
  // Crear pedido (integra pago y reduce stock)
  async crear(idProducto, cantidad) {
    const producto = await DaoProducto.obtenerPorId(idProducto);
    const total = parseFloat(producto.precio) * cantidad;

    // Integración con API de Stripe (mock con clave de prueba)
    try {
      const intencionPago = await stripe.paymentIntents.create({
        amount: Math.round(total * 100),  // Monto en centavos
        currency: 'usd',
      });
      if (intencionPago.status !== 'requires_confirmation') {
        throw new Error('Pago no confirmado');  // Error si falla
      }
      console.log('💳 Pago Stripe procesado exitosamente');
    } catch (err) {
      throw new Error(`Error en pago Stripe: ${err.message}`);  // Manejo de error
    }

    // Crea pedido en MySQL y actualiza inventario
    const pedido = await Pedido.create({ 
      idProducto, 
      cantidad, 
      total, 
      estado: 'pagado' 
    });
    await DaoProducto.actualizarInventario(idProducto, cantidad);
    return pedido;
  }

  // Obtener todos los pedidos (con info de producto)
  async obtenerTodos() {
    return await Pedido.findAll({ include: ['Producto'] });  // Join con MySQL
  }
}

module.exports = new DaoPedido();
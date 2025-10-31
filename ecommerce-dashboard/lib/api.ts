// lib/api.ts – Funciones para fetch al backend real (Node.js/Express)
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';  // Env para prod

// Types (matching backend)
export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  inventario: number;
}

export interface Pedido {
  id: number;
  idProducto: number;
  cantidad: number;
  total: number;
  estado: string;
  Producto?: Producto;  // Include opcional en GET
}

// Cliente: GET lista productos (ruta /productos)
export async function obtenerProductos(): Promise<Producto[]> {
  const res = await fetch(`${API_BASE}/productos`);
  if (!res.ok) throw new Error('Error al obtener productos');
  const data = await res.json();
  return data.data || [];  // Backend devuelve {mensaje, data: []}
}

// Cliente: GET detalle producto (opcional)
export async function obtenerProductoPorId(id: number): Promise<Producto> {
  const res = await fetch(`${API_BASE}/productos/${id}`);
  if (!res.ok) throw new Error('Producto no encontrado');
  const data = await res.json();
  return data.data;
}

// Admin: POST crear producto (/admin/productos)
export async function crearProducto(nombre: string, precio: number, inventario: number): Promise<Producto> {
  const res = await fetch(`${API_BASE}/admin/productos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, precio, inventario }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Error al crear producto');
  }
  const data = await res.json();
  return data.data;
}

// Admin: PUT actualizar inventario (/admin/productos/:id/inventario)
export async function actualizarProductoInventario(id: number, cantidad: number): Promise<Producto> {
  const res = await fetch(`${API_BASE}/admin/productos/${id}/inventario`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cantidad }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Error al actualizar inventario');
  }
  const data = await res.json();
  return data.data;
}

// Admin: DELETE eliminar producto (/admin/productos/:id)
export async function eliminarProducto(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/admin/productos/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Error al eliminar producto');
  }
}

// Admin: GET todos los pedidos (/admin/pedidos)
export async function obtenerTodosPedidos(): Promise<Pedido[]> {
  const res = await fetch(`${API_BASE}/admin/pedidos`);
  if (!res.ok) throw new Error('Error al obtener pedidos');
  const data = await res.json();
  return data.data || [];
}

// Carrito: POST agregar item (/carrito)
export async function agregarAlCarrito(idUsuario: number, idProducto: number, cantidad: number = 1): Promise<any[]> {
  const res = await fetch(`${API_BASE}/carrito`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idUsuario, idProducto, cantidad }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Error al agregar al carrito');
  }
  const data = await res.json();
  return data.data || [];
}

// Carrito: GET carrito por usuario (/carrito/:idUsuario)
export async function obtenerCarrito(idUsuario: number): Promise<{ items: any[]; total: number }> {
  const res = await fetch(`${API_BASE}/carrito/${idUsuario}`);
  if (!res.ok && res.status !== 404) {  // ← FIX: No throw en 404 (empty cart OK)
    const error = await res.json();
    throw new Error(error.error || 'Error al obtener carrito');
  }
  const data = await res.json() || { data: [], total: 0 };  // Fallback empty
  return { items: data.data || [], total: data.total || 0 };
}

// Carrito: POST checkout (/carrito/:idUsuario/checkout)
export async function checkoutCarrito(idUsuario: number): Promise<{ mensaje: string; total: number }> {
  const res = await fetch(`${API_BASE}/carrito/${idUsuario}/checkout`, { method: 'POST' });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || 'Error en checkout');
  }
  return await res.json();
}
const BASE_URL = 'http://localhost:3001';

async function handle(res) {
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { const j = await res.json(); if (j?.error) msg = j.error; } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export async function getProductos() {
  const res = await fetch(`${BASE_URL}/productos`);
  return handle(res);
}

export async function crearProducto(data) {
  const res = await fetch(`${BASE_URL}/productos`, {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify(data),
  });
  return handle(res);
}

export async function eliminarProducto(id) {
  const res = await fetch(`${BASE_URL}/items/${id}`, { method: 'DELETE' });
  return handle(res);
}

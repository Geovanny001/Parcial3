import { NextResponse } from "next/server"
import { getPedidos } from "@/lib/mock-data"

export async function GET() {
  try {
    const pedidos = getPedidos()
    return NextResponse.json(pedidos)
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener pedidos" }, { status: 500 })
  }
}

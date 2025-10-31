import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { PedidosTable } from "@/components/pedidos-table"
import { obtenerTodosPedidos } from "@/lib/api"

export default async function PedidosPage() {
  const pedidos = await obtenerTodosPedidos()

  return (
    <div className="dark min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6 space-y-6">
            <DashboardHeader />
            <PedidosTable pedidos={pedidos} />
          </div>
        </main>
      </div>
    </div>
  )
}

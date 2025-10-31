import { DashboardHeader } from "@/components/dashboard-header"
import { MetricsCards } from "@/components/metrics-cards"
import { RecentOrders } from "@/components/recent-orders"
import { Sidebar } from "@/components/sidebar"
import { obtenerTodosPedidos, obtenerProductos } from "@/lib/api"

export default async function DashboardPage() {
  const [pedidos, productos] = await Promise.all([obtenerTodosPedidos(), obtenerProductos()])

  return (
    <div className="dark min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6 space-y-6">
            <DashboardHeader />
            <MetricsCards pedidos={pedidos} productos={productos} />
            <RecentOrders pedidos={pedidos} />
          </div>
        </main>
      </div>
    </div>
  )
}

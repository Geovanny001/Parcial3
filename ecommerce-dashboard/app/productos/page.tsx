import { Sidebar } from "@/components/sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { ProductosTable } from "@/components/productos-table"
import { obtenerProductos } from "@/lib/api"

export default async function ProductosPage() {
  const productos = await obtenerProductos()

  return (
    <div className="dark min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6 space-y-6">
            <DashboardHeader />
            <ProductosTable productos={productos} />
          </div>
        </main>
      </div>
    </div>
  )
}

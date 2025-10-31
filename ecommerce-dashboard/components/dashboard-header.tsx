import { Bell, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function DashboardHeader() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Resumen de tu tienda en línea</p>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input type="search" placeholder="Buscar..." className="pl-9 bg-card border-border" />
        </div>
        <Button variant="outline" size="icon" className="bg-card border-border">
          <Bell className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

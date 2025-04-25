"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  BookOpen,
  FileQuestion,
  Layers,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Trophy,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

const adminRoutes = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Cursos",
    href: "/admin/cursos",
    icon: <BookOpen className="h-5 w-5" />,
  },
  {
    title: "Conjuntos",
    href: "/admin/conjuntos",
    icon: <Layers className="h-5 w-5" />,
  },
  {
    title: "Preguntas",
    href: "/admin/preguntas",
    icon: <FileQuestion className="h-5 w-5" />,
  },
  {
    title: "Usuarios",
    href: "/admin/usuarios",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Logros",
    href: "/admin/logros",
    icon: <Trophy className="h-5 w-5" />,
  },
  {
    title: "Foro",
    href: "/admin/foro",
    icon: <MessageSquare className="h-5 w-5" />,
  },
  {
    title: "Estadísticas",
    href: "/admin/estadisticas",
    icon: <BarChart3 className="h-5 w-5" />,
  },
  {
    title: "Configuración",
    href: "/admin/configuracion",
    icon: <Settings className="h-5 w-5" />,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden md:flex flex-col w-64 border-r bg-muted/40">
      <div className="p-6 border-b">
        <Link href="/admin" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Admin</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 py-4">
        <nav className="grid gap-1 px-2">
          {adminRoutes.map((route) => (
            <Button
              key={route.href}
              variant={pathname === route.href ? "secondary" : "ghost"}
              className={cn("justify-start gap-2", pathname === route.href ? "bg-secondary" : "")}
              asChild
            >
              <Link href={route.href}>
                {route.icon}
                {route.title}
              </Link>
            </Button>
          ))}
        </nav>
      </ScrollArea>
      <div className="p-4 border-t">
        <Button variant="outline" className="w-full justify-start gap-2" asChild>
          <Link href="/dashboard">
            <LayoutDashboard className="h-5 w-5" />
            Volver a UniLingo
          </Link>
        </Button>
      </div>
    </div>
  )
}

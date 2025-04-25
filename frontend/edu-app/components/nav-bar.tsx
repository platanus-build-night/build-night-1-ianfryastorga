"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import {
  BookOpenIcon,
  LayoutDashboardIcon,
  BarChartIcon,
  CalendarIcon,
  MessageSquareIcon,
  SettingsIcon,
  MenuIcon,
  XIcon,
  InfoIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StreakFlame } from "@/components/streak-flame"

// Enlaces de navegación
const navLinks = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboardIcon className="h-5 w-5" />,
  },
  {
    name: "Plan de Estudio",
    href: "/plan-estudio",
    icon: <CalendarIcon className="h-5 w-5" />,
  },
  {
    name: "Estadísticas",
    href: "/estadisticas",
    icon: <BarChartIcon className="h-5 w-5" />,
  },
  {
    name: "Foro",
    href: "/forum",
    icon: <MessageSquareIcon className="h-5 w-5" />,
  },
  {
    name: "Sobre la App",
    href: "/about",
    icon: <InfoIcon className="h-5 w-5" />,
  },
  {
    name: "Configuración",
    href: "/settings",
    icon: <SettingsIcon className="h-5 w-5" />,
  },
]

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Determinar si un enlace está activo
  const isActive = (path: string) => {
    if (path === "/dashboard" && pathname === "/dashboard") {
      return true
    }
    if (path !== "/dashboard" && pathname.startsWith(path)) {
      return true
    }
    return false
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          {/* Logo para móvil */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            <span className="sr-only">Menú</span>
          </Button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <BookOpenIcon className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl hidden sm:inline-block">UniLingo</span>
          </Link>

          {/* Navegación de escritorio */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Button
                key={link.href}
                variant={isActive(link.href) ? "secondary" : "ghost"}
                size="sm"
                asChild
                className="text-sm"
              >
                <Link href={link.href} className="flex items-center gap-1">
                  {link.icon}
                  {link.name}
                </Link>
              </Button>
            ))}
          </nav>
        </div>

        {/* Racha y Avatar */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <StreakFlame className="h-6 w-6 text-orange-500" />
            <span className="font-medium">12</span>
          </div>

          <Avatar>
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Usuario" />
            <AvatarFallback>US</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Menú móvil */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="flex flex-col p-2 bg-background">
            {navLinks.map((link) => (
              <Button
                key={link.href}
                variant={isActive(link.href) ? "secondary" : "ghost"}
                size="sm"
                asChild
                className="justify-start text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link href={link.href} className="flex items-center gap-2 py-2">
                  {link.icon}
                  {link.name}
                </Link>
              </Button>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

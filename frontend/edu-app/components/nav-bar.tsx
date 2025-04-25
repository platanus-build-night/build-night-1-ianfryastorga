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
  UserIcon,
  LogOutIcon,
  ShieldIcon,
  ChevronDownIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StreakFlame } from "@/components/streak-flame"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"

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
  const { user, isAuthenticated, logout } = useAuth()

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

  // Manejar el cierre de sesión
  const handleLogout = () => {
    logout()
  }

  // Obtener iniciales del usuario para el avatar
  const getUserInitials = () => {
    if (!user || !user.name) return "U"
    return user.name
      .split(" ")
      .map(word => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
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

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt={user?.name || "Usuario"} />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name || "Usuario"}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email || "usuario@ejemplo.com"}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/perfil" className="flex w-full cursor-pointer">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex w-full cursor-pointer">
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    <span>Configuración</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin" className="flex w-full cursor-pointer">
                    <ShieldIcon className="mr-2 h-4 w-4" />
                    <span>Panel de Administrador</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-500 cursor-pointer"
                >
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button size="sm" asChild>
              <Link href="/login">Iniciar Sesión</Link>
            </Button>
          )}
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
            <DropdownMenuSeparator className="my-2" />
            {isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="justify-start text-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link href="/admin" className="flex items-center gap-2 py-2">
                  <ShieldIcon className="h-5 w-5" />
                  Panel de Administrador
                </Link>
              </Button>
            )}
            {isAuthenticated ? (
              <Button
                variant="ghost"
                size="sm"
                className="justify-start text-sm text-red-500 hover:text-red-500"
                onClick={() => {
                  setMobileMenuOpen(false)
                  handleLogout()
                }}
              >
                <div className="flex items-center gap-2 py-2">
                  <LogOutIcon className="h-5 w-5" />
                  Cerrar sesión
                </div>
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                asChild
                className="justify-start text-sm mt-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Link href="/login" className="flex items-center gap-2 py-2">
                  <UserIcon className="h-5 w-5" />
                  Iniciar Sesión
                </Link>
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

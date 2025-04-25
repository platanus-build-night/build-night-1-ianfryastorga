"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronDown, Edit, Eye, MoreHorizontal, Plus, Search, Trash2, UserCog } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Datos de ejemplo para usuarios
const usersData = [
  {
    id: 1,
    name: "Ana García",
    email: "ana@ejemplo.com",
    role: "student",
    courses: 3,
    lastActive: "2023-05-25T14:30:00Z",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "Carlos Rodríguez",
    email: "carlos@ejemplo.com",
    role: "student",
    courses: 2,
    lastActive: "2023-05-24T10:15:00Z",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "María López",
    email: "maria@ejemplo.com",
    role: "teacher",
    courses: 1,
    lastActive: "2023-05-25T09:45:00Z",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "Juan Martínez",
    email: "juan@ejemplo.com",
    role: "student",
    courses: 4,
    lastActive: "2023-05-23T16:20:00Z",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "Laura Sánchez",
    email: "laura@ejemplo.com",
    role: "admin",
    courses: 0,
    lastActive: "2023-05-25T11:10:00Z",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 6,
    name: "Pedro Gómez",
    email: "pedro@ejemplo.com",
    role: "teacher",
    courses: 2,
    lastActive: "2023-05-22T13:40:00Z",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 7,
    name: "Sofía Fernández",
    email: "sofia@ejemplo.com",
    role: "student",
    courses: 5,
    lastActive: "2023-05-24T15:30:00Z",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "student",
    password: "",
  })
  const { toast } = useToast()

  // Filtrar usuarios según la búsqueda
  const filteredUsers = usersData.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Manejar cambio en select
  const handleSelectChange = (name: string, value: string) => {
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Manejar creación de usuario
  const handleCreateUser = () => {
    // Aquí iría la lógica para crear el usuario
    toast({
      title: "Usuario creado",
      description: `El usuario "${newUser.name}" ha sido creado correctamente.`,
      variant: "success",
    })
    setIsCreateDialogOpen(false)
    setNewUser({
      name: "",
      email: "",
      role: "student",
      password: "",
    })
  }

  // Manejar eliminación de usuario
  const handleDeleteUser = (userId: number, userName: string) => {
    // Aquí iría la lógica para eliminar el usuario
    toast({
      title: "Usuario eliminado",
      description: `El usuario "${userName}" ha sido eliminado correctamente.`,
      variant: "success",
    })
  }

  // Manejar cambio de rol
  const handleChangeRole = (userId: number, userName: string, newRole: string) => {
    // Aquí iría la lógica para cambiar el rol
    toast({
      title: "Rol actualizado",
      description: `El rol de "${userName}" ha sido actualizado a ${newRole}.`,
      variant: "success",
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Usuario
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Usuario</DialogTitle>
              <DialogDescription>Completa los detalles para crear un nuevo usuario.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre completo</Label>
                <Input
                  id="name"
                  name="name"
                  value={newUser.name}
                  onChange={handleInputChange}
                  placeholder="Ej: Ana García"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  placeholder="usuario@ejemplo.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Rol</Label>
                <Select value={newUser.role} onValueChange={(value) => handleSelectChange("role", value)}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Selecciona rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Estudiante</SelectItem>
                    <SelectItem value="teacher">Profesor</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateUser}>Crear Usuario</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Usuarios</CardTitle>
          <CardDescription>Gestiona los usuarios de la plataforma.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar usuarios..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  Filtrar
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Todos los usuarios</DropdownMenuItem>
                <DropdownMenuItem>Estudiantes</DropdownMenuItem>
                <DropdownMenuItem>Profesores</DropdownMenuItem>
                <DropdownMenuItem>Administradores</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Activos recientemente</DropdownMenuItem>
                <DropdownMenuItem>Inactivos</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Correo</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead className="text-center">Cursos</TableHead>
                  <TableHead>Última actividad</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{user.name}</div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          user.role === "admin"
                            ? "bg-primary/10 text-primary"
                            : user.role === "teacher"
                              ? "bg-green-100 text-green-700"
                              : "bg-muted"
                        }
                      >
                        {user.role === "admin" ? "Administrador" : user.role === "teacher" ? "Profesor" : "Estudiante"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{user.courses}</TableCell>
                    <TableCell>
                      {new Date(user.lastActive).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Acciones</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Ver perfil
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Cambiar rol</DropdownMenuLabel>
                          <DropdownMenuItem
                            disabled={user.role === "student"}
                            onClick={() => handleChangeRole(user.id, user.name, "student")}
                          >
                            <UserCog className="h-4 w-4 mr-2" />
                            Estudiante
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={user.role === "teacher"}
                            onClick={() => handleChangeRole(user.id, user.name, "teacher")}
                          >
                            <UserCog className="h-4 w-4 mr-2" />
                            Profesor
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            disabled={user.role === "admin"}
                            onClick={() => handleChangeRole(user.id, user.name, "admin")}
                          >
                            <UserCog className="h-4 w-4 mr-2" />
                            Administrador
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteUser(user.id, user.name)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

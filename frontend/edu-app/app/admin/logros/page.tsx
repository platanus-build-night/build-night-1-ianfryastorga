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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy, ChevronDown, Edit, Eye, MoreHorizontal, Plus, Search, Trash2, Image } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

// Datos de ejemplo para logros
const achievementsData = [
  {
    id: "ach-001",
    title: "Primer Día",
    description: "Completar tu primer día de estudio",
    type: "progress",
    requirement: "1 día de estudio",
    icon: "🏆",
    xp: 50,
    isActive: true,
    createdAt: "2023-01-10T09:00:00Z",
  },
  {
    id: "ach-002",
    title: "Racha de 7 días",
    description: "Mantener una racha de estudio por 7 días consecutivos",
    type: "streak",
    requirement: "7 días consecutivos",
    icon: "🔥",
    xp: 100,
    isActive: true,
    createdAt: "2023-01-15T11:30:00Z",
  },
  {
    id: "ach-003",
    title: "Maestro del Quiz",
    description: "Obtener una puntuación perfecta en 5 quizzes",
    type: "quiz",
    requirement: "5 quizzes perfectos",
    icon: "🧠",
    xp: 150,
    isActive: true,
    createdAt: "2023-02-05T14:45:00Z",
  },
  {
    id: "ach-004",
    title: "Explorador",
    description: "Completar actividades en 3 cursos diferentes",
    type: "course",
    requirement: "3 cursos",
    icon: "🧭",
    xp: 200,
    isActive: false,
    createdAt: "2023-03-12T10:20:00Z",
  },
  {
    id: "ach-005",
    title: "Colaborador",
    description: "Participar en 10 discusiones del foro",
    type: "social",
    requirement: "10 participaciones",
    icon: "👥",
    xp: 120,
    isActive: true,
    createdAt: "2023-04-18T16:00:00Z",
  },
]

export default function AdminAchievements() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newAchievement, setNewAchievement] = useState({
    title: "",
    description: "",
    type: "progress",
    requirement: "",
    icon: "🏆",
    xp: 50,
  })
  const { toast } = useToast()

  // Filtrar logros según la búsqueda
  const filteredAchievements = achievementsData.filter(
    (achievement) =>
      achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      achievement.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      achievement.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewAchievement((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Manejar cambio en select
  const handleSelectChange = (name: string, value: string) => {
    setNewAchievement((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Manejar cambio en número
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewAchievement((prev) => ({
      ...prev,
      [name]: parseInt(value) || 0,
    }))
  }

  // Manejar creación de logro
  const handleCreateAchievement = () => {
    // Aquí iría la lógica para crear el logro
    toast({
      title: "Logro creado",
      description: `El logro "${newAchievement.title}" ha sido creado correctamente.`,
      variant: "success",
    })
    setIsCreateDialogOpen(false)
    setNewAchievement({
      title: "",
      description: "",
      type: "progress",
      requirement: "",
      icon: "🏆",
      xp: 50,
    })
  }

  // Manejar eliminación de logro
  const handleDeleteAchievement = (achievementId: string, achievementTitle: string) => {
    // Aquí iría la lógica para eliminar el logro
    toast({
      title: "Logro eliminado",
      description: `El logro "${achievementTitle}" ha sido eliminado correctamente.`,
      variant: "success",
    })
  }

  // Manejar activación/desactivación de logro
  const handleToggleActive = (achievementId: string, isActive: boolean, achievementTitle: string) => {
    // Aquí iría la lógica para activar/desactivar el logro
    toast({
      title: isActive ? "Logro desactivado" : "Logro activado",
      description: `El logro "${achievementTitle}" ha sido ${isActive ? "desactivado" : "activado"} correctamente.`,
      variant: "success",
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Gestión de Logros</h1>
        <Button asChild>
          <Link href="/admin/logros/crear">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Logro
          </Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Logros</CardTitle>
          <CardDescription>Gestiona los logros de la plataforma.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar logros..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="ml-auto">
                    Filtrar por
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSearchQuery("")}>Todos</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSearchQuery("progress")}>Progreso</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSearchQuery("streak")}>Racha</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSearchQuery("quiz")}>Quiz</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSearchQuery("course")}>Curso</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSearchQuery("social")}>Social</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Ícono</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead className="hidden md:table-cell">Tipo</TableHead>
                  <TableHead className="hidden md:table-cell">Requisito</TableHead>
                  <TableHead className="hidden md:table-cell">XP</TableHead>
                  <TableHead className="hidden md:table-cell">Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAchievements.map((achievement) => (
                  <TableRow key={achievement.id}>
                    <TableCell className="font-medium text-2xl">{achievement.icon}</TableCell>
                    <TableCell>
                      <div className="font-medium">{achievement.title}</div>
                      <div className="text-sm text-muted-foreground md:hidden">{achievement.type}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline">
                        {achievement.type === "progress" && "Progreso"}
                        {achievement.type === "streak" && "Racha"}
                        {achievement.type === "quiz" && "Quiz"}
                        {achievement.type === "course" && "Curso"}
                        {achievement.type === "social" && "Social"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{achievement.requirement}</TableCell>
                    <TableCell className="hidden md:table-cell">{achievement.xp} XP</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant={achievement.isActive ? "default" : "secondary"}>
                        {achievement.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            <span>Ver detalles</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Editar</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              handleToggleActive(achievement.id, achievement.isActive, achievement.title)
                            }
                          >
                            {achievement.isActive ? (
                              <>
                                <Trophy className="mr-2 h-4 w-4" />
                                <span>Desactivar</span>
                              </>
                            ) : (
                              <>
                                <Trophy className="mr-2 h-4 w-4" />
                                <span>Activar</span>
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteAchievement(achievement.id, achievement.title)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Eliminar</span>
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
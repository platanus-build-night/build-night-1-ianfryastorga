"use client"

import { useState, useEffect } from "react"
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
import { HelpCircle, MoreHorizontal, Plus, Search, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Course, CreateQuestionDto, Level, Question, QuestionType, Set, courseApi, levelApi, questionApi, setApi } from "@/lib/api"

export default function AdminQuestions() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newQuestion, setNewQuestion] = useState<Partial<CreateQuestionDto>>({
    prompt: "",
    answer: "",
    level_id: undefined,
    type: QuestionType.TEXT,
    difficulty: 1
  })
  const [questions, setQuestions] = useState<Question[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [sets, setSets] = useState<Set[]>([])
  const [levels, setLevels] = useState<Level[]>([])
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [selectedSet, setSelectedSet] = useState<string>("")
  const [selectedLevel, setSelectedLevel] = useState<string>("")
  
  // Estados para el formulario de creación
  const [formCourseId, setFormCourseId] = useState<string>("")
  const [formSetId, setFormSetId] = useState<string>("")
  const [formSets, setFormSets] = useState<Set[]>([])
  const [formLevels, setFormLevels] = useState<Level[]>([])
  const [formLoading, setFormLoading] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  const { toast } = useToast()

  // Cargar cursos al iniciar
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await courseApi.getAllCourses()
        setCourses(coursesData)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching courses:', error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los cursos. Intente de nuevo más tarde.",
          variant: "destructive",
        })
        setLoading(false)
      }
    }
    
    fetchCourses()
  }, [])

  // Cargar conjuntos cuando se selecciona un curso
  useEffect(() => {
    if (!selectedCourse || selectedCourse === "0") {
      setSets([])
      setSelectedSet("")
      return
    }
    
    const fetchSets = async () => {
      try {
        const setsData = await setApi.getSetsByCourse(parseInt(selectedCourse))
        setSets(setsData)
      } catch (error) {
        console.error('Error fetching sets:', error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los conjuntos. Intente de nuevo más tarde.",
          variant: "destructive",
        })
      }
    }
    
    fetchSets()
  }, [selectedCourse])

  // Cargar conjuntos para el formulario
  useEffect(() => {
    if (!formCourseId || formCourseId === "0") {
      setFormSets([])
      setFormSetId("")
      return
    }
    
    const fetchFormSets = async () => {
      try {
        const setsData = await setApi.getSetsByCourse(parseInt(formCourseId))
        setFormSets(setsData)
      } catch (error) {
        console.error('Error fetching sets for form:', error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los conjuntos. Intente de nuevo más tarde.",
          variant: "destructive",
        })
      }
    }
    
    fetchFormSets()
  }, [formCourseId])

  // Cargar niveles para el formulario
  useEffect(() => {
    if (!formSetId || formSetId === "0") {
      setFormLevels([])
      setNewQuestion(prev => ({ ...prev, level_id: undefined }))
      return
    }
    
    setFormLoading(true)
    const fetchFormLevels = async () => {
      try {
        const levelsData = await levelApi.getLevelsBySet(parseInt(formSetId))
        setFormLevels(levelsData)
        setFormLoading(false)
      } catch (error) {
        console.error('Error fetching levels for form:', error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los niveles. Intente de nuevo más tarde.",
          variant: "destructive",
        })
        setFormLoading(false)
      }
    }
    
    fetchFormLevels()
  }, [formSetId])

  // Cargar niveles cuando se selecciona un conjunto
  useEffect(() => {
    if (!selectedSet || selectedSet === "0") {
      setLevels([])
      setSelectedLevel("")
      return
    }
    
    const fetchLevels = async () => {
      try {
        const levelsData = await levelApi.getLevelsBySet(parseInt(selectedSet))
        setLevels(levelsData)
      } catch (error) {
        console.error('Error fetching levels:', error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los niveles. Intente de nuevo más tarde.",
          variant: "destructive",
        })
      }
    }
    
    fetchLevels()
  }, [selectedSet])

  // Cargar preguntas cuando se selecciona un nivel
  useEffect(() => {
    if (!selectedLevel || selectedLevel === "0") {
      setQuestions([])
      return
    }
    
    const fetchQuestions = async () => {
      try {
        const questionsData = await questionApi.getQuestionsByLevel(parseInt(selectedLevel))
        setQuestions(questionsData)
      } catch (error) {
        console.error('Error fetching questions:', error)
        toast({
          title: "Error",
          description: "No se pudieron cargar las preguntas. Intente de nuevo más tarde.",
          variant: "destructive",
        })
      }
    }
    
    fetchQuestions()
  }, [selectedLevel])

  // Filtrar preguntas según la búsqueda
  const filteredQuestions = questions.filter(
    (question) =>
      question.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewQuestion((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Manejar cambio en select de nivel
  const handleLevelChange = (value: string) => {
    setNewQuestion(prev => ({
      ...prev,
      level_id: parseInt(value)
    }))
  }

  // Resetear formulario al abrir el diálogo
  const handleOpenDialog = (open: boolean) => {
    if (open) {
      setFormCourseId("")
      setFormSetId("")
      setFormSets([])
      setFormLevels([])
      setNewQuestion({
        prompt: "",
        answer: "",
        level_id: undefined,
        type: QuestionType.TEXT,
        difficulty: 1
      })
    }
    setIsCreateDialogOpen(open)
  }

  // Manejar creación de pregunta
  const handleCreateQuestion = async () => {
    if (!newQuestion.prompt || !newQuestion.answer || !newQuestion.level_id) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos requeridos.",
        variant: "destructive",
      })
      return
    }
    
    try {
      // Crear objeto DTO para la API
      const createQuestionDto: CreateQuestionDto = {
        level_id: newQuestion.level_id,
        prompt: newQuestion.prompt,
        type: newQuestion.type || QuestionType.TEXT,
        answer: newQuestion.answer,
        difficulty: newQuestion.difficulty || 1
      }
      
      // Llamar a la API para crear la pregunta
      await questionApi.createQuestion(createQuestionDto)
      
      // Actualizar la lista de preguntas si hay un nivel seleccionado
      if (selectedLevel) {
        const updatedQuestions = await questionApi.getQuestionsByLevel(parseInt(selectedLevel))
        setQuestions(updatedQuestions)
      }
      
      // Mostrar mensaje de éxito
      toast({
        title: "Pregunta creada",
        description: "La pregunta ha sido creada correctamente.",
        variant: "success",
      })
      
      // Cerrar diálogo y limpiar formulario
      setIsCreateDialogOpen(false)
      setNewQuestion({
        prompt: "",
        answer: "",
        level_id: undefined,
        type: QuestionType.TEXT,
        difficulty: 1
      })
      setFormCourseId("")
      setFormSetId("")
    } catch (error) {
      console.error('Error creating question:', error)
      toast({
        title: "Error",
        description: "No se pudo crear la pregunta. Intente de nuevo más tarde.",
        variant: "destructive",
      })
    }
  }

  // Manejar eliminación de pregunta
  const handleDeleteQuestion = async (questionId: number) => {
    try {
      // Llamar a la API para eliminar la pregunta
      await questionApi.deleteQuestion(questionId)
      
      // Actualizar la lista de preguntas
      setQuestions(prevQuestions => prevQuestions.filter(q => q.id !== questionId))
      
      // Mostrar mensaje de éxito
      toast({
        title: "Pregunta eliminada",
        description: "La pregunta ha sido eliminada correctamente.",
        variant: "success",
      })
    } catch (error) {
      console.error('Error deleting question:', error)
      toast({
        title: "Error",
        description: "No se pudo eliminar la pregunta. Intente de nuevo más tarde.",
        variant: "destructive",
      })
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Gestión de Preguntas</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={handleOpenDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Pregunta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Crear Nueva Pregunta</DialogTitle>
              <DialogDescription>Completa los detalles para crear una nueva pregunta.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="formCourseSelect">Curso</Label>
                <Select value={formCourseId} onValueChange={setFormCourseId}>
                  <SelectTrigger id="formCourseSelect">
                    <SelectValue placeholder="Selecciona un curso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Selecciona un curso</SelectItem>
                    {courses.map(course => (
                      <SelectItem key={course.id} value={course.id.toString()}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {formCourseId && formCourseId !== "0" && (
                <div className="grid gap-2">
                  <Label htmlFor="formSetSelect">Conjunto</Label>
                  <Select value={formSetId} onValueChange={setFormSetId}>
                    <SelectTrigger id="formSetSelect">
                      <SelectValue placeholder="Selecciona un conjunto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Selecciona un conjunto</SelectItem>
                      {formSets.length > 0 ? (
                        formSets.map(set => (
                          <SelectItem key={set.id} value={set.id.toString()}>
                            {set.title}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="empty" disabled>
                          No hay conjuntos disponibles
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {formSetId && formSetId !== "0" && (
                formLoading ? (
                  <div className="text-center text-sm text-muted-foreground">
                    Cargando niveles...
                  </div>
                ) : formLevels.length > 0 ? (
                  <div className="grid gap-2">
                    <Label htmlFor="levelSelect">Nivel</Label>
                    <Select value={newQuestion.level_id?.toString()} onValueChange={handleLevelChange}>
                      <SelectTrigger id="levelSelect">
                        <SelectValue placeholder="Selecciona un nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        {formLevels.map(level => (
                          <SelectItem key={level.id} value={level.id.toString()}>
                            {level.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="text-center text-sm text-muted-foreground">
                    No hay niveles disponibles para este conjunto.
                    Debes crear niveles primero antes de crear preguntas.
                  </div>
                )
              )}
              
              {newQuestion.level_id && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="prompt">Texto de la pregunta</Label>
                    <Textarea
                      id="prompt"
                      name="prompt"
                      value={newQuestion.prompt}
                      onChange={handleInputChange}
                      placeholder="Ej: ¿Cuál es la fórmula para calcular el área de un círculo?"
                      rows={3}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="answer">Respuesta</Label>
                    <Input
                      id="answer"
                      name="answer"
                      value={newQuestion.answer}
                      onChange={handleInputChange}
                      placeholder="Ej: πr²"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="difficulty">Dificultad (1-5)</Label>
                    <Input
                      id="difficulty"
                      name="difficulty"
                      type="number"
                      min="1"
                      max="5"
                      value={newQuestion.difficulty}
                      onChange={handleInputChange}
                      placeholder="1"
                    />
                  </div>
                </>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleCreateQuestion} 
                disabled={!newQuestion.level_id || !newQuestion.prompt || !newQuestion.answer}
              >
                Crear Pregunta
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Preguntas</CardTitle>
          <CardDescription>Gestiona las preguntas para tus niveles.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="courseSelect" className="mb-2 block">Curso</Label>
                <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                  <SelectTrigger id="courseSelect">
                    <SelectValue placeholder="Selecciona un curso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Selecciona un curso</SelectItem>
                    {courses.map(course => (
                      <SelectItem key={course.id} value={course.id.toString()}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="setSelect" className="mb-2 block">Conjunto</Label>
                <Select value={selectedSet} onValueChange={setSelectedSet} disabled={!selectedCourse || selectedCourse === "0"}>
                  <SelectTrigger id="setSelect">
                    <SelectValue placeholder="Selecciona un conjunto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Selecciona un conjunto</SelectItem>
                    {sets.length > 0 ? (
                      sets.map(set => (
                        <SelectItem key={set.id} value={set.id.toString()}>
                          {set.title}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="empty" disabled>
                        No hay conjuntos disponibles
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="levelSelect" className="mb-2 block">Nivel</Label>
                <Select value={selectedLevel} onValueChange={setSelectedLevel} disabled={!selectedSet || selectedSet === "0"}>
                  <SelectTrigger id="levelSelect">
                    <SelectValue placeholder="Selecciona un nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Selecciona un nivel</SelectItem>
                    {levels.length > 0 ? (
                      levels.map(level => (
                        <SelectItem key={level.id} value={level.id.toString()}>
                          {level.title}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="empty" disabled>
                        No hay niveles disponibles
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {selectedLevel && selectedLevel !== "0" && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar preguntas..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            )}
          </div>

          {selectedLevel && selectedLevel !== "0" ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pregunta</TableHead>
                    <TableHead>Respuesta</TableHead>
                    <TableHead>Dificultad</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">Cargando datos...</TableCell>
                    </TableRow>
                  ) : filteredQuestions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        {searchQuery 
                          ? "No se encontraron resultados para su búsqueda" 
                          : "No hay preguntas disponibles para este nivel"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredQuestions.map((question) => (
                      <TableRow key={question.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <HelpCircle className="h-5 w-5 text-primary flex-shrink-0" />
                            <div className="font-medium line-clamp-2">{question.prompt}</div>
                          </div>
                        </TableCell>
                        <TableCell>{question.answer}</TableCell>
                        <TableCell>
                          <Badge variant={question.difficulty > 3 ? "destructive" : "secondary"}>
                            {question.difficulty}
                          </Badge>
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
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDeleteQuestion(question.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center p-8 text-muted-foreground">
              Selecciona un curso, conjunto y nivel para ver las preguntas disponibles.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

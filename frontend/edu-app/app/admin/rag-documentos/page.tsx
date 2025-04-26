"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { courseApi, Course, RagDocument, CreateRagDocumentDto, UpdateRagDocumentDto, ragApi } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { FileText, Plus, Trash2, ArrowLeft, Upload, File, X } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"

export default function RagDocumentsPage() {
  const searchParams = useSearchParams()
  const initialCourseId = searchParams.get('courseId') || ""
  
  const [courses, setCourses] = useState<Course[]>([])
  const [documents, setDocuments] = useState<RagDocument[]>([])
  const [selectedCourse, setSelectedCourse] = useState<string>(initialCourseId)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<RagDocument | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("text")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFileName, setUploadedFileName] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [newDocument, setNewDocument] = useState<CreateRagDocumentDto>({
    course_id: initialCourseId ? parseInt(initialCourseId) : 0,
    title: "",
    content: ""
  })
  
  const [editDocument, setEditDocument] = useState<UpdateRagDocumentDto>({
    title: "",
    content: "",
    active: true
  })
  
  const { toast } = useToast()

  // Cargar cursos al iniciar
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await courseApi.getAllCourses()
        setCourses(coursesData)
      } catch (error) {
        console.error("Error cargando cursos:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los cursos",
          variant: "destructive",
        })
      }
    }

    fetchCourses()
  }, [toast])

  // Cargar documentos cuando se selecciona un curso
  useEffect(() => {
    if (!selectedCourse || selectedCourse === "0") {
      setDocuments([])
      return
    }
    
    const fetchDocuments = async () => {
      try {
        setIsLoading(true)
        const documentsData = await ragApi.getDocumentsByCourse(parseInt(selectedCourse))
        setDocuments(documentsData)
      } catch (error) {
        console.error("Error cargando documentos:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los documentos",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchDocuments()
  }, [selectedCourse, toast])

  // Actualizar el course_id en newDocument cuando cambia selectedCourse
  useEffect(() => {
    if (selectedCourse && selectedCourse !== "0") {
      setNewDocument(prev => ({
        ...prev,
        course_id: parseInt(selectedCourse)
      }));
      console.log("Course_id actualizado a:", parseInt(selectedCourse));
    }
  }, [selectedCourse]);

  // Debug: Monitorear el estado del documento para saber cuándo se debe habilitar el botón
  useEffect(() => {
    const isButtonDisabled = isLoading || isUploading || !newDocument.course_id || !newDocument.title || !newDocument.content;
    console.log("Estado del botón:", {
      isDisabled: isButtonDisabled,
      isLoading,
      isUploading,
      hasCourseId: Boolean(newDocument.course_id),
      courseId: newDocument.course_id,
      hasTitle: Boolean(newDocument.title),
      title: newDocument.title,
      hasContent: Boolean(newDocument.content),
      contentLength: newDocument.content ? newDocument.content.length : 0
    });
  }, [isLoading, isUploading, newDocument.course_id, newDocument.title, newDocument.content]);

  // Manejar carga de archivos
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Verificar tipo de archivo (PDF o TXT)
    if (file.type !== 'application/pdf' && file.type !== 'text/plain') {
      toast({
        title: "Tipo de archivo no soportado",
        description: "Por favor sube un archivo PDF o TXT",
        variant: "destructive",
      })
      return
    }
    
    setUploadedFileName(file.name)
    
    // Extraer el título del nombre del archivo (sin extensión)
    const fileTitle = file.name.split('.').slice(0, -1).join('.')
    setNewDocument(prev => ({
      ...prev,
      title: fileTitle || prev.title
    }))
    
    setIsUploading(true)
    setUploadProgress(10)
    
    try {
      // Simulación de progreso para feedback visual
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + Math.floor(Math.random() * 15)
          return newProgress > 90 ? 90 : newProgress
        })
      }, 200)
      
      let fileContent = ''
      
      if (file.type === 'application/pdf') {
        // Para archivos PDF, usar el nuevo endpoint de OpenAI
        const formData = new FormData()
        formData.append('file', file)
        formData.append('course_id', newDocument.course_id.toString())
        formData.append('title', fileTitle)
        
        console.log("Enviando formulario con course_id:", newDocument.course_id.toString());
        
        try {
          // Usar el nuevo método que procesa PDFs con OpenAI
          const response = await ragApi.processPdfWithOpenAI(formData)
          console.log("PDF procesado con OpenAI - Respuesta completa:", response);
          
          // Guardar el file_id para usarlo en consultas futuras
          if (response && response.file_id) {
            // Extraer el file_id que viene directamente de la respuesta
            const fileId = response.file_id;
            console.log(`Guardando file_id en localStorage: ${fileId} para el curso ${newDocument.course_id}`);
            window.localStorage.setItem(`openai_file_${newDocument.course_id}`, fileId);
            
            // Verificar que se guardó correctamente
            const storedId = window.localStorage.getItem(`openai_file_${newDocument.course_id}`);
            console.log(`Verificación - ID almacenado: ${storedId}`);
            
            toast({
              title: "Archivo subido a OpenAI",
              description: `File ID: ${fileId}. Este documento puede ser consultado usando la API de OpenAI.`,
              variant: "success",
            });
            
            // Actualizar inmediatamente el estado del documento
            const contentWithFileId = `[OpenAI File ID: ${fileId}] Este documento fue procesado por OpenAI y está disponible para consultas.`;
            setNewDocument(prevState => ({
              ...prevState,
              content: contentWithFileId,
              title: fileTitle || prevState.title,
              course_id: prevState.course_id
            }));
          } else {
            console.error("No se recibió un file_id válido en la respuesta:", response);
            toast({
              title: "Advertencia",
              description: "El archivo se procesó pero no se recibió un ID válido para consultas.",
              variant: "warning",
            });
          }
        } catch (error) {
          // Si falla el procesamiento en el backend, mostrar error
          clearInterval(progressInterval)
          throw error
        }
      } else {
        // Para archivos TXT, seguir procesando en el frontend
        const reader = new FileReader()
        fileContent = await new Promise<string>((resolve, reject) => {
          reader.onload = (e) => resolve(e.target?.result as string || '')
          reader.onerror = reject
          reader.readAsText(file)
        })
        
        // Actualizar inmediatamente el estado después de procesar el archivo TXT
        setNewDocument(prevState => {
          const updatedState = {
            ...prevState,
            content: fileContent,
            title: fileTitle || prevState.title
          };
          
          console.log("Estado actualizado inmediatamente (TXT):", updatedState);
          return updatedState;
        });
      }
      
      clearInterval(progressInterval)
      setUploadProgress(100)
      
      toast({
        title: "Archivo cargado",
        description: "El contenido del archivo se ha extraído correctamente",
        variant: "success",
      })
    } catch (error) {
      console.error("Error procesando archivo:", error)
      toast({
        title: "Error",
        description: "No se pudo procesar el archivo",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      
      // Verificar una última vez que el documento tenga todos los campos necesarios
      // Este es un último intento por si hay problemas de actualización de estado asíncrono
      setTimeout(() => {
        setNewDocument(current => {
          // Si falta contenido pero se ha subido un archivo, hay un problema
          if (!current.content && uploadedFileName) {
            console.log("Corrección de emergencia: falta contenido a pesar de tener un archivo");
            return {
              ...current,
              content: fileContent || "Contenido extraído del archivo"
            };
          }
          return current;
        });
      }, 100);
    }
  }
  
  const handleRemoveFile = () => {
    setUploadedFileName("")
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Manejar creación de documento
  const handleCreateDocument = async () => {
    if (!newDocument.course_id || !newDocument.title || !newDocument.content) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos",
        variant: "destructive",
      })
      return
    }
    
    try {
      setIsLoading(true)
      await ragApi.createDocument(newDocument)
      
      toast({
        title: "Éxito",
        description: "Documento creado correctamente",
        variant: "success",
      })
      
      // Recargar documentos
      if (selectedCourse) {
        const documentsData = await ragApi.getDocumentsByCourse(parseInt(selectedCourse))
        setDocuments(documentsData)
      }
      
      // Limpiar formulario y cerrar diálogo
      setIsCreateDialogOpen(false)
      setNewDocument({
        course_id: parseInt(selectedCourse) || 0,
        title: "",
        content: ""
      })
      setUploadedFileName("")
      setUploadProgress(0)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Error creando documento:", error)
      toast({
        title: "Error",
        description: "No se pudo crear el documento",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Manejar actualización de documento
  const handleUpdateDocument = async () => {
    if (!selectedDocument) return
    
    try {
      setIsLoading(true)
      await ragApi.updateDocument(selectedDocument.id, editDocument)
      
      toast({
        title: "Éxito",
        description: "Documento actualizado correctamente",
        variant: "success",
      })
      
      // Recargar documentos
      if (selectedCourse) {
        const documentsData = await ragApi.getDocumentsByCourse(parseInt(selectedCourse))
        setDocuments(documentsData)
      }
      
      // Cerrar diálogo
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error("Error actualizando documento:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el documento",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Manejar eliminación de documento
  const handleDeleteDocument = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este documento?")) return
    
    try {
      setIsLoading(true)
      await ragApi.deleteDocument(id)
      
      toast({
        title: "Éxito",
        description: "Documento eliminado correctamente",
        variant: "success",
      })
      
      // Recargar documentos
      if (selectedCourse) {
        const documentsData = await ragApi.getDocumentsByCourse(parseInt(selectedCourse))
        setDocuments(documentsData)
      }
    } catch (error) {
      console.error("Error eliminando documento:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el documento",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Abrir diálogo de edición
  const openEditDialog = (document: RagDocument) => {
    setSelectedDocument(document)
    setEditDocument({
      title: document.title,
      content: document.content,
      active: document.active
    })
    setIsEditDialogOpen(true)
  }
  
  // Manejar cambios en formularios
  const handleCreateInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewDocument(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditDocument(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          {initialCourseId && (
            <Link href="/admin/cursos" className="flex items-center text-sm text-muted-foreground hover:text-primary mb-2">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver a cursos
            </Link>
          )}
          <h1 className="text-3xl font-bold">Documentos para RAG</h1>
          <p className="text-muted-foreground">
            Gestiona los documentos de referencia para el sistema de preguntas y respuestas
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Nuevo Documento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Documento</DialogTitle>
              <DialogDescription>
                Añade un nuevo documento de referencia para el sistema RAG
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="course_id">Curso</Label>
                <Select 
                  value={newDocument.course_id.toString()} 
                  onValueChange={(value) => setNewDocument(prev => ({ ...prev, course_id: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un curso" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map(course => (
                      <SelectItem key={course.id} value={course.id.toString()}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  name="title"
                  value={newDocument.title}
                  onChange={(e) => setNewDocument(prev => ({...prev, title: e.target.value}))}
                  placeholder="Ej: Guía de Introducción"
                />
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text">Texto</TabsTrigger>
                  <TabsTrigger value="file">Archivo</TabsTrigger>
                </TabsList>
                
                <TabsContent value="text" className="mt-4">
                  <div className="grid gap-2">
                    <Label htmlFor="content">Contenido</Label>
                    <Textarea
                      id="content"
                      name="content"
                      value={newDocument.content}
                      onChange={(e) => setNewDocument(prev => ({...prev, content: e.target.value}))}
                      placeholder="Ingresa el contenido del documento..."
                      className="min-h-[200px]"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="file" className="mt-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label>Subir archivo (PDF o TXT)</Label>
                      <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                        {!uploadedFileName ? (
                          <>
                            <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground mb-2">
                              Arrastra un archivo aquí o haz clic para seleccionar
                            </p>
                            <Input
                              ref={fileInputRef}
                              type="file"
                              accept=".pdf,.txt"
                              onChange={handleFileChange}
                              className="hidden"
                              id="file-upload"
                            />
                            <Button 
                              variant="secondary" 
                              onClick={() => fileInputRef.current?.click()}
                              disabled={isUploading}
                            >
                              Seleccionar archivo
                            </Button>
                          </>
                        ) : (
                          <div className="w-full">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <File className="h-5 w-5 mr-2 text-primary" />
                                <span className="text-sm font-medium">{uploadedFileName}</span>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={handleRemoveFile}
                                disabled={isUploading}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            {isUploading && (
                              <div className="w-full">
                                <Progress value={uploadProgress} className="h-2 mb-1" />
                                <p className="text-xs text-muted-foreground text-right">
                                  {uploadProgress}%
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        El contenido del archivo será extraído y utilizado como contexto para el RAG.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCreateDialogOpen(false)
                  setUploadedFileName("")
                  setUploadProgress(0)
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ""
                  }
                }}
                disabled={isLoading || isUploading}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleCreateDocument}
                disabled={isLoading || isUploading || !newDocument.course_id || !newDocument.title || !newDocument.content}
                title={
                  isLoading ? "Cargando..." :
                  isUploading ? "Subiendo archivo..." :
                  !newDocument.course_id ? "Seleccione un curso" :
                  !newDocument.title ? "Ingrese un título" :
                  !newDocument.content ? "Ingrese contenido o suba un archivo" : ""
                }
              >
                {isLoading ? "Creando..." : "Crear Documento"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Diálogo de edición */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Editar Documento</DialogTitle>
            <DialogDescription>
              Modifica los detalles del documento
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-title">Título</Label>
              <Input
                id="edit-title"
                name="title"
                value={editDocument.title}
                onChange={handleEditInputChange}
                placeholder="Título del documento"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-content">Contenido</Label>
              <Textarea
                id="edit-content"
                name="content"
                value={editDocument.content}
                onChange={handleEditInputChange}
                placeholder="Contenido del documento"
                className="min-h-[200px]"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-active"
                checked={editDocument.active}
                onCheckedChange={(checked) => setEditDocument(prev => ({ ...prev, active: checked }))}
              />
              <Label htmlFor="edit-active">Activo</Label>
              <p className="text-xs text-muted-foreground ml-2">
                Si está desactivado, este documento no se utilizará en las respuestas del asistente.
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditDialogOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleUpdateDocument}
              disabled={isLoading || !editDocument.title || !editDocument.content}
            >
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Card>
        <CardHeader>
          <CardTitle>Documentos RAG</CardTitle>
          <CardDescription>
            Documentos de referencia para el sistema de preguntas y respuestas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
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
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <p className="text-muted-foreground">Cargando documentos...</p>
              </div>
            ) : (
              <>
                {!selectedCourse || selectedCourse === "0" ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Selecciona un curso para ver sus documentos</p>
                  </div>
                ) : documents.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No hay documentos para este curso</p>
                    <Button className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" /> Añadir documento
                    </Button>
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Título</TableHead>
                          <TableHead>Contenido</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Fecha de actualización</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {documents.map((document) => (
                          <TableRow key={document.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                                <div className="font-medium">{document.title}</div>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-xs">
                              <div className="truncate">
                                {document.content}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={document.active ? "default" : "secondary"}>
                                {document.active ? "Activo" : "Inactivo"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {new Date(document.updated_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openEditDialog(document)}
                                >
                                  Editar
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteDocument(document.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 
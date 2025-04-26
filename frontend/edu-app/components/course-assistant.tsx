"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Bot, Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ragApi } from "@/lib/api";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface CourseAssistantProps {
  courseId: number;
  courseTitle: string;
}

export function CourseAssistant({ courseId, courseTitle }: CourseAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `¡Hola! Soy el asistente de ${courseTitle}. Puedo intentar responder tus preguntas basándome en la información disponible en el sistema.`,
      timestamp: new Date()
    }
  ]);
  
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [additionalContext, setAdditionalContext] = useState('');
  const [showContextInput, setShowContextInput] = useState(false);
  
  // Referencia para el contenedor de mensajes
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Efecto para hacer scroll automático hacia abajo
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.children[0] as HTMLElement; // Acceder al viewport
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages, loading]); // Ejecutar cuando cambien los mensajes o el estado de carga

  const handleQuestionSubmit = async () => {
    if (!question.trim() || loading) return;
    
    // Añadir la pregunta del usuario a los mensajes
    const userMessage: Message = {
      role: 'user',
      content: question,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setQuestion('');
    setLoading(true);
    
    try {
      // Construir los datos de la petición SIN fileId
      const requestData: RagQuestion = {
        courseId,
        question: userMessage.content,
        additionalContext: additionalContext.trim() || undefined
        // Ya no enviamos fileId
      };
      
      console.log("Datos que se enviarán al backend (sin fileId específico):", JSON.stringify(requestData));
      
      // Llamar a la API (el backend usará el Vector Store configurado)
      const response = await ragApi.answerQuestion(requestData);
      
      // Añadir la respuesta a los mensajes
      // Asegurarse de manejar la estructura de respuesta { text: ..., citations: ... }
      const responseContent = typeof response === 'object' && response.text ? response.text : response.answer;
      const assistantMessage: Message = {
        role: 'assistant',
        content: responseContent || String(response), // Fallback por si acaso
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Si hay citas en la respuesta, mostrarlas
      if (typeof response === 'object' && response.citations && response.citations.length > 0) {
        const citationsMessage: Message = {
          role: 'assistant',
          content: `Fuentes: ${response.citations.map((c: any) => c.filename || c.file_id).join(', ')}`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, citationsMessage]);
      }
    } catch (error) {
      console.error('Error al obtener respuesta del asistente:', error);
      
      // Mensaje de error
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Lo siento, ha ocurrido un error al procesar tu pregunta. Por favor, inténtalo de nuevo más tarde.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="h-[500px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Asistente de Curso
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => setShowContextInput(!showContextInput)}
              >
                {showContextInput ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                Contexto
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Añadir contexto personalizado</h4>
                <p className="text-xs text-muted-foreground">
                  Añade información adicional que el asistente tendrá en cuenta al responder tus preguntas.
                </p>
                <Textarea 
                  placeholder="Ej: Estoy trabajando en un proyecto sobre..." 
                  value={additionalContext}
                  onChange={(e) => setAdditionalContext(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </PopoverContent>
          </Popover>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea ref={scrollAreaRef} className="h-[320px] pr-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <Avatar className="h-8 w-8">
                    {message.role === 'assistant' ? (
                      <>
                        <AvatarImage src="/bot-avatar.png" alt="Asistente" />
                        <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                      </>
                    ) : (
                      <>
                        <AvatarImage src="/user-avatar.png" alt="Usuario" />
                        <AvatarFallback>U</AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  <div 
                    className={`
                      rounded-lg px-3 py-2 text-sm
                      ${message.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                      }
                    `}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs opacity-50 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-2 max-w-[80%]">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/bot-avatar.png" alt="Asistente" />
                    <AvatarFallback className="bg-primary text-primary-foreground">AI</AvatarFallback>
                  </Avatar>
                  <div className="rounded-lg px-3 py-2 bg-muted flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <p className="text-sm">Pensando...</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <div className="flex w-full gap-2">
          <Textarea 
            placeholder="Haz una pregunta sobre el curso..." 
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="flex-1 resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleQuestionSubmit();
              }
            }}
          />
          <Button 
            size="icon" 
            onClick={handleQuestionSubmit} 
            disabled={loading || !question.trim()}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
} 
"use client";

import { useState } from "react";
import { Send, Bot, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ragApi } from "@/lib/api";

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
      content: `¡Hola! Soy el asistente de ${courseTitle}. ¿En qué puedo ayudarte hoy?`,
      timestamp: new Date()
    }
  ]);
  
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  
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
      // Enviar la pregunta al backend
      const response = await ragApi.answerQuestion({
        courseId,
        question: userMessage.content
      });
      
      // Añadir la respuesta a los mensajes
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.answer,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
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
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          Asistente de Curso
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-[320px] pr-4">
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
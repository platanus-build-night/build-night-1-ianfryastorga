import { Injectable } from '@nestjs/common';
import axios from 'axios';
import dotenv from 'dotenv';
import { CourseRepo } from '../course/course.repository';
import { SetRepo } from '../set/set.repository';
import { LevelRepo } from '../level/level.repository';
import { QuestionRepo } from '../question/question.repository';
import { RagDocumentRepo } from './rag-document.repository';
import { RagDocument } from './rag-document.entity';
import * as fs from 'fs';
import FormData from 'form-data';
const pdfParse = require('pdf-parse');

dotenv.config();

export class RagService {
  private openaiApiKey: string;

  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY || '';
    
    if (!this.openaiApiKey) {
      console.warn('OPENAI_API_KEY no está configurada en el archivo .env');
    }
  }

  // Método para crear un archivo en un vector store
  async createVectorStoreFile(vectorStoreId: string, fileId: string, attributes?: Record<string, string | boolean | number>, chunkingStrategy?: any): Promise<any> {
    try {
      if (!this.openaiApiKey) {
        throw new Error('OPENAI_API_KEY no está configurada');
      }

      const url = `https://api.openai.com/v1/vector_stores/${vectorStoreId}/files`;
      
      const payload: any = {
        file_id: fileId
      };
      
      if (attributes) {
        payload.attributes = attributes;
      }
      
      if (chunkingStrategy) {
        payload.chunking_strategy = chunkingStrategy;
      }
      
      const response = await axios.post(url, payload, {
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2'
        }
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Error al crear archivo en vector store:', error.response?.data || error.message);
      throw new Error(`Error al crear archivo en vector store: ${error.response?.data?.error?.message || error.message}`);
    }
  }
  
  // Método para recuperar un archivo de un vector store
  async getVectorStoreFile(vectorStoreId: string, fileId: string): Promise<any> {
    try {
      if (!this.openaiApiKey) {
        throw new Error('OPENAI_API_KEY no está configurada');
      }
      
      const url = `https://api.openai.com/v1/vector_stores/${vectorStoreId}/files/${fileId}`;
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2'
        }
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Error al obtener archivo de vector store:', error.response?.data || error.message);
      throw new Error(`Error al obtener archivo de vector store: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Nuevo método para procesar archivos PDF
  async processPdfFile(filePath: string): Promise<string> {
    try {
      // Leer el archivo PDF
      const dataBuffer = fs.readFileSync(filePath);
      
      console.log("PDF leído correctamente, tamaño:", dataBuffer.length);
      
      // Procesar el PDF con pdf-parse
      try {
        console.log("Llamando a pdf-parse...");
        const pdfData = await pdfParse(dataBuffer);
        console.log("pdf-parse completado correctamente");
        
        // Extraer el texto del PDF
        const text = pdfData.text;
        
        console.log("Texto extraído, longitud:", text?.length || 0);
        
        // Si el texto está vacío, lanzar un error
        if (!text || text.trim() === '') {
          throw new Error('No se pudo extraer texto del PDF');
        }
        
        return text;
      } catch (pdfError: unknown) {
        console.error("Error específico al usar pdf-parse:", pdfError);
        const errorMessage = pdfError instanceof Error ? pdfError.message : 'Error desconocido';
        throw new Error(`Error en pdf-parse: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error al procesar el archivo PDF:', error);
      throw new Error('Error al procesar el archivo PDF: ' + (error instanceof Error ? error.message : 'Error desconocido'));
    }
  }

  async generateCourseContext(courseId: number): Promise<string> {
    try {
      // Obtener información del curso
      const course = await CourseRepo.findOneBy({ id: courseId });
      if (!course) {
        throw new Error(`Curso con ID ${courseId} no encontrado`);
      }

      // Construir contexto
      let context = `CURSO: ${course.title}\nDESCRIPCIÓN: ${course.description}\n\n`;

      // Obtener documentos RAG para este curso
      const ragDocuments = await RagDocumentRepo.find({ 
        where: { courseId, active: true },
        order: { updatedAt: 'DESC' }
      });

      // Agregar contenido de documentos RAG
      if (ragDocuments.length > 0) {
        context += "DOCUMENTOS DE REFERENCIA:\n\n";
        
        for (const doc of ragDocuments) {
          context += `TÍTULO: ${doc.title}\n`;
          context += `CONTENIDO: ${doc.content}\n\n`;
        }
      }

      // Obtener conjuntos del curso
      const sets = await SetRepo.find({ where: { courseId } });

      // Agregar información de cada conjunto y nivel
      for (const set of sets) {
        context += `CONJUNTO: ${set.title}\nDESCRIPCIÓN: ${set.description}\n\n`;

        // Obtener niveles de este conjunto
        const levels = await LevelRepo.find({ where: { setId: set.id } });

        for (const level of levels) {
          context += `NIVEL: ${level.title}\nDESCRIPCIÓN: ${level.description}\n\n`;

          // Obtener preguntas de este nivel
          const questions = await QuestionRepo.find({ where: { levelId: level.id } });

          // Agregar preguntas y respuestas al contexto
          for (const question of questions) {
            context += `PREGUNTA: ${question.prompt}\n`;
            context += `RESPUESTA: ${question.answer}\n`;
            if (question.explanation) {
              context += `EXPLICACIÓN: ${question.explanation}\n`;
            }
            context += '\n';
          }
        }
      }

      return context;
    } catch (error) {
      console.error('Error al generar contexto del curso:', error);
      throw error;
    }
  }

  async answerQuestion(courseId: number, question: string, additionalContext: string = '', fileId?: string): Promise<any> {
    try {
      // Formatear la pregunta incluyendo el ID del curso para contexto
      const formattedQuestion = `[Curso ID: ${courseId}] ${question}`;
      
      console.log(`Procesando pregunta: "${formattedQuestion}"`);
      
      if (!this.openaiApiKey) {
        throw new Error('No se ha configurado OPENAI_API_KEY en .env');
      }
      
      const vectorStoreId = process.env.OPENAI_VECTOR_STORE_ID;
      if (!vectorStoreId) {
        throw new Error('OPENAI_VECTOR_STORE_ID no está configurada en el archivo .env');
      }

      // Estructura del payload para la API usando file_search
      const payload: any = {
        model: "gpt-4.1-nano",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: formattedQuestion
              }
            ]
          }
        ],
        tools: [
          {
            type: "file_search",
            vector_store_ids: [vectorStoreId]
          }
        ]
      };
      
      console.log("Enviando solicitud a OpenAI con file_search:", JSON.stringify(payload, null, 2));
      
      // Llamar a la API de OpenAI (responses)
      const response = await axios.post(
        'https://api.openai.com/v1/responses',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.openaiApiKey}`
          }
        }
      );
      
      console.log("Respuesta recibida de la API");
      
      // Procesar la respuesta para extraer el texto y las citas
      if (response.data && response.data.output) {
        // Obtener el mensaje de salida
        const messageOutput = response.data.output.find((out: any) => out.type === 'message');
        if (messageOutput && messageOutput.content && messageOutput.content.length > 0) {
          // Obtener el contenido textual
          const textContent = messageOutput.content.find((c: any) => c.type === 'output_text');
          if (textContent) {
            const responseText = textContent.text;
            
            // Verificar si hay citas de archivos
            const hasCitations = textContent.annotations && textContent.annotations.length > 0;
            console.log(`Respuesta generada ${hasCitations ? 'con' : 'sin'} citas de archivos`);
            
            // Devolver el texto y las citas, si existen
            return {
              text: responseText,
              citations: hasCitations ? textContent.annotations.filter((a: any) => a.type === 'file_citation') : []
            };
          }
        }
      }
      
      // Si no encontró una estructura reconocible, devolver la respuesta completa
      return response.data;
    } catch (error) {
      console.error('Error al generar respuesta:', error);
      if (axios.isAxiosError(error)) {
        console.error('Detalles del error de API:', 
          error.response?.data || error.message,
          'Status:', error.response?.status
        );
      }
      throw new Error('No se pudo generar una respuesta. Por favor, intenta de nuevo más tarde.');
    }
  }

  // Métodos para gestionar documentos RAG
  async createRagDocument(courseId: number, title: string, content: string): Promise<RagDocument> {
    const document = RagDocumentRepo.create({
      courseId,
      title,
      content,
      active: true
    });
    
    return RagDocumentRepo.save(document);
  }

  async updateRagDocument(id: number, title?: string, content?: string, active?: boolean): Promise<RagDocument> {
    const document = await RagDocumentRepo.findOneBy({ id });
    
    if (!document) {
      throw new Error(`Documento RAG con ID ${id} no encontrado`);
    }
    
    if (title !== undefined) document.title = title;
    if (content !== undefined) document.content = content;
    if (active !== undefined) document.active = active;
    
    return RagDocumentRepo.save(document);
  }

  async deleteRagDocument(id: number): Promise<void> {
    const result = await RagDocumentRepo.delete(id);
    
    if (result.affected === 0) {
      throw new Error(`Documento RAG con ID ${id} no encontrado`);
    }
  }

  async getRagDocumentsByCourse(courseId: number): Promise<RagDocument[]> {
    return RagDocumentRepo.find({ 
      where: { courseId },
      order: { updatedAt: 'DESC' } 
    });
  }

  async getRagDocumentById(id: number): Promise<RagDocument> {
    const document = await RagDocumentRepo.findOneBy({ id });
    
    if (!document) {
      throw new Error(`Documento RAG con ID ${id} no encontrado`);
    }
    
    return document;
  }

  // Método para subir un archivo PDF a OpenAI Files API y añadirlo a un Vector Store
  async uploadPdfToOpenAI(filePath: string, purpose: string = 'assistants'): Promise<any> {
    let uploadedFile: any = null;
    try {
      if (!this.openaiApiKey) {
        throw new Error('OPENAI_API_KEY no está configurada');
      }
      
      const vectorStoreId = process.env.OPENAI_VECTOR_STORE_ID;
      if (!vectorStoreId) {
        throw new Error('OPENAI_VECTOR_STORE_ID no está configurada en el archivo .env');
      }

      // Verificar que el archivo existe
      if (!fs.existsSync(filePath)) {
        throw new Error(`El archivo ${filePath} no existe`);
      }

      // 1. Subir el archivo a OpenAI Files
      const form = new FormData();
      form.append('purpose', purpose);
      form.append('file', fs.createReadStream(filePath));

      console.log(`Subiendo archivo a OpenAI Files con purpose: ${purpose}`);
      const uploadResponse = await axios.post('https://api.openai.com/v1/files', form, {
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          ...form.getHeaders()
        }
      });
      uploadedFile = uploadResponse.data;
      console.log('Archivo subido exitosamente a OpenAI Files:', uploadedFile.id);
      
      // 2. Añadir el archivo al Vector Store
      console.log(`Añadiendo archivo ${uploadedFile.id} al Vector Store ${vectorStoreId}`);
      await this.createVectorStoreFile(vectorStoreId, uploadedFile.id);
      console.log('Archivo añadido exitosamente al Vector Store');

      return uploadedFile; // Devolver la información del archivo subido
      
    } catch (error: any) {
      console.error('Error en el proceso de subida y asociación a Vector Store:');
      if (axios.isAxiosError(error)) {
        console.error('Error Axios:', error.response?.data || error.message);
      } else {
        console.error('Error General:', error.message);
      }
      
      // Intentar limpiar si el archivo se subió pero falló la asociación
      if (uploadedFile && uploadedFile.id) {
        console.warn(`Intentando eliminar archivo ${uploadedFile.id} debido a error posterior...`);
        // Opcional: Implementar lógica para eliminar el archivo si es necesario
        // await this.deleteOpenFile(uploadedFile.id); 
      }
      
      throw new Error(`Error al procesar archivo con OpenAI: ${error.response?.data?.error?.message || error.message}`);
    }
  }
} 
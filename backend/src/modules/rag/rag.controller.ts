import { Request, Response } from 'express';
import { RagService } from './rag.service';
import { CreateRagDocumentDto, UpdateRagDocumentDto, ProcessPdfDto, CreateVectorStoreFileDto, VectorStoreFileResponseDto } from './rag-document.dto';
import * as fs from 'fs';
import * as path from 'path';
import multer from 'multer';
import * as os from 'os';

// Extender la interfaz Request para incluir el campo 'file' de multer
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

// Configurar multer para almacenar archivos temporalmente
const upload = multer({
  dest: os.tmpdir(),
  limits: {
    fileSize: 20 * 1024 * 1024, // limitar a 20MB
  },
  fileFilter: (_req, file, callback) => {
    // Aceptar solo archivos PDF
    if (file.mimetype === 'application/pdf') {
      callback(null, true);
    } else {
      callback(new Error('Solo se permiten archivos PDF'));
    }
  },
}).single('file'); // 'file' es el nombre del campo en el formulario

export class RagController {
  private ragService: RagService;

  constructor() {
    this.ragService = new RagService();
  }

  // Nuevo método para procesar archivos PDF
  processPdf = async (req: Request, res: Response): Promise<void> => {
    upload(req, res, async (err: any) => {
      try {
        if (err) {
          console.error('Error al subir el archivo:', err);
          res.status(400).json({ error: err.message });
          return;
        }

        const multerReq = req as MulterRequest;

        if (!multerReq.file) {
          res.status(400).json({ error: 'No se proporcionó ningún archivo PDF' });
          return;
        }

        console.log("Archivo recibido:", multerReq.file.originalname, "tamaño:", multerReq.file.size);

        // Obtener datos del formulario
        const courseId = parseInt(req.body.course_id);
        const title = req.body.title || path.basename(multerReq.file.originalname, '.pdf');

        console.log("Datos del formulario:", { courseId, title });

        if (isNaN(courseId)) {
          res.status(400).json({ error: 'Se requiere un ID de curso válido' });
          // Eliminar el archivo temporal
          fs.unlinkSync(multerReq.file.path);
          return;
        }

        try {
          // Procesar el PDF
          console.log("Iniciando procesamiento del PDF...");
          const pdfContent = await this.ragService.processPdfFile(multerReq.file.path);
          console.log("PDF procesado exitosamente, longitud del contenido:", pdfContent.length);
          
          // Eliminar el archivo temporal después de procesarlo
          console.log("Eliminando archivo temporal...");
          fs.unlinkSync(multerReq.file.path);
          console.log("Archivo temporal eliminado");

          // Crear el documento RAG con el contenido extraído
          console.log("Creando documento RAG...");
          const document = await this.ragService.createRagDocument(
            courseId,
            title,
            pdfContent
          );
          console.log("Documento RAG creado con ID:", document.id);

          res.status(201).json(document);
        } catch (processingError) {
          console.error("Error específico durante el procesamiento:", processingError);
          
          // Intentar eliminar el archivo temporal si existe
          if (multerReq.file && fs.existsSync(multerReq.file.path)) {
            fs.unlinkSync(multerReq.file.path);
          }
          
          // Lanzar el error para que se maneje en el catch externo
          throw processingError;
        }
      } catch (error) {
        console.error('Error al procesar el PDF:', error);
        
        // Intentar eliminar el archivo temporal si existe
        const multerReq = req as MulterRequest;
        if (multerReq.file && fs.existsSync(multerReq.file.path)) {
          fs.unlinkSync(multerReq.file.path);
        }
        
        res.status(500).json({
          error: error instanceof Error ? error.message : 'Error desconocido al procesar el PDF'
        });
      }
    });
  };

  // Método para procesar PDFs con OpenAI
  processPdfWithOpenAI = async (req: Request, res: Response): Promise<void> => {
    upload(req, res, async (err: any) => {
      try {
        if (err) {
          console.error('Error al subir el archivo:', err);
          res.status(400).json({ error: err.message });
          return;
        }

        const multerReq = req as MulterRequest;

        if (!multerReq.file) {
          res.status(400).json({ error: 'No se proporcionó ningún archivo PDF' });
          return;
        }

        console.log("Archivo recibido:", multerReq.file.originalname, "tamaño:", multerReq.file.size);

        // Obtener ID del curso para los metadatos
        const courseId = parseInt(req.body.course_id);
        if (isNaN(courseId)) {
          res.status(400).json({ error: 'Se requiere un ID de curso válido' });
          fs.unlinkSync(multerReq.file.path);
          return;
        }

        try {
          // Subir el PDF a OpenAI
          console.log("Subiendo PDF a OpenAI...");
          const openAIFile = await this.ragService.uploadPdfToOpenAI(multerReq.file.path);
          console.log("PDF subido exitosamente a OpenAI, file_id:", openAIFile.id);
          
          // Eliminar el archivo temporal
          fs.unlinkSync(multerReq.file.path);
          
          // Crear un documento RAG con la referencia al archivo
          console.log("Creando documento RAG con referencia al archivo OpenAI...");
          const document = await this.ragService.createRagDocument(
            courseId,
            req.body.title || multerReq.file.originalname,
            `[OpenAI File ID: ${openAIFile.id}] Este documento fue procesado por OpenAI y está disponible para consultas.`
          );
          
          // Devolver información sobre el archivo subido
          res.status(201).json({
            rag_document_id: document.id,
            file_id: openAIFile.id,
            filename: openAIFile.filename,
            bytes: openAIFile.bytes,
            created_at: openAIFile.created_at,
            purpose: openAIFile.purpose,
            instructions: `Para consultar este documento, haz una solicitud POST a /api/rag/answer con el siguiente cuerpo:
            {
              "courseId": ${courseId},
              "question": "Tu pregunta aquí",
              "fileId": "${openAIFile.id}"
            }`
          });
        } catch (processingError) {
          console.error("Error durante el procesamiento:", processingError);
          
          // Intentar eliminar el archivo temporal si existe
          if (multerReq.file && fs.existsSync(multerReq.file.path)) {
            fs.unlinkSync(multerReq.file.path);
          }
          
          throw processingError;
        }
      } catch (error) {
        console.error('Error al procesar el PDF con OpenAI:', error);
        
        // Intentar eliminar el archivo temporal si existe
        const multerReq = req as MulterRequest;
        if (multerReq.file && fs.existsSync(multerReq.file.path)) {
          fs.unlinkSync(multerReq.file.path);
        }
        
        res.status(500).json({
          error: error instanceof Error ? error.message : 'Error desconocido al procesar el PDF con OpenAI'
        });
      }
    });
  };

  answerQuestion = async (req: Request, res: Response): Promise<void> => {
    try {
      const { courseId, question, additionalContext, fileId } = req.body;
      
      console.log("Datos recibidos en el controlador:", {
        courseId,
        question,
        additionalContext: additionalContext || '[no proporcionado]',
        fileId: fileId || '[no proporcionado]',
        rawBody: JSON.stringify(req.body)
      });
      
      if (!courseId || !question) {
        res.status(400).json({ error: 'Se requiere courseId y question' });
        return;
      }

      const answer = await this.ragService.answerQuestion(
        parseInt(courseId), 
        question,
        additionalContext || '',
        fileId
      );
      
      // Si la respuesta tiene la estructura esperada con texto y citas
      if (answer.text) {
        res.status(200).json({ 
          answer: answer.text,
          citations: answer.citations || []
        });
      } else {
        // Si la respuesta tiene un formato diferente, devolver la respuesta completa
        res.status(200).json({ 
          raw_response: answer 
        });
      }
    } catch (error) {
      console.error('Error en el controlador RAG:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Error desconocido al procesar la consulta' 
      });
    }
  };

  getCourseContext = async (req: Request, res: Response): Promise<void> => {
    try {
      const courseId = parseInt(req.params.courseId);
      
      if (isNaN(courseId)) {
        res.status(400).json({ error: 'ID de curso inválido' });
        return;
      }

      const context = await this.ragService.generateCourseContext(courseId);
      res.status(200).json({ context });
    } catch (error) {
      console.error('Error al obtener contexto del curso:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Error desconocido al obtener el contexto' 
      });
    }
  };

  // Endpoints para gestionar documentos RAG
  createRagDocument = async (req: Request, res: Response): Promise<void> => {
    try {
      const { course_id, title, content } = req.body as CreateRagDocumentDto;
      
      if (!course_id || !title || !content) {
        res.status(400).json({ error: 'Se requiere course_id, title y content' });
        return;
      }

      const document = await this.ragService.createRagDocument(course_id, title, content);
      res.status(201).json(document);
    } catch (error) {
      console.error('Error al crear documento RAG:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Error desconocido al crear el documento' 
      });
    }
  };

  updateRagDocument = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const { title, content, active } = req.body as UpdateRagDocumentDto;
      
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID de documento inválido' });
        return;
      }

      const document = await this.ragService.updateRagDocument(id, title, content, active);
      res.status(200).json(document);
    } catch (error) {
      console.error('Error al actualizar documento RAG:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Error desconocido al actualizar el documento' 
      });
    }
  };

  deleteRagDocument = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID de documento inválido' });
        return;
      }

      await this.ragService.deleteRagDocument(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error al eliminar documento RAG:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Error desconocido al eliminar el documento' 
      });
    }
  };

  getRagDocumentsByCourse = async (req: Request, res: Response): Promise<void> => {
    try {
      const courseId = parseInt(req.params.courseId);
      
      if (isNaN(courseId)) {
        res.status(400).json({ error: 'ID de curso inválido' });
        return;
      }

      const documents = await this.ragService.getRagDocumentsByCourse(courseId);
      res.status(200).json(documents);
    } catch (error) {
      console.error('Error al obtener documentos RAG:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Error desconocido al obtener documentos' 
      });
    }
  };

  getRagDocumentById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID de documento inválido' });
        return;
      }

      const document = await this.ragService.getRagDocumentById(id);
      res.status(200).json(document);
    } catch (error) {
      console.error('Error al obtener documento RAG:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Error desconocido al obtener el documento' 
      });
    }
  };

  // Endpoints para gestionar archivos en vector store
  createVectorStoreFile = async (req: Request, res: Response): Promise<void> => {
    try {
      const { file_id, attributes, chunking_strategy } = req.body as CreateVectorStoreFileDto;
      
      if (!file_id) {
        res.status(400).json({ error: 'Se requiere file_id' });
        return;
      }

      const vectorStoreId = process.env.OPENAI_VECTOR_STORE_ID;
      if (!vectorStoreId) {
        res.status(500).json({ error: 'No se ha configurado OPENAI_VECTOR_STORE_ID en el servidor' });
        return;
      }

      const result = await this.ragService.createVectorStoreFile(
        vectorStoreId,
        file_id,
        attributes,
        chunking_strategy
      );
      
      const response: VectorStoreFileResponseDto = {
        id: result.id,
        object: result.object,
        created_at: result.created_at,
        vector_store_id: result.vector_store_id,
        file_id: result.file_id,
        status: result.status,
        attributes: result.attributes,
        chunking_strategy: result.chunking_strategy
      };
      
      res.status(201).json(response);
    } catch (error) {
      console.error('Error al crear archivo en vector store:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Error desconocido al crear el archivo en vector store' 
      });
    }
  };

  getVectorStoreFile = async (req: Request, res: Response): Promise<void> => {
    try {
      const fileId = req.params.fileId;
      
      if (!fileId) {
        res.status(400).json({ error: 'ID de archivo inválido' });
        return;
      }

      const vectorStoreId = process.env.OPENAI_VECTOR_STORE_ID;
      if (!vectorStoreId) {
        res.status(500).json({ error: 'No se ha configurado OPENAI_VECTOR_STORE_ID en el servidor' });
        return;
      }

      const result = await this.ragService.getVectorStoreFile(vectorStoreId, fileId);
      
      const response: VectorStoreFileResponseDto = {
        id: result.id,
        object: result.object,
        created_at: result.created_at,
        vector_store_id: result.vector_store_id,
        file_id: result.file_id,
        status: result.status,
        attributes: result.attributes,
        chunking_strategy: result.chunking_strategy
      };
      
      res.status(200).json(response);
    } catch (error) {
      console.error('Error al obtener archivo de vector store:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Error desconocido al obtener el archivo de vector store' 
      });
    }
  };
}
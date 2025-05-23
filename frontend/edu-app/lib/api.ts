// Define la URL base para las peticiones API
// Al usar una ruta relativa /api en lugar de una URL absoluta, se aprovechará
// el proxy configurado en next.config.mjs para evitar problemas de CORS
const API_URL = '/api';

// Tipos para autenticación
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

// Tipos para cursos
export interface Course {
  id: number;
  title: string;
  description: string;
  thumbnail_url?: string;
  color?: string;
  difficulty_level: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_published: boolean;
  estimated_duration?: number;
}

export interface CreateCourseDto {
  title: string;
  description: string;
  thumbnail_url?: string;
  color?: string;
  difficulty_level?: string;
  estimated_duration?: number;
  is_published?: boolean;
}

// Tipos para conjuntos (sets)
export interface Set {
  id: number;
  courseId: number;
  title: string;
  description: string;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSetDto {
  course_id: number;
  title: string;
  description: string;
  order_index?: number;
}

export interface UpdateSetDto {
  title?: string;
  description?: string;
  order_index?: number;
}

// Tipos para niveles (levels)
export interface Level {
  id: number;
  setId: number;
  title: string;
  description: string;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLevelDto {
  set_id: number;
  title: string;
  description: string;
  order_index?: number;
}

export interface UpdateLevelDto {
  title?: string;
  description?: string;
  order_index?: number;
}

// Tipos para preguntas (questions)
export enum QuestionType {
  TEXT = 'text',
  MULTIPLE_CHOICE = 'multiple-choice',
  CODE = 'code'
}

export interface Question {
  id: number;
  levelId: number;
  prompt: string;
  type: string;
  answer: string;
  options: string;
  explanation: string;
  difficulty: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateQuestionDto {
  level_id: number;
  prompt: string;
  type: string;
  answer: string;
  options?: string;
  explanation?: string;
  difficulty: number;
}

export interface UpdateQuestionDto {
  prompt?: string;
  type?: string;
  answer?: string;
  options?: string;
  explanation?: string;
  difficulty?: number;
}

export interface UserAnswer {
  id?: number;
  userId: string;
  questionId: number;
  userAnswer: string;
  isCorrect: boolean;
  attemptNumber?: number;
  timeTaken?: number;
  createdAt?: Date;
}

export interface CreateUserAnswerDto {
  user_id: string;
  question_id: number;
  user_answer: string;
  is_correct: boolean;
  attempt_number?: number;
  time_taken?: number;
}

// RAG (Retrieval Augmented Generation)
export interface RagQuestion {
  courseId: number;
  question: string;
  additionalContext?: string;
}

export interface RagAnswer {
  answer: string;
  citations?: any[];
}

// Documentos RAG
export interface RagDocument {
  id: number;
  course_id: number;
  title: string;
  content: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateRagDocumentDto {
  course_id: number;
  title: string;
  content: string;
}

export interface UpdateRagDocumentDto {
  title?: string;
  content?: string;
  active?: boolean;
}

export interface OpenAIPdfResponse {
  rag_document_id: number;
  file_id: string;
  filename: string;
  bytes: number;
  created_at: string;
  purpose: string;
  instructions?: string;
}

// Función para manejar errores
const handleApiError = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = 'Ha ocurrido un error desconocido';
    let errorDetails: any = null;
    try {
      // Intentar parsear el cuerpo como JSON
      errorDetails = await response.json();
      // Intentar obtener el mensaje de error de diferentes campos comunes
      errorMessage = errorDetails.error || errorDetails.message || errorDetails.detail || JSON.stringify(errorDetails);
      console.error("Detalles del error API (JSON):");
      console.error(errorDetails);
    } catch (e) {
      // Si no es JSON, intentar obtener el texto plano
      try {
        errorMessage = await response.text();
        console.error("Respuesta de error API (Texto):");
        console.error(errorMessage);
      } catch (textError) {
        // Si tampoco se puede obtener el texto, usar el status
        errorMessage = `Error en la petición: ${response.status} ${response.statusText}`;
        console.error("No se pudo obtener cuerpo del error API");
      }
    }
    // Asegurarse de que errorMessage sea una cadena
    if (typeof errorMessage !== 'string') {
      errorMessage = JSON.stringify(errorMessage);
    }
    throw new Error(errorMessage);
  }
  // Si todo está bien, parsear la respuesta JSON exitosa
  return response.json();
};

// Autenticación
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    return handleApiError(response);
  },
  
  register: async (credentials: RegisterCredentials): Promise<User> => {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    return handleApiError(response);
  },
};

// Usuarios
export const userApi = {
  getCurrentUser: async (): Promise<User | null> => {
    try {
      // Para una implementación real:
      // 1. Verificar si hay un token en localStorage
      // 2. Si hay token, hacer una petición al backend para validarlo
      // 3. Si el token es válido, devolver el usuario
      // 4. Si no hay token o es inválido, devolver null
      
      const token = localStorage.getItem('auth_token');
      if (!token) return null;
      
      // En una implementación completa, harías una petición para verificar el token
      // const response = await fetch(`${API_URL}/users/me`, {
      //   headers: { Authorization: `Bearer ${token}` }
      // });
      // return handleApiError(response);
      
      // Por ahora, simplemente devolvemos lo que hay en localStorage
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      return null;
    }
  },
};

// Cursos
export const courseApi = {
  // Obtener todos los cursos
  getAllCourses: async (published?: boolean): Promise<Course[]> => {
    const queryParams = published !== undefined ? `?published=${published}` : '';
    const response = await fetch(`${API_URL}/courses${queryParams}`);
    return handleApiError(response);
  },
  
  // Obtener un curso por ID
  getCourseById: async (id: number): Promise<Course> => {
    const response = await fetch(`${API_URL}/courses/${id}`);
    return handleApiError(response);
  },
  
  // Crear un nuevo curso (requiere autenticación)
  createCourse: async (courseData: CreateCourseDto): Promise<Course> => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No estás autenticado para crear un curso. Por favor, inicia sesión.');
    }
    
    const response = await fetch(`${API_URL}/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(courseData)
    });
    
    return handleApiError(response);
  },
  
  // Actualizar un curso existente (requiere autenticación)
  updateCourse: async (id: number, courseData: Partial<CreateCourseDto>): Promise<Course> => {
    //const token = localStorage.getItem('auth_token');
    //if (!token) {
    //  throw new Error('No estás autenticado');
    //}
    
    const response = await fetch(`${API_URL}/courses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        //'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(courseData)
    });
    
    return handleApiError(response);
  },
  
  // Eliminar un curso (requiere autenticación)
  deleteCourse: async (id: number): Promise<void> => {
    //const token = localStorage.getItem('auth_token');
    //if (!token) {
    //  throw new Error('No estás autenticado');
    //}
    
    const response = await fetch(`${API_URL}/courses/${id}`, {
      method: 'DELETE',
      headers: {
        //'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: 'Error al eliminar el curso' }));
      throw new Error(data.error || 'Error al eliminar el curso');
    }
  }
};

// Conjuntos (Sets)
export const setApi = {
  getSetsByCourse: async (courseId: number): Promise<Set[]> => {
    try {
      //const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/sets/course/${courseId}`, {
        headers: {
          //...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      
      if (!response.ok) {
        throw new Error('Error fetching sets');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error fetching sets:', error);
      throw error;
    }
  },
  
  getSet: async (id: number): Promise<Set> => {
    try {
      //const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/sets/${id}`, {
        headers: {
          //...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      
      if (!response.ok) {
        throw new Error('Error fetching set');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error fetching set:', error);
      throw error;
    }
  },
  
  createSet: async (data: CreateSetDto): Promise<Set> => {
    try {
      //const token = localStorage.getItem('token');
      
      //if (!token) {
      //  throw new Error('Authentication required');
      //}
      
      const response = await fetch(`${API_URL}/sets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          //Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Error creating set');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error creating set:', error);
      throw error;
    }
  },
  
  updateSet: async (id: number, data: UpdateSetDto): Promise<Set> => {
    try {
      //const token = localStorage.getItem('token');
      
      //if (!token) {
      //  throw new Error('Authentication required');
      //}
      
      const response = await fetch(`${API_URL}/sets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          //Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Error updating set');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error updating set:', error);
      throw error;
    }
  },
  
  deleteSet: async (id: number): Promise<void> => {
    try {
      //const token = localStorage.getItem('token');
      
      //if (!token) {
      //  throw new Error('Authentication required');
      //}
      
      const response = await fetch(`${API_URL}/sets/${id}`, {
        method: 'DELETE',
        headers: {
          //Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Error deleting set');
      }
    } catch (error) {
      console.error('Error deleting set:', error);
      throw error;
    }
  },
};

// Niveles (Levels)
export const levelApi = {
  getLevelsBySet: async (setId: number): Promise<Level[]> => {
    try {
      //const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/levels/set/${setId}`, {
        headers: {
          //...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      
      if (!response.ok) {
        throw new Error('Error fetching levels');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error fetching levels:', error);
      throw error;
    }
  },
  
  getLevel: async (id: number): Promise<Level> => {
    try {
      //const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/levels/${id}`, {
        headers: {
          //...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      
      if (!response.ok) {
        throw new Error('Error fetching level');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error fetching level:', error);
      throw error;
    }
  },
  
  createLevel: async (data: CreateLevelDto): Promise<Level> => {
    try {
      //const token = localStorage.getItem('token');
      
      //if (!token) {
      //  throw new Error('Authentication required');
      //}
      
      const response = await fetch(`${API_URL}/levels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          //Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Error creating level');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error creating level:', error);
      throw error;
    }
  },
  
  updateLevel: async (id: number, data: UpdateLevelDto): Promise<Level> => {
    try {
      //const token = localStorage.getItem('token');
      
      //if (!token) {
      //  throw new Error('Authentication required');
      //}
      
      const response = await fetch(`${API_URL}/levels/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          //Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Error updating level');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error updating level:', error);
      throw error;
    }
  },
  
  deleteLevel: async (id: number): Promise<void> => {
    try {
      //const token = localStorage.getItem('token');
      
      //if (!token) {
      //  throw new Error('Authentication required');
      //}
      
      const response = await fetch(`${API_URL}/levels/${id}`, {
        method: 'DELETE',
        headers: {
          //Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Error deleting level');
      }
    } catch (error) {
      console.error('Error deleting level:', error);
      throw error;
    }
  },
};

// Preguntas (Questions)
export const questionApi = {
  getQuestionsByLevel: async (levelId: number): Promise<Question[]> => {
    try {
      //const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/questions/level/${levelId}`, {
        headers: {
          //...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      
      if (!response.ok) {
        throw new Error('Error fetching questions');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw error;
    }
  },
  
  getQuestion: async (id: number): Promise<Question> => {
    try {
      //const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/questions/${id}`, {
        headers: {
          //...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      
      if (!response.ok) {
        throw new Error('Error fetching question');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error fetching question:', error);
      throw error;
    }
  },
  
  createQuestion: async (data: CreateQuestionDto): Promise<Question> => {
    try {
      //const token = localStorage.getItem('token');
      
      //if (!token) {
      //  throw new Error('Authentication required');
      //}
      
      const response = await fetch(`${API_URL}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          //Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Error creating question');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error creating question:', error);
      throw error;
    }
  },
  
  updateQuestion: async (id: number, data: UpdateQuestionDto): Promise<Question> => {
    try {
      //const token = localStorage.getItem('token');
      
      //if (!token) {
      //  throw new Error('Authentication required');
      //}
      
      const response = await fetch(`${API_URL}/questions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          //Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Error updating question');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error updating question:', error);
      throw error;
    }
  },
  
  deleteQuestion: async (id: number): Promise<void> => {
    try {
      //const token = localStorage.getItem('token');
      
      //if (!token) {
      //  throw new Error('Authentication required');
      //}
      
      const response = await fetch(`${API_URL}/questions/${id}`, {
        method: 'DELETE',
        headers: {
          //Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Error deleting question');
      }
    } catch (error) {
      console.error('Error deleting question:', error);
      throw error;
    }
  },
};

// User Answers
export const userAnswerApi = {
  createUserAnswer: async (data: CreateUserAnswerDto): Promise<UserAnswer> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/user-answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Error saving user answer');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error saving user answer:', error);
      throw error;
    }
  },
  
  getUserAnswers: async (userId: string): Promise<UserAnswer[]> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/user-answers/user/${userId}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      
      if (!response.ok) {
        throw new Error('Error fetching user answers');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error fetching user answers:', error);
      throw error;
    }
  },
  
  getQuestionAnswers: async (questionId: number): Promise<UserAnswer[]> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/user-answers/question/${questionId}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      
      if (!response.ok) {
        throw new Error('Error fetching question answers');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error fetching question answers:', error);
      throw error;
    }
  },
  
  getUserProgress: async (userId: string): Promise<any> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/user-answers/progress/${userId}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      
      if (!response.ok) {
        throw new Error('Error fetching user progress');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error fetching user progress:', error);
      throw error;
    }
  },
};

// RAG (Retrieval Augmented Generation)
export const ragApi = {
  answerQuestion: async (data: RagQuestion): Promise<RagAnswer> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      console.log("Enviando datos al backend:", data);
      
      const response = await fetch(`${API_URL}/rag/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Error al generar respuesta');
      }
      
      const responseData = await response.json();
      console.log("Respuesta del backend:", responseData);
      return responseData;
    } catch (error) {
      console.error('Error en consulta RAG:', error);
      throw error;
    }
  },
  
  // Método para procesar PDF con el endpoint tradicional
  processPdf: async (formData: FormData): Promise<RagDocument> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/rag/process-pdf`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          // No incluir Content-Type aquí para que el navegador lo establezca correctamente para FormData
        },
        body: formData,
      });
      
      if (!response.ok) {
        let errorMessage = 'Error al procesar el PDF';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
          console.error('Detalles del error:', errorData);
        } catch (parseError) {
          console.error('Error al analizar la respuesta de error:', parseError);
          errorMessage += `: Estado ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error al procesar PDF:', error);
      throw error;
    }
  },
  
  // Nuevo método para procesar PDF con OpenAI
  processPdfWithOpenAI: async (formData: FormData): Promise<OpenAIPdfResponse> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/rag/process-pdf-openai`, {
        method: 'POST',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
          // No incluir Content-Type aquí para que el navegador lo establezca correctamente para FormData
        },
        body: formData,
      });
      
      if (!response.ok) {
        let errorMessage = 'Error al procesar el PDF con OpenAI';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
          console.error('Detalles del error:', errorData);
        } catch (parseError) {
          console.error('Error al analizar la respuesta de error:', parseError);
          errorMessage += `: Estado ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
      
      return response.json();
    } catch (error) {
      console.error('Error al procesar PDF con OpenAI:', error);
      throw error;
    }
  },
  
  getCourseContext: async (courseId: number): Promise<{ context: string }> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/rag/context/${courseId}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener contexto del curso');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error al obtener contexto del curso:', error);
      throw error;
    }
  },

  // Documentos RAG
  getDocumentsByCourse: async (courseId: number): Promise<RagDocument[]> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/rag/documents/course/${courseId}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener documentos RAG');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error al obtener documentos RAG:', error);
      throw error;
    }
  },
  
  getDocumentById: async (id: number): Promise<RagDocument> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/rag/documents/${id}`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener documento RAG');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error al obtener documento RAG:', error);
      throw error;
    }
  },
  
  createDocument: async (data: CreateRagDocumentDto): Promise<RagDocument> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/rag/documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Error al crear documento RAG');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error al crear documento RAG:', error);
      throw error;
    }
  },
  
  updateDocument: async (id: number, data: UpdateRagDocumentDto): Promise<RagDocument> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/rag/documents/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar documento RAG');
      }
      
      return response.json();
    } catch (error) {
      console.error('Error al actualizar documento RAG:', error);
      throw error;
    }
  },
  
  deleteDocument: async (id: number): Promise<void> => {
    try {
      const token = localStorage.getItem('auth_token');
      
      const response = await fetch(`${API_URL}/rag/documents/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar documento RAG');
      }
    } catch (error) {
      console.error('Error al eliminar documento RAG:', error);
      throw error;
    }
  }
}; 
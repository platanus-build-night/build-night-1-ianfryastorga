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

// Función para manejar errores
const handleApiError = async (response: Response) => {
  if (!response.ok) {
    const data = await response.json().catch(() => ({ error: 'Error desconocido' }));
    const errorMessage = data.error || 'Ha ocurrido un error';
    throw new Error(errorMessage);
  }
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
      throw new Error('No estás autenticado');
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
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No estás autenticado');
    }
    
    const response = await fetch(`${API_URL}/courses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(courseData)
    });
    
    return handleApiError(response);
  },
  
  // Eliminar un curso (requiere autenticación)
  deleteCourse: async (id: number): Promise<void> => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('No estás autenticado');
    }
    
    const response = await fetch(`${API_URL}/courses/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const data = await response.json().catch(() => ({ error: 'Error al eliminar el curso' }));
      throw new Error(data.error || 'Error al eliminar el curso');
    }
  }
}; 
export interface CreateUserDTO {
    email: string;
    password: string;
    name?: string;
  }
  
  export interface LoginDTO {
    email: string;
    password: string;
  }
  
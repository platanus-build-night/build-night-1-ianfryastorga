export class CreateRagDocumentDto {
  course_id!: number;
  title!: string;
  content!: string;
}

export class UpdateRagDocumentDto {
  title?: string;
  content?: string;
  active?: boolean;
}

export class ProcessPdfDto {
  filePath!: string;
}

export class RagDocumentResponseDto {
  id!: number;
  course_id!: number;
  title!: string;
  content!: string;
  active!: boolean;
  created_at!: Date;
  updated_at!: Date;
}

export class CreateVectorStoreFileDto {
  file_id!: string;
  attributes?: Record<string, string | boolean | number>;
  chunking_strategy?: {
    type: string;
    size?: number;
    overlap?: number;
    [key: string]: any;
  };
}

export class VectorStoreFileResponseDto {
  id!: string;
  object: string = 'vector_store.file';
  created_at!: number;
  vector_store_id!: string;
  file_id!: string;
  status: string = 'completed';
  attributes?: Record<string, string | boolean | number>;
  chunking_strategy?: {
    type: string;
    size?: number;
    overlap?: number;
    [key: string]: any;
  };
} 
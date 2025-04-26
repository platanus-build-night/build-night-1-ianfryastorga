import { AppDataSource } from '../../config/data-source';
import { RagDocument } from './rag-document.entity';

export const RagDocumentRepo = AppDataSource.getRepository(RagDocument); 
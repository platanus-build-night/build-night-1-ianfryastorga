import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

// SQLite no soporta tipos de fecha nativos, por lo que usamos TEXT
export function SQLiteCreateDateColumn(options?: any) {
    return CreateDateColumn({
        ...options,
        type: 'text'
    });
}

export function SQLiteUpdateDateColumn(options?: any) {
    return UpdateDateColumn({
        ...options,
        type: 'text'
    });
} 
// src/types/index.ts
export interface User {
  id: number;
  name: string;
  role: 'student' | 'instructor' | 'admin';
}
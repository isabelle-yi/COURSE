
export interface User {
  id: number;
  name: string;
  email: string;
  password: string; 
  role: 'student' | 'instructor' | 'admin';
  avatar?: string;
  nickname?: string;
}

export interface Course{
  id: number;
  title:string;
  description:string;
  instructorId:number;
  category:string;
  price:number;
  coverImage?:string;
  status: 'pending' | 'approved' | 'rejected';
  createdAT: string;
  watchCount?: number;
  purchaseCount?: number;
}

export interface Order {
  id: number;
  userId: number;
  courseId: number;
  courseTitle: string;
  price:number;
  createdAt: string;
}

export interface Comment{
  id: number;
  userId: number;
  userName: string;
  courseId: number;
  content: string;
  rating: number;          
  createdAt: string;
}

export interface CartItem {
  courseId: number;
  title: string;
  instructorName: string;
  price: number;
  coverImage?: string;
}
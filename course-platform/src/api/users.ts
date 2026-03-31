import { get, post, put } from './client';
import type { User } from '../types';

export const getUsers = () =>
    get<User[]>('/users');

export const getUserById = (id: number) =>
    get<User>(`/users/${id}`);

export const loginUser =async (email: string,password: string) =>{
    const users =await get<User[]>('/users');
    return users.find(u => u.email === email && u.password === password);
}

export const updateUser = (id: number, userInfo: Partial<User>) =>
    put<User>(`/users/${id}`, userInfo);

export const registerUser = async (userData:{
    email: string;
    password: string;
    name: string;
    role:'student'|'instructor';
}) => {
    
    const users = await getUsers();
    const exists = users.find(u => u.email === userData.email);
    if(exists){
        throw new Error('该邮箱已被注册');
    }
    const newUser = {
        id: Date.now(),
        name: userData.name,
        email:userData.email,
        password: userData.password,
        role: userData.role,   
        avatar:"https//randomuser.me/api/portraits/lego/1.jpg",
        nickname: userData.name
    }
    
    return post<User>('/users', newUser);
}
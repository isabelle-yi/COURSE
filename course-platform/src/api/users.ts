import type { User } from '../types';

const BASE_URL = 'http://localhost:3000';

// 获取所有用户（直接 fetch）
export const getUsers = async (): Promise<User[]> => {
  const res = await fetch(`${BASE_URL}/users`);
  if (!res.ok) throw new Error('获取用户失败');
  return res.json();
};

// 获取单个用户
export const getUserById = async (id: number): Promise<User> => {
  const res = await fetch(`${BASE_URL}/users/${id}`);
  if (!res.ok) throw new Error('获取用户失败');
  return res.json();
};

// 登录验证
export const loginUser = async (email: string, password: string) => {
  const users = await getUsers();
  return users.find(u => u.email === email && u.password === password);
};

// 更新用户信息
export const updateUser = async (id: number, userInfo: Partial<User>) => {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userInfo),
  });
  if (!res.ok) throw new Error('更新失败');
  return res.json();
};

// 注册
export const registerUser = async (userData: {
  email: string;
  password: string;
  name: string;
  nickname: string;
  role: 'student' | 'instructor';
}) => {
  const users = await getUsers();
  const exists = users.find(u => u.email === userData.email);
  if (exists) throw new Error('该邮箱已被注册');
  
  const maxId = Math.max(...users.map(u => u.id));
  
  const newUser = {
    id: maxId + 1,
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: userData.role,
    nickname: userData.nickname,
  };
  
  const res = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newUser),
  });
  if (!res.ok) throw new Error('注册失败');
  return res.json();
};
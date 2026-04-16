import { get } from './client';
import type { Comment } from '../types';

export const getCommentsByCourse = (courseId: number) =>
  get<Comment[]>(`/comments?courseId=${courseId}`);

export const getCommentsByUser = (userId: number) =>
  get<Comment[]>(`/comments?userId=${userId}`);

export const createComment = async (comment: Omit<Comment, 'id'>) => {
  const res = await fetch('http://localhost:3000/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(comment),
  });
  if (!res.ok) throw new Error('发表评论失败');
  return res.json();
};

export const deleteComment = async (id: number) => {
  const res = await fetch(`http://localhost:3000/comments/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('删除评论失败');
};

export const updateComment = async (id: number, updates: Partial<Comment>) => {
  console.log('正在更新评论 ID:', id, '更新内容:', updates);
  
  const res = await fetch(`http://localhost:3000/comments/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  
  if (!res.ok) {
    console.error('更新评论失败:', res.status, res.statusText);
    throw new Error('更新评论失败');
  }
  
  const result = await res.json();
  console.log('更新成功，新评论:', result);
  return result;
};
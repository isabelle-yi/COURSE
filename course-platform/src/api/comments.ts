import { get } from  './client';
import type { Comment } from  '../types';

export const getCommentsByCourse = ( courseId: number) =>
    get<Comment[]>(`/comments?courseId=${courseId}`);

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

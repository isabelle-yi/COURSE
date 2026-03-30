import { get, post, del } from  './client';
import type { Comment } from  '../types';

export const getCommentsByCourse = ( courseId: number) =>
    get<Comment[]>(`/comments?courseId=${courseId}`);

export const createComment =(comment: Omit<Comment, 'id'>) =>
    post<Comment>('/comments', comment);

export const deleteComment =(id: number) =>
    del(`/comments/${id}`);
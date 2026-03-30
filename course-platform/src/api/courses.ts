import { get, post, put, del } from './client';
import type { Course } from '../types';

export const getCourses = () => 
    get<Course[]>('/courses');

export const getCourseById = (id:number) => 
    get<Course>(`/courses/${id}`);

export const searchCourses = (keyword: string) => 
    get<Course[]>(`/courses?q=${keyword}`);

export const getCoursesByInstructor = (instructorId: number) =>
    get<Course[]>(`/courses?instructorId=${instructorId}`);

export const getPendingCourses = () =>
    get<Course[]>('/courses?status=pending');

export const createCourse = (course: Omit<Course, 'id'>) =>
    post<Course>('/courses', course);

export const updateCourse = (id: number, course: Partial<Course>) =>
    put<Course>(`/courses/${id}`, course);

export const deleteCourse = (id: number) =>
    del(`/courses/${id}`);
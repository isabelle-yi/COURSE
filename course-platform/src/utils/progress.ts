export const getCourseProgress = (courseId: number): number => {
    const key =`course_progress_${courseId}`;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : 0;
};

export const setCourseProgress = (courseId: number, progress: number) => {
    const key =`course_progress_${courseId}`;
    localStorage.setItem(key ,JSON.stringify(progress));
};

export const getLastWatchedChapter = (courseId: number): { chapterIndex: number,sectionIndex: number} | null => {
    const key = `course_last_watched_${courseId}`;
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : null;
};

export const setLastWatchedChapter = (courseId: number, chapterIndex: number, sectionIndex: number) => {
    const key =`course_last_watched_${courseId}`;
    localStorage.setItem(key, JSON.stringify({ chapterIndex, sectionIndex}));
}
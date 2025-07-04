export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
  password?: string;
}

export interface Resource {
  id: string;
  name: string;
  url: string; // a path to the file
}

export interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  resources: Resource[];
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
}

export interface StudentProgress {
  studentId: string;
  courseId: string;
  completedLessons: string[];
}

export interface Reply {
  id: string;
  discussionId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  message: string;
  createdAt: string; // ISO string
}

export interface Discussion {
  id: string;
  title: string;
  message: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string; // ISO string
  replyCount: number;
}

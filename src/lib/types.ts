export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student';
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

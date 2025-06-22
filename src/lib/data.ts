import type { Course, StudentProgress, User, Module, Lesson, Resource } from './types';

// Mock Users
const users: User[] = [
  { id: '1', name: 'Admin User', email: 'admin@magellan.com', role: 'admin' },
  { id: '2', name: 'Student User', email: 'student@magellan.com', role: 'student' },
  { id: '3', name: 'Jane Doe', email: 'jane.doe@example.com', role: 'student' },
];

// Mock Course Content
const course: Course = {
  id: 'og-101',
  title: 'Master Oil & Gas Exploration: From Core to Crust',
  description: 'An in-depth journey into the world of oil and gas exploration, covering everything from geological fundamentals to advanced extraction techniques.',
  modules: [
    {
      id: 'm1',
      title: 'Module 1: Geological Fundamentals',
      lessons: [
        { id: 'l1-1', title: 'Introduction to Sedimentary Basins', videoUrl: 'https://www.youtube.com/watch?v=f47_eD-0_wA', resources: [{ id: 'r1', name: 'Lesson 1 Script.pdf', url: '#' }] },
        { id: 'l1-2', title: 'Source Rock and Hydrocarbon Generation', videoUrl: 'https://placehold.co/1920x1080', resources: [{ id: 'r2', name: 'Source Rock Data.zip', url: '#' }] },
      ],
    },
    {
      id: 'm2',
      title: 'Module 2: Seismic Interpretation',
      lessons: [
        { id: 'l2-1', title: 'Basics of Seismic Reflection', videoUrl: 'https://placehold.co/1920x1080', resources: [] },
        { id: 'l2-2', title: 'Structural Traps and Fault Analysis', videoUrl: 'https://placehold.co/1920x1080', resources: [{ id: 'r3', name: 'Trap Analysis Worksheet.pdf', url: '#' }, { id: 'r4', name: 'Example Seismic Data.csv', url: '#' }] },
        { id: 'l2-3', title: 'Stratigraphic Traps', videoUrl: 'https://placehold.co/1920x1080', resources: [] },
      ],
    },
    {
        id: 'm3',
        title: 'Module 3: Well Logging & Formation Evaluation',
        lessons: [
          { id: 'l3-1', title: 'Introduction to Well Logging', videoUrl: 'https://placehold.co/1920x1080', resources: [{id: 'r5', name: 'Logging Tools Overview.pdf', url: '#'}] },
          { id: 'l3-2', title: 'Reservoir Characterization', videoUrl: 'https://placehold.co/1920x1080', resources: [] },
        ],
      },
  ],
};

// Mock Student Progress
let studentProgress: StudentProgress[] = [
    { studentId: '2', courseId: 'og-101', completedLessons: ['l1-1'] },
    { studentId: '3', courseId: 'og-101', completedLessons: [] },
];

// Data Access Functions
export async function findUserByEmail(email: string): Promise<User | undefined> {
  return users.find((user) => user.email === email);
}

export async function findUserById(id: string): Promise<User | undefined> {
  return users.find((user) => user.id === id);
}

export async function getAllUsers(): Promise<User[]> {
    return users;
}

export async function getCourse(id: string): Promise<Course | undefined> {
  return course.id === id ? course : undefined;
}

export async function getStudentProgress(studentId: string, courseId: string): Promise<StudentProgress | undefined> {
  return studentProgress.find(p => p.studentId === studentId && p.courseId === courseId);
}

export async function updateStudentProgress(studentId: string, courseId: string, lessonId: string): Promise<StudentProgress> {
    const progressIndex = studentProgress.findIndex(p => p.studentId === studentId && p.courseId === courseId);
    if (progressIndex > -1) {
        const progress = studentProgress[progressIndex];
        if (!progress.completedLessons.includes(lessonId)) {
            progress.completedLessons.push(lessonId);
        }
        return progress;
    }
    const newProgress: StudentProgress = { studentId, courseId, completedLessons: [lessonId] };
    studentProgress.push(newProgress);
    return newProgress;
}

export async function createStudent(name: string, email: string): Promise<User> {
    const newUser: User = {
        id: (users.length + 1).toString(),
        name,
        email,
        role: 'student',
    };
    users.push(newUser);
    studentProgress.push({ studentId: newUser.id, courseId: 'og-101', completedLessons: [] });
    return newUser;
}

export async function updateModule(moduleId: string, newTitle: string): Promise<Module | undefined> {
    for (const module of course.modules) {
        if (module.id === moduleId) {
            module.title = newTitle;
            return module;
        }
    }
    return undefined;
}

export async function updateLesson(
    lessonId: string, 
    updates: { 
        title: string;
        videoUrl: string;
        resourcesToDelete?: string[];
        newResources?: { name: string }[];
    }
): Promise<Lesson | undefined> {
    for (const module of course.modules) {
        const lesson = module.lessons.find(l => l.id === lessonId);
        if (lesson) {
            lesson.title = updates.title;
            lesson.videoUrl = updates.videoUrl;

            // Delete resources
            if (updates.resourcesToDelete && updates.resourcesToDelete.length > 0) {
                lesson.resources = lesson.resources.filter(
                    r => !updates.resourcesToDelete?.includes(r.id)
                );
            }

            // Add new resources
            if (updates.newResources && updates.newResources.length > 0) {
                const newResourceObjects: Resource[] = updates.newResources.map((res, index) => ({
                    id: `r${Date.now()}${index}`, // simple unique ID for mock data
                    name: res.name,
                    url: '#', // Placeholder URL for mock data
                }));
                lesson.resources.push(...newResourceObjects);
            }

            return lesson;
        }
    }
    return undefined;
}

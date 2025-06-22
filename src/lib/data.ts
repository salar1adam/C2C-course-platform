import 'server-only';
import { db } from './firebase';
import type { Course, StudentProgress, User, Module, Lesson, Resource } from './types';

// ##################################################################
// # Database Seeding Logic
// ##################################################################

async function seedDatabase() {
  console.log('Database is empty. Seeding with initial data...');
  
  const usersCollection = db.collection('users');
  const coursesCollection = db.collection('courses');
  const progressCollection = db.collection('studentProgress');

  // Seed Users
  const usersData: User[] = [
    { id: '1', name: 'Admin User', email: 'admin@magellan.com', role: 'admin' },
    { id: '2', name: 'Student User', email: 'student@magellan.com', role: 'student' },
    { id: '3', name: 'Jane Doe', email: 'jane.doe@example.com', role: 'student' },
  ];
  for (const user of usersData) {
    await usersCollection.doc(user.id).set(user);
  }
  console.log('Seeded users.');

  // Seed Course
  const courseData: Course = {
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
  await coursesCollection.doc(courseData.id).set(courseData);
  console.log('Seeded course.');

  // Seed Progress
  const progressData: StudentProgress[] = [
      { studentId: '2', courseId: 'og-101', completedLessons: ['l1-1'] },
      { studentId: '3', courseId: 'og-101', completedLessons: [] },
  ];
  for (const progress of progressData) {
      await progressCollection.doc(`${progress.studentId}_${progress.courseId}`).set(progress);
  }
  console.log('Seeded student progress.');
  console.log('Database seeding complete.');
}


// ##################################################################
// # Data Access Functions
// ##################################################################

export async function getAllUsers(): Promise<User[]> {
    const snapshot = await db.collection('users').get();
    if (snapshot.empty) {
        // If the DB is empty, this is the first run. Seed it.
        await seedDatabase();
        const newSnapshot = await db.collection('users').get();
        return newSnapshot.docs.map(doc => doc.data() as User);
    }
    return snapshot.docs.map(doc => doc.data() as User);
}

export async function getCourse(id: string): Promise<Course | undefined> {
    const docRef = db.collection('courses').doc(id);
    let doc = await docRef.get();
    if (!doc.exists) {
        // This might be the first run, let's try seeding the database
        await seedDatabase();
        doc = await docRef.get();
        if (!doc.exists) {
            return undefined;
        }
    }
    return doc.data() as Course;
}

export async function getStudentProgress(studentId: string, courseId: string): Promise<StudentProgress | undefined> {
    const docId = `${studentId}_${courseId}`;
    const doc = await db.collection('studentProgress').doc(docId).get();
    return doc.exists ? doc.data() as StudentProgress : undefined;
}

export async function updateStudentProgress(studentId: string, courseId: string, lessonId: string): Promise<StudentProgress> {
    const docId = `${studentId}_${courseId}`;
    const docRef = db.collection('studentProgress').doc(docId);
    const doc = await docRef.get();

    if (doc.exists) {
        const progress = doc.data() as StudentProgress;
        if (!progress.completedLessons.includes(lessonId)) {
            progress.completedLessons.push(lessonId);
            await docRef.update({ completedLessons: progress.completedLessons });
        }
        return progress;
    } else {
        const newProgress: StudentProgress = { studentId, courseId, completedLessons: [lessonId] };
        await docRef.set(newProgress);
        return newProgress;
    }
}

export async function createStudent(name: string, email: string): Promise<User> {
    const usersCollection = db.collection('users');
    const existingUser = await usersCollection.where('email', '==', email).get();
    if (!existingUser.empty) {
        throw new Error('User with this email already exists.');
    }

    const newUserId = db.collection('users').doc().id;
    const newUser: User = {
        id: newUserId,
        name,
        email,
        role: 'student',
    };
    await usersCollection.doc(newUserId).set(newUser);
    
    // Also create their progress doc
    const courseId = 'og-101';
    const progressDocId = `${newUserId}_${courseId}`;
    const newProgress: StudentProgress = { studentId: newUserId, courseId, completedLessons: [] };
    await db.collection('studentProgress').doc(progressDocId).set(newProgress);

    return newUser;
}

export async function updateModule(courseId: string, moduleId: string, newTitle: string): Promise<Module> {
    const courseRef = db.collection('courses').doc(courseId);
    const courseDoc = await courseRef.get();
    if (!courseDoc.exists) {
        throw new Error("Course not found");
    }

    const courseData = courseDoc.data() as Course;
    const moduleIndex = courseData.modules.findIndex(m => m.id === moduleId);

    if (moduleIndex === -1) {
        throw new Error("Module not found");
    }

    courseData.modules[moduleIndex].title = newTitle;
    await courseRef.set(courseData);
    return courseData.modules[moduleIndex];
}

export async function updateLesson(
    courseId: string,
    lessonId: string, 
    updates: { 
        title: string;
        videoUrl: string;
        resourcesToDelete?: string[];
        newResources?: { name: string }[];
    }
): Promise<Lesson> {
    const courseRef = db.collection('courses').doc(courseId);
    const courseDoc = await courseRef.get();
    if (!courseDoc.exists) {
        throw new Error("Course not found");
    }

    const courseData = courseDoc.data() as Course;
    let targetLesson: Lesson | null = null;

    for (const module of courseData.modules) {
        const lessonIndex = module.lessons.findIndex(l => l.id === lessonId);
        if (lessonIndex !== -1) {
            const lesson = module.lessons[lessonIndex];
            
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
                    id: `r${Date.now()}${index}`,
                    name: res.name,
                    url: '#', // In a real app, this would be a URL from a file upload service
                }));
                lesson.resources.push(...newResourceObjects);
            }
            
            targetLesson = lesson;
            break;
        }
    }

    if (!targetLesson) {
        throw new Error("Lesson not found");
    }

    await courseRef.set(courseData);
    return targetLesson;
}

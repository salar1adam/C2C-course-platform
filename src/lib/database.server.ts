
import admin from 'firebase-admin';
import type { Course, StudentProgress, User, Module, Lesson } from './types';

// ##################################################################
// # Firebase Initialization
// ##################################################################

if (!admin.apps.length) {
    try {
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

        if (!process.env.FIREBASE_PROJECT_ID || !privateKey || !process.env.FIREBASE_CLIENT_EMAIL) {
            throw new Error('Firebase environment variables are not set. Please check your .env file.');
        }

        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                privateKey: privateKey,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            }),
        });
        console.log('Firebase Admin SDK initialized successfully.');
    } catch (error: any) {
        console.error('Firebase Admin SDK initialization error:', error.message);
    }
}

export const db = admin.firestore();
export const auth = admin.auth();


// ##################################################################
// # Database Seeding Logic
// ##################################################################

// A flag to ensure we only check for seeding once per server instance lifetime.
let isSeedingChecked = false;

async function ensureDatabaseSeeded() {
    if (isSeedingChecked) return;

    const usersCollection = db.collection('users');
    const allUsersSnapshot = await usersCollection.limit(1).get();
    
    if (allUsersSnapshot.empty) {
        await seedDatabase();
    }
    isSeedingChecked = true;
}

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
        id: 'm1a',
        title: 'Module 1A: Fundamentals of Petroleum Geoscience',
        lessons: [
          { id: 'l1-1', title: 'Upstream Sector Overview', videoUrl: 'https://placehold.co/1920x1080', resources: [] },
          { id: 'l1-2', title: 'Key Geoscience Roles in E&P', videoUrl: 'https://placehold.co/1920x1080', resources: [] },
          { id: 'l1-3', title: 'Common Geoscience Workflows and Data Types', videoUrl: 'https://placehold.co/1920x1080', resources: [] },
          { id: 'l1-4', title: 'Petroleum System Key Terminology: Trap, Seal, Reservoir, Source, Migration', videoUrl: 'https://placehold.co/1920x1080', resources: [] },
          { id: 'l1-5', title: 'Plate Boundaries and Basin-Forming Mechanisms', videoUrl: 'https://placehold.co/1920x1080', resources: [] },
          { id: 'l1-6', title: 'Basin Classification: Rift, Passive Margin, Foreland, Intracratonic', videoUrl: 'https://placehold.co/1920x1080', resources: [] },
          { id: 'l1-7', title: 'Basin-Fill Architecture and Tectono-Stratigraphic Evolution', videoUrl: 'https://placehold.co/1920x1080', resources: [] },
          { id: 'l1-8', title: 'Tectonics, Heat Flow, and Hydrocarbon Maturation Relationships', videoUrl: 'https://placehold.co/1920x1080', resources: [] },
          { id: 'l1-9', title: 'Depositional Environments: Fluvial, Deltaic, Turbidite, Carbonate', videoUrl: 'https://placehold.co/1920x1080', resources: [] },
          { id: 'l1-10', title: 'Facies Models and Vertical/Lateral Facies Changes', videoUrl: 'https://placehold.co/1920x1080', resources: [] },
          { id: 'l1-11', title: 'Sequence Stratigraphy: Systems Tracts, Boundaries, Parasequences', videoUrl: 'https://placehold.co/1920x1080', resources: [] },
        ],
      },
      {
        id: 'm1b',
        title: 'Module 1B: Geological Interpretation & Analysis',
        lessons: [
          { id: 'l1-12', title: 'Sedimentary Log and Core Interpretation', videoUrl: 'https://placehold.co/1920x1080', resources: [] },
          { id: 'l1-13', title: 'Fault Types and Fold Structures Analysis', videoUrl: 'https://placehold.co/1920x1080', resources: [] },
          { id: 'l1-14', title: 'Trap Classification: Structural vs. Stratigraphic', videoUrl: 'https://placehold.co/1920x1080', resources: [] },
          { id: 'l1-15', title: 'Structural Styles in Different Tectonic Settings', videoUrl: 'https://placehold.co/1920x1080', resources: [] },
          { id: 'l1-16', title: 'Structural Map and Cross-Section Interpretation', videoUrl: 'https://placehold.co/1920x1080', resources: [] },
          { id: 'l1-17', title: 'Kerogen Types and Associated Depositional Environments', videoUrl: 'https://placehold.co/1920x1080', resources: [] },
          { id: 'l1-18', title: 'Rock-Eval Pyrolysis, TOC, and HI vs. Tmax Plot Analysis', videoUrl: 'https://placehold.co/1920x1080', resources: [] },
          { id: 'l1-19', title: 'Biomarker Analysis and Geochemical Correlations', videoUrl: 'https://placehold.co/1920x1080', resources: [] },
          { id: 'l1-20', title: 'Maturity Indicators: Vitrinite Reflectance & Pyrolysis Tmax', videoUrl: 'https://placehold.co/1920x1080', resources: [] },
        ],
      },
      {
        id: 'm2',
        title: 'Module 2: Mastering Exploration Techniques',
        lessons: [
          { id: 'm2-placeholder', title: 'Content will be available next week.', videoUrl: '', resources: [] },
        ],
      },
      {
        id: 'm3',
        title: 'Module 3: Reservoir Characterization, Modeling, and Forecasting',
        lessons: [
          { id: 'm3-placeholder', title: 'Content will be available in 2 weeks.', videoUrl: '', resources: [] },
        ],
      },
      {
        id: 'm4',
        title: 'Module 4: Advanced Field Development and Economics',
        lessons: [
          { id: 'm4-placeholder', title: 'Content will be available in 3 weeks.', videoUrl: '', resources: [] },
        ],
      },
      {
        id: 'm-capstone',
        title: 'Capstone Series: Apply What You’ve Learned',
        lessons: [
          { id: 'capstone-placeholder', title: 'Content will be available in 4 weeks.', videoUrl: '', resources: [] },
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
// # User Data Access
// ##################################################################

export async function findUserByEmail(email: string): Promise<User | undefined> {
    await ensureDatabaseSeeded();
    const snapshot = await db.collection('users').where('email', '==', email).limit(1).get();
    if (snapshot.empty) {
        return undefined;
    }
    return snapshot.docs[0].data() as User;
}

export async function findUserById(id: string): Promise<User | undefined> {
    await ensureDatabaseSeeded();
    const doc = await db.collection('users').doc(id).get();
    return doc.exists ? doc.data() as User : undefined;
}

export async function getAllUsers(): Promise<User[]> {
    await ensureDatabaseSeeded();
    const snapshot = await db.collection('users').get();
    return snapshot.docs.map(doc => doc.data() as User);
}

export async function createStudent(name: string, email: string): Promise<User> {
    await ensureDatabaseSeeded();
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
    
    const courseId = 'og-101';
    const progressDocId = `${newUserId}_${courseId}`;
    const newProgress: StudentProgress = { studentId: newUserId, courseId, completedLessons: [] };
    await db.collection('studentProgress').doc(progressDocId).set(newProgress);

    return newUser;
}


// ##################################################################
// # Course Data Access
// ##################################################################

export async function getCourse(id: string): Promise<Course | undefined> {
    await ensureDatabaseSeeded();
    const docRef = db.collection('courses').doc(id);
    const doc = await docRef.get();
    return doc.exists ? doc.data() as Course : undefined;
}

export async function getStudentProgress(studentId: string, courseId: string): Promise<StudentProgress | undefined> {
    await ensureDatabaseSeeded();
    const docId = `${studentId}_${courseId}`;
    const doc = await db.collection('studentProgress').doc(docId).get();
    return doc.exists ? doc.data() as StudentProgress : undefined;
}

export async function updateStudentProgress(studentId: string, courseId: string, lessonId: string): Promise<StudentProgress> {
    await ensureDatabaseSeeded();
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


export async function updateModule(courseId: string, moduleId: string, newTitle: string): Promise<Module> {
    await ensureDatabaseSeeded();
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
    }
): Promise<Lesson> {
    await ensureDatabaseSeeded();
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

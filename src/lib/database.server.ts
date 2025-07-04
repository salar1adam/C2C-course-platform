
import admin from 'firebase-admin';
import type { Course, StudentProgress, User, Module, Lesson, Discussion, Reply } from './types';

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
// # Database Seeding & Syncing Logic
// ##################################################################

let isDataSynced = false;

export async function ensureDataSynced() {
    if (isDataSynced) return;
    
    // Seed users first
    await seedUsersAndProgress();

    // Then, seed the initial course content only if it's not already there
    await seedInitialCourseContent();

    isDataSynced = true;
}

async function seedUsersAndProgress() {
  const usersCollection = db.collection('users');
  const allUsersSnapshot = await usersCollection.limit(1).get();

  if (allUsersSnapshot.empty) {
    console.log('Users collection is empty. Seeding initial user data...');
    const usersData: User[] = [
      { id: 'admin-salar', name: 'salar', email: 'salar', role: 'admin', password: '123456' },
      { id: 'student-1', name: 's.n1', email: 's.n1', role: 'student', password: 'OM}xILL%ihn]j7vSPI9K' },
      { id: 'student-2', name: 's.n2', email: 's.n2', role: 'student', password: '(\'D-YmTZ{Q#a$~3f\'E}c' },
      { id: 'student-3', name: 's.n3', email: 's.n3', role: 'student', password: 'a=TUkb(cEJ,8m4YQ3=fH' },
      { id: 'student-4', name: 's.n4', email: 's.n4', role: 'student', password: 'SU=!F>hd6F>z2.DL£9;' },
      { id: 'student-5', name: 's.n5', email: 's.n5', role: 'student', password: 'Nu<V7%@b;wJBXrR3\'91R' },
      { id: 'student-6', name: 's.n6', email: 's.n6', role: 'student', password: 'I2BD[E/Q<<55SP\':gxr' },
      { id: 'student-7', name: 's.n7', email: 's.n7', role: 'student', password: 'e#5aga2QGL}EkE1j77X]' },
      { id: 'student-8', name: 's.n8', email: 's.n8', role: 'student', password: '6[!`j|0CKuuz\'c(-*£4g' },
      { id: 'student-9', name: 's.n9', email: 's.n9', role: 'student', password: '}z7G[ef1d3J9uG3"}|&a' },
      { id: 'student-10', name: 's.n10', email: 's.n10', role: 'student', password: '9\\2gztdK[4z_#rz*`I68' }
    ];
    const userPromises = usersData.map(user => usersCollection.doc(user.id).set(user));
    await Promise.all(userPromises);
    console.log('Seeded users.');

    const progressCollection = db.collection('studentProgress');
    const studentIds = usersData.filter(u => u.role === 'student').map(u => u.id);
    const progressPromises = studentIds.map(studentId => {
        const progressDocRef = progressCollection.doc(`${studentId}_og-101`);
        return progressDocRef.set({ studentId: studentId, courseId: 'og-101', completedLessons: [] });
    });
    await Promise.all(progressPromises);
    console.log('Seeded initial student progress.');
  }
}


async function seedInitialCourseContent() {
  const courseRef = db.collection('courses').doc('og-101');
  const courseDoc = await courseRef.get();

  if (courseDoc.exists) {
    console.log('Course content already exists in Firestore. Skipping seed.');
    return;
  }

  console.log('Course content not found. Seeding initial course data...');
  const courseDataInCode: Course = {
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
          { id: 'l2-1', title: 'Content will be available next week.', videoUrl: '', resources: [] },
        ],
      },
      {
        id: 'm3',
        title: 'Module 3: Reservoir Characterization, Modeling, and Forecasting',
        lessons: [
          { id: 'l3-1', title: 'Content will be available in 2 weeks.', videoUrl: '', resources: [] },
        ],
      },
      {
        id: 'm4',
        title: 'Module 4: Advanced Field Development and Economics',
        lessons: [
          { id: 'l4-1', title: 'Content will be available in 3 weeks.', videoUrl: '', resources: [] },
        ],
      },
      {
        id: 'm-capstone',
        title: 'Capstone Series: Apply What You’ve Learned',
        lessons: [
          { id: 'c-1', title: 'Content will be available in 4 weeks.', videoUrl: '', resources: [] },
        ],
      },
    ],
  };
  await courseRef.set(courseDataInCode);
  console.log('Course content seeded.');
}

// ##################################################################
// # User Data Access
// ##################################################################

export async function getAllUsers(): Promise<User[]> {
    await ensureDataSynced();
    const snapshot = await db.collection('users').orderBy('name').get();
    return snapshot.docs.map(doc => doc.data() as User);
}


// ##################################################################
// # Course Data Access
// ##################################################################

export async function getCourse(id: string): Promise<Course | undefined> {
    await ensureDataSynced();
    const docRef = db.collection('courses').doc(id);
    const doc = await docRef.get();
    return doc.exists ? doc.data() as Course : undefined;
}

export async function getStudentProgress(studentId: string, courseId: string): Promise<StudentProgress | undefined> {
    await ensureDataSynced();
    const docId = `${studentId}_${courseId}`;
    const doc = await db.collection('studentProgress').doc(docId).get();
    return doc.exists ? doc.data() as StudentProgress : undefined;
}

export async function updateStudentProgress(studentId: string, courseId: string, lessonId: string): Promise<StudentProgress> {
    await ensureDataSynced();
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
    await ensureDataSynced();
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
    await ensureDataSynced();
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

// ##################################################################
// # Discussion Data Access
// ##################################################################

export async function createDiscussion(
    title: string,
    message: string,
    author: User
): Promise<void> {
    await ensureDataSynced();
    const discussionRef = db.collection('discussions').doc();
    const newDiscussion: Discussion = {
        id: discussionRef.id,
        title,
        message,
        authorId: author.id,
        authorName: author.name,
        authorAvatar: `https://placehold.co/100x100.png`, 
        createdAt: new Date().toISOString(),
        replyCount: 0,
    };

    await discussionRef.set(newDiscussion);
}

export async function getAllDiscussions(): Promise<Discussion[]> {
    await ensureDataSynced();
    const snapshot = await db.collection('discussions').orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => doc.data() as Discussion);
}

export async function getDiscussionById(discussionId: string): Promise<Discussion | undefined> {
    await ensureDataSynced();
    const doc = await db.collection('discussions').doc(discussionId).get();
    return doc.exists ? doc.data() as Discussion : undefined;
}

export async function getRepliesForDiscussion(discussionId: string): Promise<Reply[]> {
    await ensureDataSynced();
    const snapshot = await db.collection('discussions').doc(discussionId).collection('replies').orderBy('createdAt', 'asc').get();
    return snapshot.docs.map(doc => doc.data() as Reply);
}

export async function createReply(discussionId: string, message: string, author: User): Promise<void> {
    await ensureDataSynced();
    const discussionRef = db.collection('discussions').doc(discussionId);
    const replyRef = discussionRef.collection('replies').doc();

    const newReply: Reply = {
        id: replyRef.id,
        discussionId: discussionId,
        authorId: author.id,
        authorName: author.name,
        authorAvatar: `https://placehold.co/100x100.png`,
        message: message,
        createdAt: new Date().toISOString(),
    };
    
    await db.runTransaction(async (transaction) => {
        const discussionDoc = await transaction.get(discussionRef);
        if (!discussionDoc.exists) {
            throw "Discussion not found";
        }

        transaction.set(replyRef, newReply);
        transaction.update(discussionRef, { replyCount: admin.firestore.FieldValue.increment(1) });
    });
}

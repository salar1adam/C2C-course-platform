import admin from 'firebase-admin';

// This is a server-only module.
// It is used to initialize the Firebase Admin SDK.

if (!admin.apps.length) {
    try {
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

        if (!process.env.FIREBASE_PROJECT_ID || !privateKey || !process.env.FIREBASE_CLIENT_EMAIL) {
            throw new Error('Firebase environment variables are not set. Please check your .env.local file.');
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
        // We don't want to throw here as it might break the build process
        // where env vars are not available. The error will be thrown at runtime
        // when a firebase function is called.
    }
}

export const db = admin.firestore();
export const auth = admin.auth();

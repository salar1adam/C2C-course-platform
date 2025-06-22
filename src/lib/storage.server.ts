
'use server';

import admin from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import type { File } from 'buffer';

// Ensure Firebase is initialized
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
    } catch (error: any) {
        if (!/already exists/.test(error.message)) {
            console.error('Firebase Admin SDK initialization error in storage.server.ts:', error.message);
        }
    }
}

const bucket = getStorage().bucket(`gs://${process.env.FIREBASE_PROJECT_ID}.appspot.com`);

export async function uploadFile(file: File): Promise<string> {
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    const fileUpload = bucket.file(fileName);

    await fileUpload.save(fileBuffer, {
        metadata: {
            contentType: file.type,
        },
    });

    // Make the file publicly readable
    await fileUpload.makePublic();

    // Return the public URL
    return fileUpload.publicUrl();
}

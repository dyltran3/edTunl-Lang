import { adminAuth, adminDb } from '@/lib/firebase/admin';

export async function ensureAdminAccountExists() {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.log('Seed notice: ADMIN_EMAIL or ADMIN_PASSWORD not set. Skipping automated admin creation.');
    return;
  }

  if (!adminAuth || !adminDb) {
    console.log('Seed notice: Firebase Admin SDK not initialized. Skipping automated admin creation.');
    return;
  }

  try {
    let userRecord;
    try {
      userRecord = await adminAuth.getUserByEmail(adminEmail);
      console.log(`Admin user already exists (${userRecord.uid}). Ensuring admin role in Firestore.`);
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        userRecord = await adminAuth.createUser({
          email: adminEmail,
          password: adminPassword,
          displayName: 'Administrator',
          emailVerified: true,
        });
        console.log(`Successfully created default admin user: ${userRecord.email}`);
      } else {
        throw err;
      }
    }

    // Update or set firestore document for admin
    const userRef = adminDb.collection('users').doc(userRecord.uid);
    await userRef.set(
      {
        uid: userRecord.uid,
        email: adminEmail,
        displayName: 'Administrator',
        role: 'admin',
        createdAt: new Date().toISOString(),
        targetLanguages: ['en', 'zh-CN'],
        streakCount: 1,
        lastActiveDate: new Date().toISOString().split('T')[0],
        totalVocabularyCount: 0,
        totalStudyTimeMinutes: 0,
        completedLessonsCount: 0,
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error seeding admin account:', error);
  }
}

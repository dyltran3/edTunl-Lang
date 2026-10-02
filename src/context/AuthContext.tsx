'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '@/lib/firebase/client';
import { UserProfile } from '@/types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (e: string, p: string) => Promise<void>;
  signUpWithEmail: (e: string, p: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserLanguages: (languages: string[]) => Promise<void>;
  recordActivity: (vocabCount?: number, minutes?: number) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@edtunl.lang';

  const fetchOrCreateProfile = async (firebaseUser: User): Promise<UserProfile> => {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const snap = await getDoc(userRef);

    const todayStr = new Date().toISOString().split('T')[0];
    const isAdminUser = firebaseUser.email === adminEmail;

    if (snap.exists()) {
      const data = snap.data() as UserProfile;
      // Ensure role admin if matching admin email
      if (isAdminUser && data.role !== 'admin') {
        await updateDoc(userRef, { role: 'admin' });
        data.role = 'admin';
      }
      setUserProfile(data);
      return data;
    } else {
      const newProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Học viên',
        avatarUrl: firebaseUser.photoURL || undefined,
        targetLanguages: ['en'],
        role: isAdminUser ? 'admin' : 'user',
        createdAt: new Date().toISOString(),
        streakCount: 0,
        lastActiveDate: todayStr,
        totalVocabularyCount: 0,
        totalStudyTimeMinutes: 0,
        completedLessonsCount: 0,
        settings: {
          uiLanguage: 'vi',
          notifications: true,
        },
      };
      await setDoc(userRef, newProfile);
      setUserProfile(newProfile);
      return newProfile;
    }
  };

  const refreshProfile = async () => {
    if (!user) return;
    await fetchOrCreateProfile(user);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          await fetchOrCreateProfile(currentUser);
        } catch (err) {
          console.warn('Error fetching profile:', err);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const res = await signInWithPopup(auth, googleProvider);
    if (res.user) {
      await fetchOrCreateProfile(res.user);
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    const res = await signInWithEmailAndPassword(auth, email, pass);
    if (res.user) {
      await fetchOrCreateProfile(res.user);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    if (res.user) {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser).catch(() => {});
      }
      const todayStr = new Date().toISOString().split('T')[0];
      const newProfile: UserProfile = {
        uid: res.user.uid,
        email: email,
        displayName: name || email.split('@')[0],
        targetLanguages: ['en'],
        role: email === adminEmail ? 'admin' : 'user',
        createdAt: new Date().toISOString(),
        streakCount: 0,
        lastActiveDate: todayStr,
        totalVocabularyCount: 0,
        totalStudyTimeMinutes: 0,
        completedLessonsCount: 0,
      };
      await setDoc(doc(db, 'users', res.user.uid), newProfile);
      setUserProfile(newProfile);
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
  };

  const updateUserLanguages = async (languages: string[]) => {
    if (!user || !userProfile) return;
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { targetLanguages: languages });
    setUserProfile({ ...userProfile, targetLanguages: languages });
  };

  const recordActivity = async (vocabCount = 0, minutes = 5) => {
    if (!user || !userProfile) return;
    const todayStr = new Date().toISOString().split('T')[0];
    const userRef = doc(db, 'users', user.uid);

    let newStreak = userProfile.streakCount;
    if (userProfile.lastActiveDate !== todayStr) {
      const lastDate = new Date(userProfile.lastActiveDate);
      const today = new Date(todayStr);
      const diffDays = Math.round((today.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

      if (diffDays === 1) {
        newStreak += 1;
      } else if (diffDays > 1) {
        newStreak = 1;
      } else if (newStreak === 0) {
        newStreak = 1;
      }
    } else if (newStreak === 0) {
      newStreak = 1;
    }

    const updatedProfile: Partial<UserProfile> = {
      streakCount: newStreak,
      lastActiveDate: todayStr,
      totalVocabularyCount: (userProfile.totalVocabularyCount || 0) + vocabCount,
      totalStudyTimeMinutes: (userProfile.totalStudyTimeMinutes || 0) + minutes,
      completedLessonsCount: (userProfile.completedLessonsCount || 0) + (vocabCount > 0 ? 1 : 0),
    };

    await updateDoc(userRef, updatedProfile);

    // Write daily activity log for charts
    const dailyRecordRef = doc(db, 'daily_records', `${user.uid}_${todayStr}`);
    const recordSnap = await getDoc(dailyRecordRef);

    if (recordSnap.exists()) {
      const data = recordSnap.data();
      await updateDoc(dailyRecordRef, {
        vocabularyLearned: (data.vocabularyLearned || 0) + vocabCount,
        studyTimeMinutes: (data.studyTimeMinutes || 0) + minutes,
        lessonsCompleted: (data.lessonsCompleted || 0) + 1,
      });
    } else {
      await setDoc(dailyRecordRef, {
        id: `${user.uid}_${todayStr}`,
        userId: user.uid,
        date: todayStr,
        vocabularyLearned: vocabCount,
        studyTimeMinutes: minutes,
        lessonsCompleted: 1,
        exercisesCompleted: 1,
        streakActive: true,
      });
    }

    setUserProfile({ ...userProfile, ...updatedProfile } as UserProfile);
  };

  const isAdmin = userProfile?.role === 'admin' || user?.email === adminEmail;

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        isAdmin,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        logout,
        resetPassword,
        updateUserLanguages,
        recordActivity,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

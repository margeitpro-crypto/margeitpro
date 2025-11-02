import React, { useContext, createContext, useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';

const AuthContext = createContext<{
  googleSignIn: () => void;
  logOut: () => void;
  user: FirebaseUser | null;
} | null>(null);

export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    
    try {
      // Try popup first, fallback to redirect if it fails
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.log('Popup failed, trying redirect:', error.code);
      if (error.code === 'auth/popup-blocked' || error.code === 'auth/cancelled-popup-request') {
        await signInWithRedirect(auth, provider);
      } else {
        throw error;
      }
    }
  };

  const logOut = () => {
    signOut(auth);
  };

  useEffect(() => {
    // Handle redirect result
    getRedirectResult(auth).catch(console.error);
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      console.log('User', currentUser);

      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: currentUser.uid,
            email: currentUser.email,
            name: currentUser.displayName,
            role: currentUser.email === "margeitpro@gmail.com" ? "Admin" : "User",
            status: 'Active',
            joinDate: new Date().toISOString().split('T')[0],
            accessPage: currentUser.email === "margeitpro@gmail.com"
                ? 'admin-control-center,system-analytics,form-management,user-dashboard,marge-it,templates,merge-logs,notifications,billing,settings,help'
                : 'user-dashboard,marge-it,templates,merge-logs,notifications,billing,settings,help',
            plan: currentUser.email === "margeitpro@gmail.com" ? 'Enterprise' : 'Free',
            hasProAccess: currentUser.email === "margeitpro@gmail.com",
            profilePictureUrl: currentUser.photoURL,
            createdAt: new Date(),
          });
          console.log("✅ User created in Firestore");
          
          // Auto welcome notification for new users
          try {
            const { addNotification } = await import('../services/gasClient');
            await addNotification({
              id: `welcome_${currentUser.uid}`,
              icon: 'waving_hand',
              iconColor: 'text-purple-500',
              title: 'Welcome to MargeItPro!',
              description: `Hi ${currentUser.displayName || 'there'}! Welcome to MargeItPro. Start by exploring templates and creating your first merge.`,
              timestamp: new Date().toLocaleString(),
              isNew: true,
              priority: 'Medium',
              category: 'Info',
              actions: [{
                text: 'Get Started',
                url: 'marge-it',
                type: 'primary'
              }]
            });
          } catch (notifError) {
            console.warn('Failed to create welcome notification:', notifError);
          }
        } else {
          const userData = userSnap.data();
          const needsUpdate = userData.profilePictureUrl !== currentUser.photoURL;
          if (needsUpdate) {
            await setDoc(userRef, {
              ...userData,
              profilePictureUrl: currentUser.photoURL,
            }, { merge: true });
            console.log("✅ User profile picture updated in Firestore");
          }
          console.log("ℹ️ User already exists");
        }
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ googleSignIn, logOut, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('UserAuth must be used within an AuthContextProvider');
  }
  return context;
};

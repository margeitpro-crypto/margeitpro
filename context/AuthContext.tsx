import React, { useContext, createContext, useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
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

  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  };

  const logOut = () => {
    signOut(auth);
  };

  useEffect(() => {
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
                ? 'admin-control-center,system-analytics,form-management,user-dashboard,marge-it,templates,merge-logs,notifications,billing,settings,todo,documentation,help'
                : 'user-dashboard,marge-it,templates,merge-logs,notifications,billing,settings,todo,documentation,help',
            plan: currentUser.email === "margeitpro@gmail.com" ? 'Enterprise' : 'Free',
            hasProAccess: currentUser.email === "margeitpro@gmail.com",
            profilePictureUrl: currentUser.photoURL,
            createdAt: new Date(),
          });
          console.log("✅ User created in Firestore");
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

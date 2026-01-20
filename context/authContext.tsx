import { auth, db } from "@/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Listen to auth state changes
  useEffect(() => {
    console.log("Auth Context");
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log(currentUser);
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      console.log("hello")
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log(userCredential);
      setUser(userCredential.user);
      setIsAuthenticated(true);
    } catch (error: any) {
      console.error("Login error:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error: any) {
      console.error("Logout error:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile with name
      if (name) {
        await updateProfile(userCredential.user, {
          displayName: name,
        });
      }

      setUser(userCredential.user);
      setIsAuthenticated(true);

      // Save user data to Firestore
      await saveUserData(userCredential.user, name);
    } catch (error: any) {
      console.error("Register error:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Function to save user data to Firestore
  const saveUserData = async (user: User, name?: string) => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName: name || user.displayName || user.email?.split("@")[0],
        photoURL: user.photoURL || "",
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        status: "online",
        lastSeen: Timestamp.now(),
      });
      console.log("User data saved successfully");
    } catch (error: any) {
      console.error("Error saving user data:", error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading, // 🔴 EXPOSE loading
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be wrapped inside Auth Context Provider");
  }

  return value;
};

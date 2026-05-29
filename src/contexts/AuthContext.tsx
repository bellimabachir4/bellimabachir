import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup, 
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
  User as FirebaseUser,
  sendPasswordResetEmail,
  sendEmailVerification
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where,
  deleteDoc
} from "firebase/firestore";
import { auth, db, isFirebaseAvailable } from "../lib/firebase";

// Translates and formats Firebase Authentication error messages elegantly in Arabic
export const translateFirebaseError = (error: any): string => {
  const code = error?.code || error?.message || "";
  if (code.includes("auth/operation-not-allowed")) {
    return "⚠️ طريقة تسجيل الدخول هذه غير مفعّلة حالياً في لوحة تحكّم Firebase Console. الرجاء الذهاب إلى Authentication وتفعيل مزودي الخدمة (Email/Password, Facebook Login, Apple Sign In) لحل المشكلة.";
  }
  if (code.includes("auth/email-already-in-use")) {
    return "❌ البريد الإلكتروني مستخدم بالفعل مسبقاً من قِبل طالب آخر.";
  }
  if (code.includes("auth/weak-password")) {
    return "🔒 كلمة المرور ضعيفة للغاية! يجب أن تتكون من 6 خانات على الأقل.";
  }
  if (code.includes("auth/invalid-email")) {
    return "✉️ البريد الإلكتروني المدخل غير صالح أو بصيغة خاطئة.";
  }
  if (code.includes("auth/user-not-found") || code.includes("auth/wrong-password") || code.includes("auth/invalid-credential")) {
    return "🔑 البريد الإلكتروني أو كلمة المرور غير مطابقة. يرجى التحقق وإعادة المحاولة.";
  }
  if (code.includes("auth/user-disabled")) {
    return "🚫 تم إيقاف هذا الحساب الدراسي بشكل مؤقت.";
  }
  if (code.includes("auth/too-many-requests")) {
    return "⏳ تم حظر محاولات الدخول مؤقتاً لحماية الحساب من التخمين، يرجى المحاولة مجدداً بعد دقيقة.";
  }
  return error?.message || "حدثت مشكلة تقنية غير موصوفة أثناء تلبية طلبك.";
};

// Define TypeScript structures
export interface IELTSUser {
  uid: string;
  fullName: string;
  email: string;
  streak: number;
  lastActiveDate: string;
  weeklyGoalHours: number;
  vocabularyScore: number;
  avatarUrl: string;
  isGuest?: boolean;
  targetBand?: number;
}

export interface PracticeResult {
  id?: string;
  userId: string;
  skillType: "Reading" | "Listening" | "Speaking" | "Writing" | "Vocabulary";
  score: string;
  details: string;
  createdAt: string;
}

export interface WordProgress {
  id?: string;
  userId: string;
  word: string;
  learned: boolean;
  favorited: boolean;
  category?: string;
  updatedAt: string;
}

interface AuthContextType {
  user: IELTSUser | null;
  loading: boolean;
  isFirebase: boolean;
  practiceHistory: PracticeResult[];
  wordProgress: WordProgress[];
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  loginAsGuest: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserStats: (fields: Partial<IELTSUser>) => Promise<void>;
  addPracticeResult: (skillType: PracticeResult["skillType"], score: string, details: string) => Promise<void>;
  toggleWordStatus: (word: string, type: "learned" | "favorited", value: boolean, category?: string) => Promise<void>;
  refreshHistory: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  sendVerification: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const DEFAULT_USER: IELTSUser = {
    uid: "local_ielts_student",
    fullName: "طالب آيلتس المتميز",
    email: "my-ielts-student@academic.edu",
    streak: 5,
    lastActiveDate: new Date().toISOString().split("T")[0],
    weeklyGoalHours: 5,
    vocabularyScore: 120,
    avatarUrl: "https://api.dicebear.com/7.x/adventurer/svg?seed=ielts_student_production",
    targetBand: 7.0
  };

  const [user, setUser] = useState<IELTSUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [practiceHistory, setPracticeHistory] = useState<PracticeResult[]>([]);
  const [wordProgress, setWordProgress] = useState<WordProgress[]>([]);
  const isFirebase = isFirebaseAvailable();

  // Load sample initial values if mock mode is used
  const loadMockData = (uid: string) => {
    // Practice History
    const historyKey = `ielts_history_${uid}`;
    const savedHistory = localStorage.getItem(historyKey);
    if (savedHistory) {
      setPracticeHistory(JSON.parse(savedHistory));
    } else {
      const sampleHistory: PracticeResult[] = [
        { userId: uid, skillType: "Reading", score: "6.5", details: "اختبار محاكاة نصوص Cathoven - قطع متوسطة الصعوبة.", createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString() },
        { userId: uid, skillType: "Listening", score: "7.0", details: "تمرين لهجات متعددة BBC Learning English.", createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString() },
        { userId: uid, skillType: "Speaking", score: "6.0", details: "تقييم الذكاء الاصطناعي لموضوع السفر والسياحة.", createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString() }
      ];
      localStorage.setItem(historyKey, JSON.stringify(sampleHistory));
      setPracticeHistory(sampleHistory);
    }

    // Vocabulary Progress
    const progressKey = `ielts_vocab_${uid}`;
    const savedProgress = localStorage.getItem(progressKey);
    if (savedProgress) {
      setWordProgress(JSON.parse(savedProgress));
    } else {
      const sampleProgress: WordProgress[] = [
        { userId: uid, word: "Acquire", learned: true, favorited: true, category: "AWL", updatedAt: new Date().toISOString() },
        { userId: uid, word: "Evaluate", learned: true, favorited: false, category: "AWL", updatedAt: new Date().toISOString() },
        { userId: uid, word: "Incentive", learned: false, favorited: true, category: "Advanced", updatedAt: new Date().toISOString() },
        { userId: uid, word: "Pragmatic", learned: false, favorited: true, category: "Advanced", updatedAt: new Date().toISOString() }
      ];
      localStorage.setItem(progressKey, JSON.stringify(sampleProgress));
      setWordProgress(sampleProgress);
    }
  };

  // Listen to Firebase auth state or retrieve saved Local user
  useEffect(() => {
    if (isFirebase && auth) {
      const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
        try {
          if (firebaseUser) {
            // Retrieve or build user profile in Firestore
            const userRef = doc(db!, "users", firebaseUser.uid);
            const userSnap = await getDoc(userRef);

            let profile: IELTSUser;
            if (userSnap.exists()) {
              profile = userSnap.data() as IELTSUser;
              
              // Validate dynamic daily study streak on login
              profile = checkAndCalculateStreak(profile);
              await setDoc(userRef, profile, { merge: true });
            } else {
              profile = {
                uid: firebaseUser.uid,
                fullName: firebaseUser.displayName || "طالب آيلتس",
                email: firebaseUser.email || "",
                streak: 1,
                lastActiveDate: new Date().toISOString().split("T")[0],
                weeklyGoalHours: 5,
                vocabularyScore: 50,
                avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${firebaseUser.uid}`,
                targetBand: 7.0
              };
              await setDoc(userRef, profile);
            }
            setUser(profile);
            await fetchFirebaseData(firebaseUser.uid);
          } else {
            // Check if there's a local/remembered user or a guest user saved
            const savedLocalUser = localStorage.getItem("ielts_current_user");
            if (savedLocalUser) {
              try {
                const parsed = JSON.parse(savedLocalUser);
                const calculated = checkAndCalculateStreak(parsed);
                setUser(calculated);
                loadMockData(calculated.uid);
              } catch (e) {
                setUser(null);
              }
            } else {
              setUser(null);
            }
          }
        } catch (error) {
          console.error("Error setting up auth profile:", error);
        } finally {
          setLoading(false);
        }
      });
      return unsubscribe;
    } else {
      // Local Auth only
      const savedLocalUser = localStorage.getItem("ielts_current_user");
      if (savedLocalUser) {
        try {
          const parsed = JSON.parse(savedLocalUser);
          const calculated = checkAndCalculateStreak(parsed);
          setUser(calculated);
          loadMockData(calculated.uid);
        } catch (e) {
          setUser(null);
        }
      }
      setLoading(false);
    }
  }, [isFirebase]);

  const checkAndCalculateStreak = (profile: IELTSUser) => {
    const todayStr = new Date().toISOString().split("T")[0];
    const lastActive = profile.lastActiveDate;

    if (!lastActive) {
      profile.lastActiveDate = todayStr;
      profile.streak = Math.max(1, profile.streak);
      return profile;
    }

    if (lastActive === todayStr) {
      return profile;
    }

    const lastDate = new Date(lastActive);
    const currentDate = new Date(todayStr);
    const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      profile.streak += 1;
    } else if (diffDays > 1) {
      profile.streak = 1; // broken streak Reset
    }
    profile.lastActiveDate = todayStr;
    return profile;
  };

  const fetchFirebaseData = async (uid: string) => {
    try {
      if (!db) return;
      // Fetch History
      const hSnap = await getDocs(
        query(collection(db, "practiceHistory"), where("userId", "==", uid))
      );
      const historyList: PracticeResult[] = [];
      hSnap.forEach(d => {
        historyList.push({ id: d.id, ...d.data() } as PracticeResult);
      });
      setPracticeHistory(historyList.sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));

      // Fetch Word Progress
      const vSnap = await getDocs(
        query(collection(db, "vocabularyProgress"), where("userId", "==", uid))
      );
      const vocabList: WordProgress[] = [];
      vSnap.forEach(d => {
        vocabList.push({ id: d.id, ...d.data() } as WordProgress);
      });
      setWordProgress(vocabList);
    } catch (err) {
      console.warn("Could not fetch remote practice data. Reverting to local fallback indices.", err);
      loadMockData(uid);
    }
  };

  const refreshHistory = async () => {
    if (user) {
      if (isFirebase && db) {
        await fetchFirebaseData(user.uid);
      } else {
        loadMockData(user.uid);
      }
    }
  };

  // 1. Email Login
  const login = async (email: string, password: string, rememberMe = true) => {
    if (isFirebase && auth) {
      try {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        if (rememberMe) {
          // Store credential trigger or let onAuthStateChanged handle persistence
          localStorage.setItem("ielts_remember_me", "true");
        } else {
          localStorage.removeItem("ielts_remember_me");
        }
      } catch (err: any) {
        throw new Error(translateFirebaseError(err));
      }
    } else {
      // Offline Simulation Login
      const localUsers = JSON.parse(localStorage.getItem("ielts_simulator_users") || "[]");
      const found = localUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      
      if (!found) {
        throw new Error("البريد الإلكتروني أو رمز المرور غير صحيح. الرجاء التأكد والمحاولة.");
      }

      const profile: IELTSUser = {
        uid: found.uid,
        fullName: found.fullName,
        email: found.email,
        streak: found.streak || 5,
        lastActiveDate: new Date().toISOString().split("T")[0],
        weeklyGoalHours: found.weeklyGoalHours || 5,
        vocabularyScore: found.vocabularyScore || 120,
        avatarUrl: found.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${found.uid}`
      };

      if (rememberMe) {
        localStorage.setItem("ielts_current_user", JSON.stringify(profile));
      }
      setUser(profile);
      loadMockData(profile.uid);
    }
  };

  // 2. Email Register
  const register = async (fullName: string, email: string, password: string) => {
    if (isFirebase && auth && db) {
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        
        // Try sending email verification
        try {
          await sendEmailVerification(cred.user);
        } catch (verifErr) {
          console.warn("Failed sending initial verification email:", verifErr);
        }

        const profile: IELTSUser = {
          uid: cred.user.uid,
          fullName,
          email,
          streak: 1,
          lastActiveDate: new Date().toISOString().split("T")[0],
          weeklyGoalHours: 5,
          vocabularyScore: 50,
          avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${cred.user.uid}`
        };
        await setDoc(doc(db, "users", cred.user.uid), profile);
        setUser(profile);
      } catch (err: any) {
        throw new Error(translateFirebaseError(err));
      }
    } else {
      // Offline Simulation Register
      const localUsers = JSON.parse(localStorage.getItem("ielts_simulator_users") || "[]");
      if (localUsers.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("البريد الإلكتروني المكتوب مستخدم بالفعل مسبقاً.");
      }

      const uid = "Offline_" + Math.random().toString(36).substr(2, 9);
      const profile: IELTSUser = {
        uid,
        fullName,
        email,
        streak: 1,
        lastActiveDate: new Date().toISOString().split("T")[0],
        weeklyGoalHours: 5,
        vocabularyScore: 50,
        avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${uid}`
      };

      localUsers.push({ ...profile, password });
      localStorage.setItem("ielts_simulator_users", JSON.stringify(localUsers));
      localStorage.setItem("ielts_current_user", JSON.stringify(profile));
      
      setUser(profile);
      loadMockData(profile.uid);
    }
  };

  // 3. Google Login
  const loginWithGoogle = async () => {
    if (isFirebase && auth) {
      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      } catch (err: any) {
        throw new Error(translateFirebaseError(err));
      }
    } else {
      // Mock Google Login
      const uid = "Google_" + Math.random().toString(36).substr(2, 9);
      const profile: IELTSUser = {
        uid,
        fullName: "محمد بن فهد (تجريبي)",
        email: "mohamed.ielts@gmail.com",
        streak: 6,
        lastActiveDate: new Date().toISOString().split("T")[0],
        weeklyGoalHours: 6,
        vocabularyScore: 240,
        avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${uid}`
      };
      localStorage.setItem("ielts_current_user", JSON.stringify(profile));
      setUser(profile);
      loadMockData(profile.uid);
    }
  };

  // 3b. Facebook Login
  const loginWithFacebook = async () => {
    if (isFirebase && auth) {
      try {
        const provider = new FacebookAuthProvider();
        await signInWithPopup(auth, provider);
      } catch (err: any) {
        throw new Error(translateFirebaseError(err));
      }
    } else {
      // Mock Facebook Login
      const uid = "Facebook_" + Math.random().toString(36).substr(2, 9);
      const profile: IELTSUser = {
        uid,
        fullName: "خليل السعيدي (فيسبوك)",
        email: "khaleel.facebook@gmail.com",
        streak: 3,
        lastActiveDate: new Date().toISOString().split("T")[0],
        weeklyGoalHours: 4,
        vocabularyScore: 90,
        avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${uid}`
      };
      localStorage.setItem("ielts_current_user", JSON.stringify(profile));
      setUser(profile);
      loadMockData(profile.uid);
    }
  };

  // 3c. Apple 로그인 (Sign In with Apple)
  const loginWithApple = async () => {
    if (isFirebase && auth) {
      try {
        // OAuthProvider requires service name "apple.com"
        const provider = new OAuthProvider("apple.com");
        await signInWithPopup(auth, provider);
      } catch (err: any) {
        throw new Error(translateFirebaseError(err));
      }
    } else {
      // Mock Apple Login
      const uid = "Apple_" + Math.random().toString(36).substr(2, 9);
      const profile: IELTSUser = {
        uid,
        fullName: "سارة الأحمد (آبل)",
        email: "sara.apple@icloud.com",
        streak: 7,
        lastActiveDate: new Date().toISOString().split("T")[0],
        weeklyGoalHours: 8,
        vocabularyScore: 310,
        avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${uid}`
      };
      localStorage.setItem("ielts_current_user", JSON.stringify(profile));
      setUser(profile);
      loadMockData(profile.uid);
    }
  };

  // 4. Guest Login
  const loginAsGuest = async () => {
    const uid = "Guest_" + Math.random().toString(36).substr(2, 9);
    const profile: IELTSUser = {
      uid,
      fullName: "زائر الآيلتس السريع ⚡",
      email: "guest@ielts.site",
      streak: 1,
      lastActiveDate: new Date().toISOString().split("T")[0],
      weeklyGoalHours: 3,
      vocabularyScore: 10,
      avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${uid}`,
      isGuest: true
    };
    localStorage.setItem("ielts_current_user", JSON.stringify(profile));
    setUser(profile);
    loadMockData(profile.uid);
  };

  // 5. Logout
  const logout = async () => {
    if (isFirebase && auth) {
      await signOut(auth);
    }
    localStorage.removeItem("ielts_current_user");
    setUser(null);
    setPracticeHistory([]);
    setWordProgress([]);
  };

  // 6. Update Stats
  const updateUserStats = async (fields: Partial<IELTSUser>) => {
    if (!user) return;
    const updated = { ...user, ...fields };
    setUser(updated);

    if (isFirebase && db) {
      try {
        await updateDoc(doc(db, "users", user.uid), fields);
      } catch (err) {
        console.error("Error writing user update to Firestore:", err);
      }
    } else {
      localStorage.setItem("ielts_current_user", JSON.stringify(updated));
      const localUsers = JSON.parse(localStorage.getItem("ielts_simulator_users") || "[]");
      const idx = localUsers.findIndex((u: any) => u.uid === user.uid);
      if (idx !== -1) {
        localUsers[idx] = { ...localUsers[idx], ...fields };
        localStorage.setItem("ielts_simulator_users", JSON.stringify(localUsers));
      }
    }
  };

  // 7. Store Practice History Result
  const addPracticeResult = async (skillType: PracticeResult["skillType"], score: string, details: string) => {
    if (!user) return;
    const newResult: PracticeResult = {
      userId: user.uid,
      skillType,
      score,
      details,
      createdAt: new Date().toISOString()
    };

    if (isFirebase && db) {
      try {
        await addDoc(collection(db, "practiceHistory"), newResult);
        await fetchFirebaseData(user.uid);
      } catch (err) {
        console.error("Error committing practiceHistory results:", err);
      }
    } else {
      const historyKey = `ielts_history_${user.uid}`;
      const saved = JSON.parse(localStorage.getItem(historyKey) || "[]");
      const completeList = [newResult, ...saved];
      localStorage.setItem(historyKey, JSON.stringify(completeList));
      setPracticeHistory(completeList);
    }

    // Boost score if they score highly
    if (skillType === "Vocabulary") {
      const award = score.includes("/") ? parseInt(score.split("/")[0]) * 10 : 20;
      await updateUserStats({ vocabularyScore: user.vocabularyScore + award });
    } else {
      await updateUserStats({ vocabularyScore: user.vocabularyScore + 15 });
    }
  };

  // 8. Mark word learned / favorited
  const toggleWordStatus = async (word: string, type: "learned" | "favorited", value: boolean, category = "General") => {
    if (!user) return;

    // Check if progress entry already exists
    const existingIdx = wordProgress.findIndex(wp => wp.word.toLowerCase() === word.toLowerCase());

    if (isFirebase && db) {
      try {
        if (existingIdx !== -1) {
          const item = wordProgress[existingIdx];
          const itemRef = doc(db, "vocabularyProgress", item.id!);
          const updates = { [type]: value, updatedAt: new Date().toISOString() };
          await updateDoc(itemRef, updates);
        } else {
          const newItem = {
            userId: user.uid,
            word,
            learned: type === "learned" ? value : false,
            favorited: type === "favorited" ? value : false,
            category,
            updatedAt: new Date().toISOString()
          };
          await addDoc(collection(db, "vocabularyProgress"), newItem);
        }
        await fetchFirebaseData(user.uid);
      } catch (err) {
        console.error("Error setting vocabulary status in Firestore:", err);
      }
    } else {
      // Local Fallback Progress
      const progressKey = `ielts_vocab_${user.uid}`;
      const list = [...wordProgress];
      
      if (existingIdx !== -1) {
        list[existingIdx] = {
          ...list[existingIdx],
          [type]: value,
          updatedAt: new Date().toISOString()
        };
      } else {
        list.push({
          userId: user.uid,
          word,
          learned: type === "learned" ? value : false,
          favorited: type === "favorited" ? value : false,
          category,
          updatedAt: new Date().toISOString()
        });
      }
      
      localStorage.setItem(progressKey, JSON.stringify(list));
      setWordProgress(list);
    }
  };

  // Send actual password reset email
  const sendPasswordReset = async (email: string) => {
    if (isFirebase && auth) {
      try {
        await sendPasswordResetEmail(auth, email);
      } catch (err: any) {
        throw new Error(translateFirebaseError(err));
      }
    } else {
      console.log("Simulator: Sent password reset instructions email to:", email);
    }
  };

  // Send verification email
  const sendVerification = async () => {
    if (isFirebase && auth && auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
      } catch (err: any) {
        throw new Error(translateFirebaseError(err));
      }
    } else {
      console.log("Simulator: Sent user email verification successfully.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isFirebase,
        practiceHistory,
        wordProgress,
        login,
        register,
        loginWithGoogle,
        loginWithFacebook,
        loginWithApple,
        loginAsGuest,
        logout,
        updateUserStats,
        addPracticeResult,
        toggleWordStatus,
        refreshHistory,
        sendPasswordReset,
        sendVerification
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
}

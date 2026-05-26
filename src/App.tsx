import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  Headphones, 
  Mic, 
  PenTool, 
  Calendar, 
  BarChart3, 
  Home as HomeIcon, 
  Flame, 
  Sparkles, 
  Hourglass, 
  Clock, 
  CheckCircle2, 
  ExternalLink, 
  LogOut, 
  AlertCircle,
  Brain,
  Award,
  Volume2,
  Trophy,
  Play,
  Square,
  Activity,
  UserCheck,
  Moon,
  Sun
} from "lucide-react";

import WeeklyPlan from "./components/WeeklyPlan";
import Analytics from "./components/Analytics";
import ReadingPractice from "./components/ReadingPractice";
import ListeningPractice from "./components/ListeningPractice";
import SpeakingPractice from "./components/SpeakingPractice";
import WritingPractice from "./components/WritingPractice";
import VocabularyPractice from "./components/VocabularyPractice";
import LoginRegister from "./components/LoginRegister";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Leaderboard dummy competitors
const MOCK_LEADERS = [
  { name: "ليلى القحطاني 🇸🇦", score: 480, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=layla" },
  { name: "أحمد الشريف 🇪🇬", score: 350, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=ahmed" },
  { name: "ياسمين مروان 🇯🇴", score: 260, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=yasmin" },
  { name: "خالد الحربي 🇦🇪", score: 180, avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=khalid" }
];

// Daily words library
const DAILY_WORDS_SET = [
  { 
    word: "Pragmatic", 
    translation: "عملي / واقعي", 
    pos: "Adjective", 
    meaning: "Dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations.",
    example: "Taking a pragmatic approach to training IELTS writing guarantees continuous bands improvement.",
    exampleArabic: "إن اتباع نهج عملي في التدرب على كتابة الآيلتس يضمن تحسناً مستمراً للدبلومات."
  },
  { 
    word: "Incentive", 
    translation: "حافز / دافع", 
    pos: "Noun", 
    meaning: "A thing that motivates or encourages one to do something, especially consistent daily study schedules.",
    example: "The prospective study scholarship in Oxford was a powerful incentive for him to score Band 8.",
    exampleArabic: "كانت المنحة الدراسية المرتقبة في أكسفورد حافزاً قوياً له لتحقيق البند الثامن."
  },
  { 
    word: "Scrutinize", 
    translation: "يدقق النظر / يفحص بدقة", 
    pos: "Verb", 
    meaning: "To examine or inspect closely and thoroughly to detect any spelling flaws or syntactical mistakes.",
    example: "IELTS assessors closely scrutinize the lexical resource cohesion and grammatical range of paragraphs.",
    exampleArabic: "يدقق مقيمو الآيلتس عن كثب في التماسك اللغوي والمدى القواعدي للفقرات المكتوبة."
  }
];

// Daily motivation quotes for welcoming hub
const MOTIVATION_QUOTES = [
  "استعدادك وتركيزك اليوم هو جسرك نحو البند السابع غداً! 🎓",
  "تعلم 15 دقيقة بانتظام أفضل من المذاكرة المشتتة لثلاث ساعات. انطلق! 🚀",
  "علامة الأيلتس مجرد خطوة نحو أحلام ومستقبل أكاديمي يليق بك. ✨",
  "الاستمرارية تبني الثقة؛ استمع الآن لنصف ساعة واكسب مزامنة كاملة اليوم! 🔥"
];

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user, loading, logout, practiceHistory, wordProgress, toggleWordStatus, updateUserStats, addPracticeResult } = useAuth();
  const [activeTab, setActiveTab] = useState<"Home" | "Reading" | "Listening" | "Speaking" | "Writing" | "Vocabulary" | "Profile">("Home");
  const [profileSubTab, setProfileSubTab] = useState<"Analytics" | "Weekly" | "Settings">("Analytics");

  // Modern Light/Dark theme mode state
  const [themeMode, setThemeMode] = useState<"light" | "dark">(() => {
    return (localStorage.getItem("ielts_theme") as "light" | "dark") || "dark";
  });

  useEffect(() => {
    localStorage.setItem("ielts_theme", themeMode);
    const root = window.document.documentElement;
    if (themeMode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [themeMode]);

  // Exam countdown state
  const [examDate, setExamDate] = useState<string>(() => {
    const saved = localStorage.getItem("ielts_exam_date");
    if (saved) return saved;
    const date = new Date();
    date.setDate(date.getDate() + 60);
    return date.toISOString().split("T")[0];
  });

  const [daysRemaining, setDaysRemaining] = useState(60);

  useEffect(() => {
    localStorage.setItem("ielts_exam_date", examDate);
    const exam = new Date(examDate).getTime();
    const now = new Date().getTime();
    const diff = exam - now;
    const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    setDaysRemaining(days);
  }, [examDate]);

  // Study Tracker Stopwatch State
  const [stopwatchActive, setStopwatchActive] = useState(false);
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);

  const [studyHoursToday, setStudyHoursToday] = useState<number>(() => {
    return parseFloat(localStorage.getItem("ielts_study_hours_today") || "0.6");
  });

  const [studyHoursWeekly, setStudyHoursWeekly] = useState<number>(() => {
    return parseFloat(localStorage.getItem("ielts_tracked_hours") || "3.5");
  });

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (stopwatchActive) {
      interval = setInterval(() => {
        setStopwatchSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [stopwatchActive]);

  const handleStopwatchSave = async () => {
    if (stopwatchSeconds > 0) {
      const hoursDecimal = parseFloat((stopwatchSeconds / 3600).toFixed(3));
      
      const currentTracked = parseFloat(localStorage.getItem("ielts_tracked_hours") || "3.5");
      const newWeekly = parseFloat((currentTracked + hoursDecimal).toFixed(3));
      localStorage.setItem("ielts_tracked_hours", newWeekly.toString());
      setStudyHoursWeekly(newWeekly);
      
      const todayTracked = parseFloat(localStorage.getItem("ielts_study_hours_today") || "0.6");
      const newToday = parseFloat((todayTracked + hoursDecimal).toFixed(3));
      localStorage.setItem("ielts_study_hours_today", newToday.toString());
      setStudyHoursToday(newToday);

      const sessionMinutes = Math.max(1, Math.round(stopwatchSeconds / 60));
      // Log as real activity practice
      await addPracticeResult(
        "Vocabulary",
        "7.5",
        `جلسة دراسة ومذاكرة ذاتية ومراجعة مفردات استمرت لـ ${sessionMinutes} دقيقة.`
      );

      setStopwatchSeconds(0);
      setStopwatchActive(false);
      alert("تم حفظ جلسة المذاكرة وإضافتها لساعات دراستك بنجاح! 🎉");
    }
  };

  const formatStopwatchTime = (sec: number) => {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Target Band State
  const [targetBand, setTargetBand] = useState<number>(() => {
    return parseFloat(localStorage.getItem("ielts_target_band") || "7.7");
  });

  const TARGET_BAND_OPTIONS = [4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0, 7.7, 8.0, 8.5];

  const handleUpdateTargetBand = async (band: number) => {
    setTargetBand(band);
    localStorage.setItem("ielts_target_band", band.toFixed(1));
    if (user) {
      await updateUserStats({ targetBand: band });
    }
  };

  // Sync state when online user profile loads
  useEffect(() => {
    if (user && typeof user.targetBand === "number") {
      setTargetBand(user.targetBand);
      localStorage.setItem("ielts_target_band", user.targetBand.toFixed(1));
    }
  }, [user]);

  // Real-time Countdown: Remaining time for the day
  const [timeLeftInDay, setTimeLeftInDay] = useState("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const diffMs = endOfDay.getTime() - now.getTime();
      if (diffMs <= 0) {
        setTimeLeftInDay("00:00:00");
        return;
      }
      const hrs = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
      setTimeLeftInDay(
        `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
      );
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  // Today's vocabulary word randomization based on date index
  const dayIndex = new Date().getDate() % DAILY_WORDS_SET.length;
  const wordOfTheDay = DAILY_WORDS_SET[dayIndex];

  const isWordLearned = wordProgress.some(w => w.word.toLowerCase() === wordOfTheDay.word.toLowerCase() && w.learned);

  const handleMarkWordOfTheDay = async () => {
    try {
      await toggleWordStatus(wordOfTheDay.word, "learned", !isWordLearned, "AWL");
      alert(isWordLearned ? "تم إزالة الكلمة من دولاب حصيلتك المدروسة." : "تم تسجيل كلمة اليوم بنجاح وضمها لدرجتك! 🌟");
    } catch (e) {
      console.error(e);
    }
  };

  // Daily Tasks List State
  const [dailyTasks, setDailyTasks] = useState([
    { id: "dt1", skill: "Reading Practice (محاكاة نصوص)", duration: "20–30 min", url: "https://www.cathoven.com/", target: "Cathoven", completed: false },
    { id: "dt2", skill: "Listening Practice (لهجات وحصيلة سمعية)", duration: "20–30 min", url: "https://engnovate.com/", target: "Engnovate", completed: false },
    { id: "dt3", skill: "Speaking Practice Part 2 (Cue Card)", duration: "15–20 min", url: "https://ieltsadvantage.com/", target: "Advantages - 1000 Topics Hub", completed: false }
  ]);

  const toggleDailyTask = (id: string) => {
    setDailyTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const [activeMistakes, setActiveMistakes] = useState<string[]>(() => {
    const saved = localStorage.getItem("ielts_mistakes_log");
    return saved ? JSON.parse(saved) : [
      "استخدام حرف الجر الخاطئ مع depend (المفترض depend on وليس depend in)",
      "التلعثم أو تجاوز الفارق الزمني لتوضيح موضوع Cue card في التحدث الجزء الثاني",
      "السرعة المفرطة عند الاستماع للرموز الأكاديمية والترقيم بالأرقام الكبيرة"
    ];
  });

  const [newMistake, setNewMistake] = useState("");

  const handleAddMistake = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMistake.trim()) {
      const updated = [newMistake.trim(), ...activeMistakes];
      setActiveMistakes(updated);
      localStorage.setItem("ielts_mistakes_log", JSON.stringify(updated));
      setNewMistake("");
    }
  };

  const playWordPronunciation = (txt: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(txt);
      utterance.rate = 0.85;
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  // Live score trends averages to compute IELTS Prediction Band
  const calculatePredictedBand = () => {
    const readingResults = practiceHistory.filter(r => r.skillType === "Reading");
    const readingScore = readingResults.length > 0
      ? (readingResults.reduce((acc, c) => acc + parseFloat(c.score || "0"), 0) / readingResults.length)
      : 6.5;

    const listeningResults = practiceHistory.filter(r => r.skillType === "Listening");
    const listeningScore = listeningResults.length > 0
      ? (listeningResults.reduce((acc, c) => acc + parseFloat(c.score || "0"), 0) / listeningResults.length)
      : 7.0;

    const speakingResults = practiceHistory.filter(r => r.skillType === "Speaking");
    const speakingScore = speakingResults.length > 0
      ? (speakingResults.reduce((acc, c) => acc + parseFloat(c.score || "0"), 0) / speakingResults.length)
      : 6.0;

    const writingResults = practiceHistory.filter(r => r.skillType === "Writing");
    const writingScore = writingResults.length > 0
      ? (writingResults.reduce((acc, c) => acc + parseFloat(c.score || "0"), 0) / writingResults.length)
      : 5.5;

    const rawAvg = (readingScore + listeningScore + speakingScore + writingScore) / 4;
    // IELTS rounds to nearest 0.5
    const rounded = Math.round(rawAvg * 2) / 2;
    return {
      average: parseFloat(rawAvg.toFixed(2)),
      band: Math.min(9.0, Math.max(1.0, rounded)),
      readingScore,
      listeningScore,
      speakingScore,
      writingScore
    };
  };

  const predicted = calculatePredictedBand();

  // If AuthContext is loading user from DB/LocalStorage
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 font-sans">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-black text-xl tracking-tighter shadow-2xl animate-bounce mb-6">
          IELTS
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-sm font-black text-white">جاري إعداد البوابة الأكاديمية والمزامنة الآمنة...</h3>
          <p className="text-[10px] text-slate-450 dark:text-slate-500 font-medium">قاعدة بيانات Firebase Firestore متأهبة ومفتوحة</p>
        </div>
      </div>
    );
  }

  // IF NOT AUTHENTICATED -> Display the Login & Registration Portal Gate
  if (!user) {
    return <LoginRegister />;
  }

  // Merge User Score with Leaderboard Competitors
  const leaderboard = [
    ...MOCK_LEADERS,
    { name: `${user?.fullName || "أنت"} (أنت) 🎯`, score: Math.max(wordProgress.filter(w => w.learned).length * 10, user?.vocabularyScore || 0), avatar: user?.avatarUrl || "https://api.dicebear.com/7.x/adventurer/svg?seed=user_avatar" }
  ].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans relative antialiased pb-28 overflow-x-hidden transition-all duration-300">
      
      {/* Dynamic theme background gradients */}
      <div className="absolute top-[2%] left-[-15%] w-[45rem] h-[45rem] rounded-full bg-purple-300/10 dark:bg-purple-950/15 blur-[130px] pointer-events-none z-0"></div>
      <div className="absolute top-[35%] right-[-15%] w-[45rem] h-[45rem] rounded-full bg-indigo-300/15 dark:bg-indigo-950/20 blur-[150px] pointer-events-none z-0"></div>

      {/* HEADER NAVBAR */}
      <header className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border-b border-slate-200/40 dark:border-slate-800/80 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 gap-4">
            
            {/* User credentials */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => logout()}
                className="p-2 hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-400 hover:text-red-650 rounded-xl transition-all border border-transparent hover:border-red-100/50 cursor-pointer"
                title="تسجيل الخروج الآمن"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>

              <div className="text-right hidden sm:block">
                <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200 block">{user?.fullName}</span>
                <span className="text-[10px] text-purple-650 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/40 px-1.5 py-0.5 rounded-md font-extrabold font-mono mt-0.5 inline-block">
                  باند مستهدف: {targetBand.toFixed(1)} 🎓
                </span>
              </div>

              <img 
                src={user?.avatarUrl} 
                alt="Avatar" 
                className="w-10 h-10 rounded-xl border border-purple-200 dark:border-purple-900 shadow-sm shrink-0 bg-slate-100 dark:bg-slate-800"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Logo and Branding header */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab("Home")}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center font-black text-sm tracking-tighter shadow-md border border-white/25">
                IELTS
              </div>
              <div className="text-right">
                <span className="font-black text-sm tracking-tight text-slate-900 dark:text-slate-100 block font-sans">منصة التحضير لاختبار IELTS</span>
                <span className="text-[10px] text-purple-750 dark:text-purple-400 font-extrabold flex items-center gap-1 justify-end font-sans">
                  <span>تتبع مستواك الحقيقي وطور مهاراتك حتى تصل للباند المطلوب</span>
                  <Activity className="h-3 w-3 text-purple-550 shrink-0" />
                </span>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* PRIMARY CONTROLS CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-8 relative z-10 text-right">

        {/* Home Tab Redesign */}
        {activeTab === "Home" && (
          <div className="space-y-6 md:space-y-8 animate-fade-in">
            
            {/* 1. Dashboard Metrics Grid (Remaining Time, Study Timer, Daily Progress) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
              
              {/* Card 1: Study Timer & Countdown */}
              <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 border border-purple-500/20 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-550/15 rounded-full blur-2xl pointer-events-none"></div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] bg-purple-500/20 border border-purple-400/30 text-purple-300 font-bold px-2 py-0.5 rounded-md font-mono">
                      {stopwatchActive ? "نشط ⚡" : "موقف 🌱"}
                    </span>
                    <h4 className="text-xs font-black text-slate-200 flex items-center gap-1 col-reverse">
                      <span>ميقاتي الدراسة</span>
                      <Clock className="w-3.5 h-3.5 text-purple-400" />
                    </h4>
                  </div>
                  <div className="text-2xl font-black font-mono tracking-wider text-purple-100 my-2">
                    {formatStopwatchTime(stopwatchSeconds)}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal">يحسب ويسجل ساعات دراسة الآيلتس اليومية</p>
                </div>
                
                <div className="flex gap-1.5 mt-4">
                  {stopwatchActive ? (
                    <button
                      onClick={() => setStopwatchActive(false)}
                      className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-900 text-[10px] font-black rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer shadow-md"
                    >
                      <Square className="h-3 w-3 fill-current" />
                      <span>إيقاف مؤقت</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setStopwatchActive(true)}
                      className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-900 text-[10px] font-black rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer shadow-md"
                    >
                      <Play className="h-3 w-3 fill-current" />
                      <span>ابدأ المذاكرة</span>
                    </button>
                  )}
                  {stopwatchSeconds > 0 && (
                    <button
                      onClick={handleStopwatchSave}
                      className="py-1.5 px-2 bg-purple-600 hover:bg-purple-705 text-white text-[10px] font-bold rounded-xl transition-all cursor-pointer shadow-md"
                    >
                      حفظ الساعات
                    </button>
                  )}
                </div>
              </div>

              {/* Card 2: Remaining Time For The Day */}
              <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-505/20 rounded-3xl p-5 text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-550/15 rounded-full blur-2xl pointer-events-none"></div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[9px] bg-indigo-505/25 text-indigo-300 font-bold px-2 py-0.5 rounded-md font-mono">LIVE COUNTDOWN</span>
                    <h4 className="text-xs font-black text-slate-200 flex items-center gap-1">
                      <span>الوقت المتبقي لليوم</span>
                      <Hourglass className="w-3.5 h-3.5 text-indigo-400" />
                    </h4>
                  </div>
                  <div className="text-2xl font-black font-mono tracking-wider text-indigo-100 my-2">
                    {timeLeftInDay}
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal">الوقت المتبقي لإنجاز أهدافك دراسة اليوم قبل الساعة 12 منتصف الليل</p>
                </div>
                <div className="mt-4 pt-2 border-t border-white/5 text-[9px] text-indigo-300 font-bold">
                  أسرع لإتمام المهام اليومية! 🚀
                </div>
              </div>

              {/* Card 3: Daily Progress */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-3xl shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2 flex-row-reverse text-right">
                    <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      <span>مستوى التقدم اليومي</span>
                    </h4>
                    <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-305 font-bold font-mono px-2 py-0.5 rounded-md">DAILY TARGET</span>
                  </div>

                  <div className="my-3">
                    <div className="flex justify-between items-baseline mb-1 flex-row-reverse font-mono text-xs">
                      <span className="font-sans text-[10.5px] text-slate-500">مكتمل اليوم</span>
                      <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                        {Math.round(((dailyTasks.filter(t => t.completed).length / dailyTasks.length) * 50) + (Math.min(1.5, studyHoursToday) / 1.5 * 50))}%
                      </span>
                    </div>
                    {/* Progress Bar slider */}
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.round(((dailyTasks.filter(t => t.completed).length / dailyTasks.length) * 50) + (Math.min(1.5, studyHoursToday) / 1.5 * 50))}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="text-[9.5px] text-slate-405 leading-normal text-right">
                  المهام: {dailyTasks.filter(t => t.completed).length} / {dailyTasks.length} • الساعات: {studyHoursToday.toFixed(1)} / 1.5 س
                </div>
              </div>

              {/* Card 4: Streak & Motivational Status */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-3xl shadow-sm flex flex-col justify-between">
                <div className="text-right">
                  <div className="flex items-center justify-between mb-1 flex-row-reverse">
                    <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-orange-550" />
                      <span>سلسلة الالتزام</span>
                    </h4>
                    <span className="text-[9.5px] bg-orange-100 dark:bg-orange-955/20 text-orange-700 dark:text-orange-400 font-bold px-1.5 py-0.5 rounded-md">STREAK</span>
                  </div>
                  <div className="text-2xl font-black font-mono tracking-tight text-orange-550 my-2">
                    {user.streak || 1} <span className="text-xs font-sans text-slate-500">أيام متتالية</span>
                  </div>
                </div>

                <div className="text-[10px] text-purple-650 dark:text-purple-400 leading-relaxed font-bold italic" dir="rtl">
                  "{MOTIVATION_QUOTES[new Date().getDate() % MOTIVATION_QUOTES.length]}"
                </div>
              </div>

            </div>

            {/* 2. Interactive Skills Navigation Grid */}
            <div className="space-y-3">
              <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-xs text-right">🚀 مسارات مهارات اختبار الآيلتس (IELTS Skills Portal)</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                
                {/* Reading */}
                <button
                  onClick={() => setActiveTab("Reading")}
                  className={`border p-3.5 rounded-2xl text-right transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between h-24 cursor-pointer relative col-span-1 ${
                    activeTab === "Reading"
                      ? "bg-purple-50/20 dark:bg-purple-950/20 border-purple-400"
                      : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/80"
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <span className="p-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
                      <BookOpen className="h-4.5 w-4.5" />
                    </span>
                    <span className="text-[9px] bg-slate-100 dark:bg-slate-850 text-slate-400 font-mono font-bold px-1 rounded-md">
                      Band {predicted.readingScore.toFixed(1)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-850 dark:text-slate-150 font-sans">تمرين القراءة</h4>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">محاكاة نصوص Cathoven</p>
                  </div>
                </button>

                {/* Listening */}
                <button
                  onClick={() => setActiveTab("Listening")}
                  className={`border p-3.5 rounded-2xl text-right transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between h-24 cursor-pointer relative col-span-1 ${
                    activeTab === "Listening"
                      ? "bg-purple-50/20 dark:bg-purple-950/20 border-purple-400"
                      : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/80"
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <span className="p-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-lg">
                      <Headphones className="h-4.5 w-4.5" />
                    </span>
                    <span className="text-[9px] bg-slate-100 dark:bg-slate-850 text-slate-400 font-mono font-bold px-1 rounded-md">
                      Band {predicted.listeningScore.toFixed(1)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-850 dark:text-slate-150 font-sans">تمرين الاستماع</h4>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">لهجات وتمييز سمعي</p>
                  </div>
                </button>

                {/* Speaking - Resources Based */}
                <button
                  onClick={() => setActiveTab("Speaking")}
                  className={`border p-3.5 rounded-2xl text-right transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between h-24 cursor-pointer relative col-span-1 ${
                    activeTab === "Speaking"
                      ? "bg-purple-50/20 dark:bg-purple-950/20 border-purple-400"
                      : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/80"
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <span className="p-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg">
                      <Mic className="h-4.5 w-4.5" />
                    </span>
                    <span className="text-[9px] bg-slate-100 dark:bg-slate-850 text-slate-400 font-mono font-bold px-1 rounded-md">
                      Band {predicted.speakingScore.toFixed(1)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-850 dark:text-slate-150 font-sans">تمرين المحادثة</h4>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 mt-0.5">مصادر ومواضيع الأيلتس</p>
                  </div>
                </button>

                {/* Writing */}
                <button
                  onClick={() => setActiveTab("Writing")}
                  className={`border p-3.5 rounded-2xl text-right transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between h-24 cursor-pointer relative col-span-1 ${
                    activeTab === "Writing"
                      ? "bg-purple-50/20 dark:bg-purple-950/20 border-purple-400"
                      : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/80"
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <span className="p-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg">
                      <PenTool className="h-4.5 w-4.5" />
                    </span>
                    <span className="text-[9px] bg-slate-100 dark:bg-slate-850 text-slate-400 font-mono font-bold px-1 rounded-md">
                      Band {predicted.writingScore.toFixed(1)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-850 dark:text-slate-150 font-sans">تمرين الكتابة</h4>
                    <p className="text-[9px] text-slate-400 dark:text-slate-505 mt-0.5">تقييم وتدقيق المقالات</p>
                  </div>
                </button>

                {/* Vocabulary */}
                <button
                  onClick={() => setActiveTab("Vocabulary")}
                  className={`border p-3.5 rounded-2xl text-right transition-all duration-300 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between h-24 cursor-pointer relative col-span-2 sm:col-span-1 ${
                    activeTab === "Vocabulary"
                      ? "bg-purple-50/20 dark:bg-purple-950/20 border-purple-400"
                      : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/80"
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <span className="p-1 bg-pink-500/10 text-pink-600 dark:text-pink-400 rounded-lg">
                      <Brain className="h-4.5 w-4.5" />
                    </span>
                    <span className="text-[9px] bg-slate-100 dark:bg-slate-850 text-slate-405 font-mono font-bold px-1 rounded-md">
                      {wordProgress.filter(w => w.learned).length} كلمات
                    </span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-850 dark:text-slate-150 font-sans">مستودع المفردات</h4>
                    <p className="text-[9px] text-slate-404 dark:text-slate-550 mt-0.5">كلمات اليوم والأكاديمية</p>
                  </div>
                </button>

              </div>
            </div>

            {/* 3. MIDDLE DOCK: DYNAMIC PREDICTION BAND AND WIDGETS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Daily word of the day widget (Left component, spans 7 columns) */}
              <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3.5xl p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-slate-850 pb-3">
                    <div className="flex gap-1.5 items-center">
                      <span className="text-[9.5px] bg-pink-100 dark:bg-pink-955/20 text-pink-700 dark:text-pink-400 border border-pink-200/40 px-2 py-0.5 rounded-md font-bold font-mono">
                        {wordOfTheDay.pos}
                      </span>
                      <button 
                        onClick={() => playWordPronunciation(wordOfTheDay.word)}
                        className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-405 hover:text-purple-600 transition-colors"
                        title="استمع للفظ"
                      >
                        <Volume2 className="h-4 w-4" />
                      </button>
                    </div>

                    <h3 className="font-extrabold text-slate-800 dark:text-slate-101 text-xs flex items-center gap-1.5">
                      <span>كلمة اليوم الأكاديمية (Daily Word)</span>
                      <Brain className="h-4.5 w-4.5 text-pink-500" />
                    </h3>
                  </div>

                  <div className="py-1">
                    <div className="flex justify-between items-baseline mb-2 flex-wrap gap-2 text-right">
                      <span className="text-xs text-purple-650 dark:text-purple-400 font-black">المرادف الأكاديمي بالعربية: {wordOfTheDay.translation}</span>
                      <h4 className="text-xl font-black text-slate-900 dark:text-slate-50 tracking-wide font-sans">{wordOfTheDay.word}</h4>
                    </div>
                    
                    <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed text-right bg-slate-50/50 dark:bg-slate-950/20 p-3.5 rounded-2.5xl border dark:border-slate-850 mb-3 font-sans">
                      <strong>English Meaning:</strong> {wordOfTheDay.meaning}
                    </p>

                    <div className="p-3 bg-purple-50/30 dark:bg-purple-955/10 border border-purple-100/30 dark:border-purple-900/40 rounded-xl text-right">
                      <span className="text-[10px] text-purple-700 dark:text-purple-305 block font-bold mb-0.5">أمثلة صياغة الجمل الاستفهامية:</span>
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 italic font-sans" dir="ltr">
                        "{wordOfTheDay.example}"
                      </p>
                      <p className="text-[10px] text-slate-405 dark:text-slate-450 mt-1">الترجمة: {wordOfTheDay.exampleArabic}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-950 p-2.5 rounded-2xl">
                  <button
                    onClick={handleMarkWordOfTheDay}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isWordLearned
                        ? "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        : "bg-purple-600 hover:bg-purple-705 text-white shadow-xs"
                    }`}
                  >
                    {isWordLearned ? "✓ درست هذه الكلمة" : "تعلم الكلمة وضمنها لتقدمك 🎯"}
                  </button>
                  <button 
                    onClick={() => setActiveTab("Vocabulary")}
                    className="text-xs text-purple-650 dark:text-purple-400 hover:text-purple-800 font-black"
                  >
                    مستودع المفردات الكامل 📈
                  </button>
                </div>
              </div>

              {/* Smart Band Goal Tracker and Study Time Widgets Bento Panel */}
              <div className="lg:col-span-5 space-y-4 text-right">
                
                {/* 1. Dynamic Smart Band Goal Tracker Card */}
                <div className="bg-slate-900 text-white rounded-3.5xl p-5 shadow-xl border border-white/5 flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3 text-right">
                      <span className="text-[9px] bg-purple-500/20 text-purple-300 font-bold font-mono px-2 py-0.5 rounded-full animate-pulse">GOAL TRACKER ACTIVE</span>
                      <h3 className="font-extrabold text-white text-xs flex items-center gap-1.5 font-sans">
                        <span>مراقب الهدف والتحكم بالباند</span>
                        <Award className="h-4.5 w-4.5 text-purple-400 shrink-0" />
                      </h3>
                    </div>

                    {/* Interactive Target Band Selector */}
                    <div className="mb-4 text-right">
                      <span className="text-[10px] text-slate-400 block mb-1.5 font-bold font-sans">اختر الباند المستهدف (Control & Change Target Band):</span>
                      <div className="flex flex-wrap gap-1 justify-end">
                        {TARGET_BAND_OPTIONS.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => handleUpdateTargetBand(opt)}
                            className={`px-2 py-1 rounded-lg text-[10.5px] font-black transition-all cursor-pointer font-mono ${
                              targetBand === opt
                                ? "bg-purple-600 text-white border border-purple-400 shadow-md shadow-purple-900/40 scale-105"
                                : "bg-slate-800 text-slate-300 border border-slate-700/60 hover:bg-slate-700 hover:text-white"
                            }`}
                          >
                            {opt.toFixed(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Horizontal Progress Gauge towards Target Band */}
                    <div className="bg-slate-950/40 border border-slate-800 p-3 rounded-2xl mb-4 text-right">
                      <div className="flex justify-between items-baseline mb-1 flex-row-reverse text-[9.5px]">
                        <span className="text-slate-400 font-sans">التقدم نحو الباند المستهدف</span>
                        <span className="font-mono text-purple-300 font-bold">
                          {Math.min(100, Math.round((predicted.band / targetBand) * 100))}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-indigo-505 to-purple-505 h-full rounded-full transition-all duration-1000"
                          style={{ width: `${Math.min(100, Math.round((predicted.band / targetBand) * 100))}%` }}
                        ></div>
                      </div>
                      <div className="mt-1 flex justify-between flex-row-reverse text-[8px] font-mono text-slate-500">
                        <span>Target: {targetBand.toFixed(1)}</span>
                        <span>Current: {predicted.band.toFixed(1)}</span>
                      </div>
                    </div>

                    {/* Core grid representation */}
                    <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t border-white/10 text-right">
                      <div className="p-2 bg-white/5 rounded-xl border border-white/5">
                        <span className="text-[9px] text-slate-450 block">الباند الحالي التقديري</span>
                        <span className="text-xs font-black text-purple-305 font-mono block mt-0.5">{predicted.band.toFixed(1)}</span>
                      </div>
                      <div className="p-2 bg-white/5 rounded-xl border border-white/5">
                        <span className="text-[9px] text-slate-450 block font-sans">الفارق المطلوب</span>
                        <span className="text-xs font-black text-emerald-400 font-mono block mt-0.5">
                          {predicted.band >= targetBand ? "مكتمل! 🎉" : `+${Math.max(0, targetBand - predicted.band).toFixed(1)}`}
                        </span>
                      </div>
                      <div className="p-2 bg-white/5 rounded-xl border border-white/5">
                        <span className="text-[9px] text-slate-455 block">الأيام المتبقية للاختبار</span>
                        <span className="text-xs font-black text-slate-205 font-mono block mt-0.5">{daysRemaining} يوم</span>
                      </div>
                      <div className="p-2 bg-white/5 rounded-xl border border-white/5">
                        <span className="text-[9px] text-slate-455 block">أيام الدراسة المستمرة</span>
                        <span className="text-xs font-black text-orange-400 font-mono block mt-0.5">{user.streak || 18} Active Days</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* 2. Structured Study Time Widgets Panel */}
                <div className="grid grid-cols-2 gap-3 text-right">
                  
                  {/* Hours studied today */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3.5 rounded-2.5xl text-right relative overflow-hidden group hover:border-purple-300 dark:hover:border-purple-900 transition-all">
                    <div className="flex justify-between items-center mb-1 flex-row-reverse">
                      <span className="p-1 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-450 rounded-lg">
                        <Clock className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-[9px] text-slate-450 font-bold block">دراسة اليوم</span>
                    </div>
                    <p className="text-sm font-black text-slate-800 dark:text-slate-100 font-mono mt-1 pt-0.5">
                      {studyHoursToday.toFixed(1)} <span className="text-[10px] font-sans">ساعة</span>
                    </p>
                    <p className="text-[8px] text-slate-400 mt-0.5 leading-none">مستهدف اليوم: 1.5 ساعة</p>
                  </div>

                  {/* Weekly study hours */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3.5 rounded-2.5xl text-right relative overflow-hidden group hover:border-purple-300 dark:hover:border-purple-900 transition-all">
                    <div className="flex justify-between items-center mb-1 flex-row-reverse">
                      <span className="p-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-450 rounded-lg">
                        <Calendar className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-[9px] text-slate-450 font-bold block">هذا الأسبوع</span>
                    </div>
                    <p className="text-sm font-black text-slate-800 dark:text-slate-100 font-mono mt-1 pt-0.5">
                      {studyHoursWeekly.toFixed(1)} <span className="text-[10px] font-sans">ساعة</span>
                    </p>
                    <p className="text-[8px] text-slate-400 mt-0.5 leading-none">إجمالي الساعات المتراكمة</p>
                  </div>

                  {/* Remaining hours today */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3.5 rounded-2.5xl text-right relative overflow-hidden group hover:border-purple-300 dark:hover:border-purple-900 transition-all">
                    <div className="flex justify-between items-center mb-1 flex-row-reverse">
                      <span className="p-1 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-450 rounded-lg">
                        <Sparkles className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-[9px] text-slate-450 font-bold block">متبقي الهدف</span>
                    </div>
                    <p className="text-sm font-black text-slate-800 dark:text-slate-100 font-mono mt-1 pt-0.5">
                      {Math.max(0, parseFloat((1.5 - studyHoursToday).toFixed(1)))} <span className="text-[10px] font-sans">ساعة</span>
                    </p>
                    <p className="text-[8px] text-slate-400 mt-0.5 leading-none">هدف المذاكرة المتبقي لليوم</p>
                  </div>

                  {/* Current Active Status */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-3.5 rounded-2.5xl text-right relative overflow-hidden group hover:border-purple-300 dark:hover:border-purple-900 transition-all">
                    <div className="flex justify-between items-center mb-1 flex-row-reverse">
                      <span className={`p-1 rounded-lg ${stopwatchActive ? 'bg-orange-50 dark:bg-orange-955/35 text-orange-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
                        <Activity className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-[9px] text-slate-450 font-bold block">الحالة حالياً</span>
                    </div>
                    <p className={`text-[10.5px] font-black mt-1 leading-normal truncate ${stopwatchActive ? 'text-orange-505 animate-pulse' : 'text-slate-700 dark:text-slate-300'}`}>
                      {stopwatchActive ? "جاري الدراسة بنشاط ⚡" : "جلسة جاهزة 🌱"}
                    </p>
                    <p className="text-[8px] text-slate-400 mt-0.5 leading-none">آخر جلسة: اليوم ومتاحة للحفظ</p>
                  </div>

                </div>

              </div>

            </div>

            {/* 4. DOWN DOCK: REAL DAILY TASKS & SOCIAL GAMIFICATION LEADERBOARD */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Daily tasks Checklist (Spans 8 columns) */}
              <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3.5xl p-5 shadow-sm text-right flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-slate-850 pb-3">
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold">DAILY PLAN AGENDA</span>
                    <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-xs">📚 أجندة التدريب اليومي المتكاملة (Direct Target Check)</h3>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-4 leading-normal">
                    رتبنا لك تدريباً موجهاً ومتنوعاً لممارسة جميع أدوات الأيلتس. اختبر وعلّم المنجز منها لتضمن تفعيل الذكاء في لوحة دراستك:
                  </p>

                  <div className="space-y-2.5">
                    {dailyTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`p-3.5 border rounded-2.5xl flex items-center justify-between transition-all ${
                          task.completed 
                            ? "bg-purple-50/5 dark:bg-purple-955/5 border-purple-200/20 dark:border-purple-900/40 opacity-70" 
                            : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:bg-slate-50/60 dark:hover:bg-slate-800/60 shadow-xs"
                        }`}
                      >
                        {/* Task completion ticker */}
                        <button
                          onClick={() => toggleDailyTask(task.id)}
                          className="text-slate-400 hover:text-purple-600 transition-colors cursor-pointer"
                        >
                          {task.completed ? (
                            <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          ) : (
                            <div className="h-4.5 w-4.5 border-2 border-slate-300 dark:border-slate-705 rounded-full"></div>
                          )}
                        </button>

                        <div className="flex-1 px-4 text-right min-w-0">
                          <p className={`text-xs font-bold leading-normal truncate ${task.completed ? "line-through text-slate-400 dark:text-slate-550" : "text-slate-755 dark:text-slate-205"}`}>
                            {task.skill}
                          </p>
                          <div className="flex items-center justify-end gap-2 text-[9.5px] text-slate-400 dark:text-slate-500 mt-1 font-mono">
                            <span>الشريك المقترح: {task.target}</span>
                            <span>•</span>
                            <span>المدة الزمنية المقدرة: {task.duration}</span>
                          </div>
                        </div>

                        {task.url && (
                          <a
                            href={task.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-purple-50 dark:bg-purple-955/30 hover:bg-purple-100 dark:hover:bg-purple-950/40 text-purple-800 dark:text-purple-305 font-bold text-[9.5px] px-2.5 py-1.5 rounded-xl flex items-center gap-1 shrink-0"
                          >
                            <span>فتح الرابط</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t dark:border-slate-805 flex justify-between items-center text-xs">
                  <span className="text-[10px] text-slate-400">
                    تم تدشين وإنجاز {dailyTasks.filter(t => t.completed).length} من أصل {dailyTasks.length} مهام مخصصة لليوم
                  </span>
                  <button 
                    onClick={() => {
                      setActiveTab("Profile");
                      setProfileSubTab("Weekly");
                    }}
                    className="text-[10.5px] text-purple-650 dark:text-purple-400 font-extrabold"
                  >
                    تعديل جدول خطتي الأكاديمية 📅
                  </button>
                </div>
              </div>

              {/* Leaderboard Competitors (Spans 4 columns) */}
              <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3.5xl p-5 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-slate-850 pb-3">
                    <span className="text-[10px] text-slate-400 font-bold font-mono">IELTS ARENA</span>
                    <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-xs flex items-center gap-1.5">
                      <span>لوحة الطلاب وصراع الصدارة اللغوي</span>
                      <Trophy className="h-4.5 w-4.5 text-amber-500 animate-pulse" />
                    </h3>
                  </div>

                  <p className="text-[10px] text-slate-405 dark:text-slate-455 mb-3 text-right leading-relaxed font-sans">
                    يتنافس دراسو الآيلتس على النقاط المكتسبة من حفظ مفردات AWL وصيانة الأيام الدراسية المتتالية (Streaks):
                  </p>

                  <div className="space-y-2">
                    {leaderboard.map((player, idx) => {
                      const isMe = player.name.includes("(أنت)");
                      return (
                        <div 
                          key={player.name + idx}
                          className={`p-2.5 border rounded-2xl flex items-center justify-between text-right transition-all ${
                            isMe 
                              ? "bg-purple-50/50 dark:bg-purple-955/20 border-purple-200/60 dark:border-purple-900 ring-1 ring-purple-100/50 dark:ring-purple-900/30 shadow-xs"
                              : "bg-white/50 dark:bg-slate-900 border-slate-101/60 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-850"
                          }`}
                        >
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
                            {player.score} نقطة
                          </span>

                          <div className="flex items-center gap-2 min-w-0 flex-row-reverse">
                            <span className="text-[10px] font-black text-slate-400 font-mono w-4 text-center">
                              #{idx + 1}
                            </span>
                            <img 
                              src={player.avatar} 
                              alt="Player avatar" 
                              className={`w-7 h-7 rounded-lg border bg-slate-100 dark:bg-slate-800 shrink-0 ${isMe ? "border-purple-300" : "border-slate-200 dark:border-slate-700"}`}
                              referrerPolicy="no-referrer"
                            />
                            <span className={`text-xs font-bold truncate ${isMe ? "text-purple-700 dark:text-purple-300 font-black" : "text-slate-800 dark:text-slate-202"}`}>
                              {player.name}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 text-center pt-2">
                  <span className="text-[9.5px] text-slate-405 dark:text-slate-450 block">احصل على 10 نقاط مقابل كل كلمة أكاديمية تدرسها لتتفوق! 💪</span>
                </div>
              </div>

            </div>

            {/* 5. DOCK: MISTAKES LOG */}
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3.5xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-slate-850 pb-3 flex-wrap gap-2">
                <button
                  onClick={() => {
                    setActiveMistakes([]);
                    localStorage.removeItem("ielts_mistakes_log");
                  }}
                  className="text-[10px] text-red-500 hover:text-red-650 font-bold hover:underline cursor-pointer"
                >
                  تصفير سجل الأخطاء 🗑
                </button>
                <h3 className="font-extrabold text-slate-800 dark:text-slate-101 text-xs flex items-center gap-1.5 justify-end">
                  <span>سجل أخطائي المرصودة ونقاط الضعف التفادية (My Weaknesses)</span>
                  <AlertCircle className="h-4.5 w-4.5 text-purple-600" />
                </h3>
              </div>

              <p className="text-xs text-slate-405 dark:text-slate-450 mb-4 leading-relaxed text-right">
                اكتب الأخطاء اللغوية أو النحوية والملحوظات التي يُكسبك إياها الذكاء الاصطناعي خلال التصحيح لتراجعها دورياً وتضمن علامات عالية:
              </p>

              <form onSubmit={handleAddMistake} className="flex gap-2 mb-4 font-sans">
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all cursor-pointer shrink-0"
                >
                  حفظ في السجل
                </button>
                <input
                  type="text"
                  value={newMistake}
                  onChange={(e) => setNewMistake(e.target.value)}
                  placeholder="مثال: نسيت وضع S المفرد مع النعوت، استخدام to infinitive الخاطئ بعد allow..."
                  className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs rounded-xl p-2.5 focus:outline-none focus:ring-1 focus:ring-purple-500 text-right text-slate-700 dark:text-slate-100"
                  dir="rtl"
                />
              </form>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {activeMistakes.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-xs bg-slate-50/40 dark:bg-slate-950/20 rounded-2xl border border-dashed dark:border-slate-800">
                    رائعة وأداء خارق بدون أخطاء مسجلة مؤخراً! صيانة السلاسل اللغوية مستمرة.
                  </div>
                ) : (
                  activeMistakes.map((mis, idx) => (
                    <div key={idx} className="p-3 bg-red-50/10 dark:bg-red-955/5 rounded-xl border border-red-105/20 text-xs text-right text-red-800 dark:text-red-400 leading-relaxed flex justify-between items-center gap-3">
                      <button
                        onClick={() => {
                          const updated = activeMistakes.filter((_, i) => i !== idx);
                          setActiveMistakes(updated);
                          localStorage.setItem("ielts_mistakes_log", JSON.stringify(updated));
                        }}
                        className="text-[10px] text-red-400 hover:text-red-600 font-bold"
                      >
                        حذف
                      </button>
                      <p className="flex-1 font-sans" dir="rtl">• {mis}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}

        {/* Practice Skills Sections routes */}
        {activeTab === "Reading" && <ReadingPractice />}
        {activeTab === "Listening" && <ListeningPractice />}
        {activeTab === "Speaking" && <SpeakingPractice />}
        {activeTab === "Writing" && <WritingPractice />}
        {activeTab === "Vocabulary" && <VocabularyPractice />}

        {/* PROFILE TAB (Compiled Analytics, Weekly Plan, Account customization, and Themes) */}
        {activeTab === "Profile" && (
          <div className="space-y-6 md:space-y-8 animate-fade-in text-right">
            
            {/* Header subtabs select pills */}
            <div className="flex justify-center sm:justify-end gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl w-fit mr-0 sm:mr-auto">
              
              <button
                onClick={() => setProfileSubTab("Settings")}
                className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                  profileSubTab === "Settings"
                    ? "bg-white dark:bg-slate-800 text-purple-750 dark:text-purple-300 shadow-xs"
                    : "text-slate-450 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                المظهر والملف الشخصي ⚙️
              </button>

              <button
                onClick={() => setProfileSubTab("Weekly")}
                className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                  profileSubTab === "Weekly"
                    ? "bg-white dark:bg-slate-800 text-purple-750 dark:text-purple-300 shadow-xs"
                    : "text-slate-450 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                برنامج دراستي الأسبوعي 📅
              </button>

              <button
                onClick={() => setProfileSubTab("Analytics")}
                className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all cursor-pointer ${
                  profileSubTab === "Analytics"
                    ? "bg-white dark:bg-slate-800 text-purple-750 dark:text-purple-300 shadow-xs"
                    : "text-slate-450 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                لوحة إحصاءاتي وأدائي 📊
              </button>

            </div>

            {/* Profile Sub tab switch renders */}
            {profileSubTab === "Analytics" && <Analytics />}
            {profileSubTab === "Weekly" && <WeeklyPlan />}
            
            {profileSubTab === "Settings" && (
              <div className="space-y-6">
                
                {/* User Settings Core Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3.5xl p-5 md:p-6 shadow-sm text-right space-y-6">
                  
                  <div className="border-b dark:border-slate-800 pb-4">
                    <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">⚙️ إعدادات الحساب والمستهدف الشخصي (Milestones)</h3>
                    <p className="text-xs text-slate-400 mt-1">تحديد سقفك الدراسي للأيلتس ومزامنة خطوط التقدم فوراً بمحرك Firebase Cloud:</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Editable target band */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">درجة البند المرجوة في اختبار الآيلتس (IELTS Target Band Score):</label>
                      <div className="flex gap-2">
                        {([6.0, 6.5, 7.0, 7.5, 8.0, 8.5] as const).map((b) => (
                          <button
                            key={b}
                            onClick={() => handleUpdateTargetBand(b)}
                            className={`flex-1 py-2 text-xs font-extrabold rounded-xl border transition-all cursor-pointer font-mono ${
                              targetBand === b
                                ? "bg-purple-600 border-purple-650 text-white shadow-md shadow-purple-500/15"
                                : "bg-slate-50 dark:bg-slate-800 border-slate-201 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                            }`}
                          >
                            {b.toFixed(1)}
                          </button>
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-400 leading-normal">يساعدنا مؤشر المستهدف على توجيه نماذج ومواضيع التصحيح بالذكاء الاصطناعي بدقة تامة لتناسب لجان الاختبار.</p>
                    </div>

                    {/* Deadline update test date */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-300">يوم اختبارك الموعود (IELTS Exam Date):</label>
                      <input
                        type="date"
                        value={examDate}
                        onChange={(e) => setExamDate(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:outline-none text-xs text-center font-mono text-slate-700 dark:text-slate-200 focus:ring-1 focus:ring-purple-500"
                      />
                      <span className="text-[10px] text-purple-650 dark:text-purple-400 block font-bold leading-normal">
                        يتبقى لديك {daysRemaining} يوم دراسة مكثف! البوابة تتكيف لجدولة كبسولات المراجعة تلقائياً.
                      </span>
                    </div>

                  </div>

                </div>

                {/* Light/Dark dynamic theme personalization */}
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3.5xl p-5 md:p-6 shadow-sm text-right space-y-4">
                  <div>
                    <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">🎨 تخصيص مظهر المنصة البصري (Platform Palette)</h3>
                    <p className="text-xs text-slate-400 mt-1">اختر المظهر المريح لعينيك لتضمن تفاعل هادئ ومستمر لساعات طويلة:</p>
                  </div>

                  <div className="flex items-center justify-between bg-slate-50/50 dark:bg-slate-950 p-4 rounded-2.5xl border dark:border-slate-850 gap-4 flex-wrap">
                    
                    {/* Theme selector toggle buttons */}
                    <div className="flex bg-white dark:bg-slate-900 border dark:border-slate-800 p-1.5 rounded-xl shrink-0">
                      
                      <button
                        type="button"
                        onClick={() => setThemeMode("light")}
                        className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                          themeMode === "light" 
                            ? "bg-purple-600 text-white shadow-xs" 
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-850"
                        }`}
                      >
                        <Sun className="h-4 w-4" />
                        <span>نهاري ☀️</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setThemeMode("dark")}
                        className={`px-4 py-2 text-xs font-extrabold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                          themeMode === "dark" 
                            ? "bg-purple-600 text-white shadow-xs" 
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-150"
                        }`}
                      >
                        <Moon className="h-4 w-4" />
                        <span>ليلي 🌙</span>
                      </button>

                    </div>

                    <div className="text-right">
                      <span className="text-xs font-black text-slate-800 dark:text-slate-100 block">تبديل نمط الإضاءة</span>
                      <p className="text-[10.5px] text-slate-405 dark:text-slate-450 mt-1">تتكيف جميع صفحة القراءة والتحدث لملاءمة المظهر والمدى المختار تلقائياً وبألوان راقية ليلية.</p>
                    </div>

                  </div>
                </div>

                {/* Cloud storage information */}
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3.5xl p-5 md:p-6 shadow-sm text-right flex items-center gap-3 justify-between flex-wrap">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    <span className="font-extrabold text-slate-700 dark:text-slate-300 block">نظام التخزين السحابي متصل بالكامل 🌐</span>
                    <p className="mt-1">يجرى مزامنة سجل درجاتك، مذكراتك، كلماتك، وجدولة خطتك مع قاعدة البيانات السحابية Firebase باحترافية تامة لتبقى مخزنة بأمان.</p>
                  </div>
                  <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/30 border border-emerald-250/30 text-emerald-800 dark:text-emerald-300 font-bold px-3 py-1.5 rounded-xl">
                    ● متصل وآمن (Firebase Cloud Enabled)
                  </span>
                </div>

              </div>
            )}

          </div>
        )}

      </main>

      {/* GLOWING BOTTOM NAVIGATION BAR (Equal Spacing, Rounded, Responsive) */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[93%] max-w-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-slate-200/50 dark:border-slate-800 rounded-2.5xl shadow-2xl py-2.5 px-3 z-50 flex justify-between items-center gap-1 font-sans">
        
        {/* Home */}
        <button
          onClick={() => setActiveTab("Home")}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer relative ${
            activeTab === "Home" 
              ? "text-purple-600 dark:text-purple-400 font-bold scale-105" 
              : "text-slate-450 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-205"
          }`}
        >
          <HomeIcon className="h-4.5 w-4.5" />
          <span className="text-[9.5px] mt-1">الرئيسية</span>
          {activeTab === "Home" && (
            <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-purple-600 dark:bg-purple-405 shadow-sm shadow-purple-500"></span>
          )}
        </button>

        {/* Reading */}
        <button
          onClick={() => setActiveTab("Reading")}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer relative ${
            activeTab === "Reading" 
              ? "text-emerald-600 dark:text-emerald-400 font-bold scale-105" 
              : "text-slate-450 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-205"
          }`}
        >
          <BookOpen className="h-4.5 w-4.5" />
          <span className="text-[9.5px] mt-1">القراءة</span>
          {activeTab === "Reading" && (
            <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-emerald-600 dark:bg-emerald-405 shadow-sm shadow-emerald-500"></span>
          )}
        </button>

        {/* Listening */}
        <button
          onClick={() => setActiveTab("Listening")}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer relative ${
            activeTab === "Listening" 
              ? "text-orange-550 dark:text-orange-400 font-bold scale-105" 
              : "text-slate-450 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-205"
          }`}
        >
          <Headphones className="h-4.5 w-4.5" />
          <span className="text-[9.5px] mt-1">الاستماع</span>
          {activeTab === "Listening" && (
            <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-orange-550 dark:bg-orange-405 shadow-sm shadow-orange-500"></span>
          )}
        </button>

        {/* Speaking */}
        <button
          onClick={() => setActiveTab("Speaking")}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer relative ${
            activeTab === "Speaking" 
              ? "text-indigo-600 dark:text-indigo-400 font-bold scale-105" 
              : "text-slate-450 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-205"
          }`}
        >
          <Mic className="h-4.5 w-4.5" />
          <span className="text-[9.5px] mt-1">المحادثة</span>
          {activeTab === "Speaking" && (
            <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-indigo-600 dark:bg-indigo-405 shadow-sm shadow-indigo-500"></span>
          )}
        </button>

        {/* Vocabulary */}
        <button
          onClick={() => setActiveTab("Vocabulary")}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer relative ${
            activeTab === "Vocabulary" 
              ? "text-pink-600 dark:text-pink-400 font-bold scale-105" 
              : "text-slate-450 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-205"
          }`}
        >
          <Brain className="h-4.5 w-4.5" />
          <span className="text-[9.5px] mt-1">المفردات</span>
          {activeTab === "Vocabulary" && (
            <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-pink-600 dark:bg-pink-405 shadow-sm shadow-pink-500"></span>
          )}
        </button>

        {/* Profile Stats */}
        <button
          onClick={() => {
            setActiveTab("Profile");
            setProfileSubTab("Analytics");
          }}
          className={`flex-1 flex flex-col items-center justify-center py-1 rounded-xl transition-all cursor-pointer relative ${
            activeTab === "Profile" 
              ? "text-purple-650 dark:text-purple-400 font-bold scale-105" 
              : "text-slate-450 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-205"
          }`}
        >
          <BarChart3 className="h-4.5 w-4.5" />
          <span className="text-[9.5px] mt-1">الإحصائيات</span>
          {activeTab === "Profile" && (
            <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-purple-650 dark:bg-purple-405 shadow-sm shadow-purple-500"></span>
          )}
        </button>

      </div>

    </div>
  );
}

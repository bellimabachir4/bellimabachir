import React, { useState, useEffect } from "react";
import { useAuth, WordProgress } from "../contexts/AuthContext";
import { 
  BookOpen, 
  Award, 
  Volume2, 
  RefreshCw, 
  CheckCircle, 
  XSquare, 
  ChevronRight, 
  Search, 
  Brain, 
  Layers, 
  Check, 
  X,
  Play,
  RotateCcw,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  Timer,
  BookMarked,
  Lightbulb,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { ACADEMIC_VOCAB_LIBRARY, VocabCategory, VocabItem } from "../data/academicVocab";
import { motion, AnimatePresence } from "motion/react";

// Assign levels to categories for the requested Beginner/Intermediate/Advanced filter
const CATEGORY_LEVELS: Record<string, "Beginner" | "Intermediate" | "Advanced"> = {
  education: "Beginner",
  society: "Beginner",
  work: "Beginner",
  technology: "Intermediate",
  environment: "Intermediate",
  health: "Intermediate",
  linking_words: "Intermediate",
  awl: "Advanced",
  government: "Advanced",
  globalization: "Advanced",
  media: "Advanced"
};

export default function VocabularyPractice() {
  const { user, wordProgress, toggleWordStatus, addPracticeResult } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<"browse" | "quiz" | "ai-tutor">("browse");
  
  // Filters state
  const [selectedDifficulty, setSelectedDifficulty] = useState<"All" | "Beginner" | "Intermediate" | "Advanced">("All");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("awl");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);

  // States for Quiz Tab
  const [quizState, setQuizState] = useState<"setup" | "active" | "completed">("setup");
  const [quizCategory, setQuizCategory] = useState<string>("all");
  const [quizDifficulty, setQuizDifficulty] = useState<"all" | "Beginner" | "Intermediate" | "Advanced">("all");
  const [quizDirection, setQuizDirection] = useState<"eng_ar" | "ar_eng" | "mixed">("eng_ar");
  const [isDailyChallenge, setIsDailyChallenge] = useState<boolean>(false);
  
  // Timer State
  const [timeLeft, setTimeLeft] = useState<number>(20);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  // Active quiz questions
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [failedQuestions, setFailedQuestions] = useState<any[]>([]);
  
  // Flashcards state
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // AI Vocabulary assistant state
  const [aiWord, setAiWord] = useState<string>("");
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiResult, setAiResult] = useState<any | null>(null);
  const [aiError, setAiError] = useState<string>("");
  const [aiQuizAnswered, setAiQuizAnswered] = useState<boolean>(false);
  const [aiQuizSelected, setAiQuizSelected] = useState<string | null>(null);

  // Speech generation helper
  const playPronunciation = (word: string) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = "en-US";
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Connect helper to track learned/favorites via globally managed wordProgress array
  const checkStatus = (word: string) => {
    const clean = word.toLowerCase().trim();
    const found = wordProgress.find(wp => wp.word.toLowerCase().trim() === clean);
    return {
      learned: found ? found.learned : false,
      favorited: found ? found.favorited : false
    };
  };

  // Setup the Timer count down
  useEffect(() => {
    let timer: any;
    if (timerActive && timeLeft > 0 && quizState === "active" && !isAnswerSubmitted) {
      timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive && quizState === "active" && !isAnswerSubmitted) {
      // Auto submit on timeout
      setSelectedOption("TIME_EXPIRED");
      setIsAnswerSubmitted(true);
      setTimerActive(false);
      
      const currentQ = questions[currentIndex];
      setFailedQuestions(prev => [...prev, {
        word: currentQ.question,
        selected: "انتهى الوقت ⏱️",
        correct: currentQ.correctOption,
        explanation: "لقد نفد العداد الزمني (20 ثانية) قبل اختيار بديل ترجمة مناسب."
      }]);
    }
    return () => clearTimeout(timer);
  }, [timeLeft, timerActive, quizState, isAnswerSubmitted]);

  // Categories filtered by difficulty
  const categoriesList = ACADEMIC_VOCAB_LIBRARY.filter(cat => {
    if (selectedDifficulty === "All") return true;
    return CATEGORY_LEVELS[cat.id] === selectedDifficulty;
  });

  // Flat word library with Level assignments for universal search
  const flatWording = ACADEMIC_VOCAB_LIBRARY.flatMap(cat => 
    cat.words.map(w => ({
      ...w,
      categoryTitle: cat.title,
      categoryId: cat.id,
      level: CATEGORY_LEVELS[cat.id]
    }))
  );

  const getFilteredWords = () => {
    let list = flatWording;

    // Filter by specific Category unless searching globally
    if (!searchTerm && selectedCategoryId) {
      list = flatWording.filter(w => w.categoryId === selectedCategoryId);
    }

    // Filter by difficulty if set
    if (selectedDifficulty !== "All") {
      list = list.filter(w => w.level === selectedDifficulty);
    }

    // Filter by favorites only
    if (showOnlyFavorites) {
      list = list.filter(w => checkStatus(w.eng).favorited);
    }

    // Apply search term matches
    const term = searchTerm.toLowerCase().trim();
    if (term) {
      list = list.filter(w => 
        w.eng.toLowerCase().includes(term) || w.ar.includes(term)
      );
    }

    return list;
  };

  const activeCategory = ACADEMIC_VOCAB_LIBRARY.find(cat => cat.id === selectedCategoryId) || ACADEMIC_VOCAB_LIBRARY[0];
  const renderedWordsList = getFilteredWords();

  // Initiate a Quiz Campaign
  const buildQuiz = (isDaily = false) => {
    setIsDailyChallenge(isDaily);
    
    // Choose pool of word items
    let wordPool = flatWording;

    if (isDaily) {
      // Pick 5 completely random words
      wordPool = [...flatWording].sort(() => 0.5 - Math.random()).slice(0, 5);
    } else {
      // Normal setup
      if (quizDifficulty !== "all") {
        wordPool = wordPool.filter(w => w.level === quizDifficulty);
      }
      if (quizCategory !== "all") {
        wordPool = wordPool.filter(w => w.categoryId === quizCategory);
      }
    }

    if (wordPool.length < 5) {
      alert("البيانات غير كافية لإنشاء خمسة أسئلة. الرجاء توسيع نطاقات الفئات.");
      return;
    }

    const queryCount = isDaily ? 5 : 10;
    const targets = [...wordPool].sort(() => 0.5 - Math.random()).slice(0, queryCount);

    const quizQuestions = targets.map(word => {
      let activeDir = quizDirection;
      if (quizDirection === "mixed") {
        activeDir = Math.random() > 0.5 ? "eng_ar" : "ar_eng";
      }

      const qPrompt = activeDir === "eng_ar" ? word.eng : word.ar;
      const correctChoice = activeDir === "eng_ar" ? word.ar : word.eng;

      // Draw distractors
      const candidateDistractors = wordPool
        .filter(w => w.eng !== word.eng)
        .map(w => (activeDir === "eng_ar" ? w.ar : w.eng));

      const uniqueDistractors = Array.from(new Set(candidateDistractors))
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      const options = [correctChoice, ...uniqueDistractors].sort(() => 0.5 - Math.random());

      // Prepare contextual explanations
      const explainText = activeDir === "eng_ar" 
        ? `الكلمة الإنجليزية '${word.eng}' تطابق الترجمة العربية '${word.ar}' وهي شائعة الاستخدام لزيادة حصيلة التعبير في باند آيلتس.`
        : `الترجمة العربية '${word.ar}' تقابل الكلمة الأكاديمية '${word.eng}' وتتميز بأهمية بالغة في اختبارات القراءة والكتابة.`;

      return {
        wordItem: word,
        question: qPrompt,
        correctOption: correctChoice,
        options,
        direction: activeDir,
        explanation: explainText
      };
    });

    setQuestions(quizQuestions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setFailedQuestions([]);
    
    // Dynamic timer per question
    setTimeLeft(20);
    setTimerActive(true);

    setQuizState("active");
  };

  const handleSelectOption = (opt: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(opt);
  };

  const submitQuizAnswer = () => {
    if (isAnswerSubmitted || !selectedOption) return;
    setTimerActive(false);

    const question = questions[currentIndex];
    const isCorrect = selectedOption === question.correctOption;

    if (isCorrect) {
      setScore(prev => prev + 1);
    } else {
      setFailedQuestions(prev => [...prev, {
        word: question.question,
        selected: selectedOption,
        correct: question.correctOption,
        explanation: question.explanation
      }]);
    }

    setIsAnswerSubmitted(true);
  };

  const advanceQuiz = () => {
    setIsAnswerSubmitted(false);
    setSelectedOption(null);
    
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setTimeLeft(20);
      setTimerActive(true);
    } else {
      // Quiz completed! Save history result
      const achievedPercent = Math.round((score / questions.length) * 100);
      const detailString = isDailyChallenge 
        ? `أكمل التحدي اليومي وحصل على ${score}/${questions.length} كلمات اتقان.`
        : `أنهى كويز المفردات الأكاديمية، فئة: ${quizCategory === 'all' ? 'جميع التصنيفات' : quizCategory}، مستوى: ${quizDifficulty}.`;
      
      addPracticeResult("Vocabulary", `${score}/${questions.length} (${achievedPercent}%)`, detailString);
      setQuizState("completed");
    }
  };

  // AI assistant integration
  const queryAiTutor = async (targetWordStr?: string) => {
    const finalWord = targetWordStr || aiWord;
    if (!finalWord || finalWord.trim().length === 0) {
      setAiError("الرجاء كتابة كلمة إنجليزية أكاديمية أولاً لتفسيرها.");
      return;
    }

    setAiLoading(true);
    setAiError("");
    setAiResult(null);
    setAiQuizAnswered(false);
    setAiQuizSelected(null);

    // If they clicked a word in list, sync the input search representation
    if (targetWordStr) {
      setAiWord(targetWordStr);
    }

    try {
      const response = await fetch("/api/vocab/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: finalWord })
      });

      if (!response.ok) {
        throw new Error("حدث خطأ في طلب التفسير ومزامنة مساعد الذكاء الاصطناعي.");
      }

      const parsed = await response.json();
      setAiResult(parsed);
      setActiveSubTab("ai-tutor");
    } catch (err: any) {
      setAiError(err.message || "فشلت عملية التحليل عبر خادم الذكاء، تحقق من اتصالك.");
    } finally {
      setAiLoading(false);
    }
  };

  // Flashcards state management helpers
  const totalMarkedLearned = wordProgress.filter(wp => wp.learned).length;

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/40 p-5 sm:p-6 md:p-8 font-sans shadow-xl text-right animate-fade-in relative z-10">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-200/40 pb-5">
        <div>
          <div className="flex items-center gap-2 justify-end mb-1">
            <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md font-bold">باند 7.0+ 📈</span>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 justify-end">
              <span>التدريب اللغوي والمفردات الأكاديمية (IELTS Vocab)</span>
              <Brain className="h-5.5 w-5.5 text-purple-600" />
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            تدرب على أكثر من 300 كلمة آيلتس مع تقسيمات الصعوبة وفلاش كاردز تفاعلية وكويزات ومساعد ذكاء اصطناعي تفصيلي.
          </p>
        </div>

        {/* Total stats */}
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="bg-gradient-to-l from-purple-600 to-indigo-600 text-white font-bold px-4 py-1.5 rounded-2xl text-xs flex items-center gap-2 shadow-md shadow-purple-500/10">
            <BookMarked className="h-3.5 w-3.5" />
            <span>حفظت {totalMarkedLearned} كلمة في حسابك 🎖️</span>
          </div>
          {user && (
            <span className="text-[10px] text-slate-400 font-mono">نقاط المفردات: {user.vocabularyScore} نقطة</span>
          )}
        </div>
      </div>

      {/* TOP COMPREHENSIVE DAILY CHALLENGE WIDGET */}
      {quizState !== "active" && (
        <div className="mb-6 bg-gradient-to-r from-purple-50/70 via-indigo-50/70 to-white border border-purple-200/30 p-4 rounded-2.5xl flex flex-col md:flex-row items-center justify-between gap-4 text-right">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-purple-600 text-white rounded-2xl animate-pulse">
              <Award className="h-5 w-5" />
            </span>
            <div>
              <h4 className="text-xs font-bold text-slate-800">🔥 التحدي اليومي للمفردات الأكاديمية</h4>
              <p className="text-[10px] text-slate-500 mt-0.5">امتحن نفسك في 5 كلمات عشوائية اليوم واكسب 50 نقطة مكافأة فورية!</p>
            </div>
          </div>
          <button
            onClick={() => {
              setActiveSubTab("quiz");
              buildQuiz(true);
            }}
            className="w-full md:w-auto px-5 py-2 hover:indigo-50 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            البدء بالتحدي اليومي السريع ⚡
          </button>
        </div>
      )}

      {/* THREE SUB-TAB CONTROL TABS */}
      <div className="flex flex-wrap border-b border-slate-100 mb-6 gap-1 font-semibold justify-end">
        <button
          onClick={() => {
            setActiveSubTab("ai-tutor");
            setAiError("");
          }}
          className={`px-4.5 py-2.5 text-xs sm:text-sm transition-all border-b-2 flex items-center gap-1.5 ${
            activeSubTab === "ai-tutor"
              ? "border-purple-600 text-purple-700 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>المساعد الذكي للكلمات 🤖</span>
          <Sparkles className="h-4 w-4 text-purple-500" />
        </button>

        <button
          onClick={() => {
            setActiveSubTab("quiz");
            setQuizState("setup");
          }}
          className={`px-4.5 py-2.5 text-xs sm:text-sm transition-all border-b-2 flex items-center gap-1.5 ${
            activeSubTab === "quiz"
              ? "border-purple-600 text-purple-700 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>اختبار الآيلتس التفاعلي</span>
          <Layers className="h-4 w-4" />
        </button>

        <button
          onClick={() => {
            setActiveSubTab("browse");
          }}
          className={`px-4.5 py-2.5 text-xs sm:text-sm transition-all border-b-2 flex items-center gap-1.5 ${
            activeSubTab === "browse"
              ? "border-purple-600 text-purple-700 font-bold"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <span>تصفّح وفلاش كاردز 📚</span>
          <BookOpen className="h-4 w-4" />
        </button>
      </div>

      {/* ==============================
          BROWSE WORDS VIEW
         ============================== */}
      {activeSubTab === "browse" && (
        <div className="space-y-6">
          
          {/* Difficulty Difficulty Levels row */}
          <div className="flex flex-wrap justify-between items-center gap-2 bg-slate-50/70 p-1.5 rounded-2xl border border-slate-100">
            <span className="text-xs font-bold text-slate-500 px-2">مستوى صعوبة الكلمة:</span>
            <div className="flex gap-1">
              {(["All", "Beginner", "Intermediate", "Advanced"] as const).map(diff => (
                <button
                  key={diff}
                  onClick={() => {
                    setSelectedDifficulty(diff);
                    setSearchTerm("");
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedDifficulty === diff
                      ? "bg-white text-slate-800 shadow-sm border border-slate-200"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {diff === "All" ? "الكل" : diff === "Beginner" ? "مبتدئ ✨" : diff === "Intermediate" ? "متوسط ⚡" : "متقدم 🔥"}
                </button>
              ))}
            </div>
          </div>

          {/* Categories select Grid */}
          <div>
            <label className="block text-xs font-bold text-slate-450 dark:text-slate-400 mb-1.5 text-right">اختر الفئة اللغوية للدراسة:</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {categoriesList.map(cat => {
                const isSelected = selectedCategoryId === cat.id && !searchTerm;
                const level = CATEGORY_LEVELS[cat.id];
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategoryId(cat.id);
                      setSearchTerm("");
                    }}
                    className={`p-3 rounded-2xl border text-right transition-all flex flex-col justify-between h-20 cursor-pointer ${
                      isSelected
                        ? "bg-purple-600 border-purple-600 text-white shadow-lg"
                        : "bg-slate-100/50 dark:bg-slate-800 hover:bg-slate-150/90 dark:hover:bg-slate-700/90 border-slate-205/45 dark:border-slate-800 text-slate-700 dark:text-slate-200"
                    }`}
                  >
                    <div className="flex justify-between items-start w-full">
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${isSelected ? "bg-white/20 text-white" : "bg-white dark:bg-slate-900 border dark:border-slate-800 text-slate-400 dark:text-slate-500 font-mono"}`}>
                        {level}
                      </span>
                      <span className="text-lg">{cat.icon}</span>
                    </div>
                    <span className="text-xs font-bold truncate text-right w-full" dir="auto">{cat.title.split(" (")[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search, Action bar and Favorites Filter Toggle */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Box */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث عن كلمة بالإنجليزية أو العربية (مثال: access, تنوع)..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2.5xl py-3 px-10 text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 text-right pr-4 pl-10 font-sans text-slate-800 dark:text-slate-100"
              />
              <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3.5" />
            </div>

            {/* Favorite Filter Button */}
            <button
              onClick={() => setShowOnlyFavorites(prev => !prev)}
              className={`px-4 py-2 text-xs font-bold rounded-2xl border transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer ${
                showOnlyFavorites
                  ? "bg-pink-50 dark:bg-pink-955/20 border-pink-250 dark:border-pink-900/50 text-pink-700 dark:text-pink-300"
                  : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-650 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              <Bookmark className={`h-4 w-4 ${showOnlyFavorites ? "fill-pink-500 text-pink-500" : ""}`} />
              <span>{showOnlyFavorites ? "عرض المفضلة فقط ★" : "فرز المفضلة"}</span>
            </button>
          </div>

          {/* List display */}
          <div className="space-y-3 font-sans">
            <div className="flex justify-between items-center px-1 text-xs text-slate-400 font-bold font-mono">
              <span>{renderedWordsList.length} كلمة مطابقة حالية</span>
              <span>انقر لتشغيل النطق أو تعميد التفسير الذكي 🤖</span>
            </div>

            {renderedWordsList.length === 0 ? (
              <div className="bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 border-dashed rounded-3xl py-12 text-center text-xs text-slate-450 dark:text-slate-500">
                لم نجد أي كلمات تطابق الاختيارات المحددة. جرب وسع محركات الفرز!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {renderedWordsList.map((item, idx) => {
                  const status = checkStatus(item.eng);
                  return (
                    <div 
                      key={idx}
                      className={`p-3.5 bg-white dark:bg-slate-900 hover:bg-slate-50/40 dark:hover:bg-slate-800/40 rounded-2xl border transition-all duration-300 flex flex-col justify-between gap-3 shadow-xs hover:shadow-md hover:-translate-y-0.5 ${
                        status.learned 
                          ? "border-purple-200/80 dark:border-purple-900/40 shadow-sm shadow-purple-500/5" 
                          : "border-slate-100 dark:border-slate-800"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        {/* Word status actions */}
                        <div className="flex items-center gap-1.5">
                          {/* Favorite button */}
                          <button
                            onClick={() => toggleWordStatus(item.eng, "favorited", !status.favorited, item.categoryId)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              status.favorited 
                                ? "bg-pink-50 dark:bg-pink-955/35 text-pink-600 border border-pink-100 dark:border-pink-905/30" 
                                : "bg-slate-50 dark:bg-slate-800 text-slate-400 border border-slate-200/40 hover:text-pink-600 hover:bg-pink-50"
                            }`}
                            title="حفظ في المفضلة"
                          >
                            <Bookmark className={`h-3 w-3 ${status.favorited ? "fill-pink-500 text-pink-600" : ""}`} />
                          </button>

                          {/* Learn Indicator Button */}
                          <button
                            onClick={() => toggleWordStatus(item.eng, "learned", !status.learned, item.categoryId)}
                            className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all flex items-center gap-1 cursor-pointer ${
                              status.learned 
                                ? "bg-purple-100 dark:bg-purple-955/35 border-purple-200 dark:border-purple-900 text-purple-750 dark:text-purple-300" 
                                : "bg-slate-50 dark:bg-slate-800 border-slate-200/50 dark:border-slate-700 text-slate-500 hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-950/20"
                            }`}
                          >
                            {status.learned ? <Check className="h-2.5 w-2.5" /> : <div className="w-2.5 h-2.5 rounded-full border border-slate-350 dark:border-slate-650"></div>}
                            <span>{status.learned ? "تعلمتها" : "غير مدروسة"}</span>
                          </button>
                        </div>

                        {/* Interactive Word Pronounce and English presentation */}
                        <div className="flex items-center gap-1.5 font-sans">
                          <button
                            onClick={() => playPronunciation(item.eng)}
                            className="p-1 px-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-purple-55 dark:hover:bg-purple-950/40 rounded-lg text-slate-405 hover:text-purple-600 transition-colors cursor-pointer"
                            title="قراءة صوتية"
                          >
                            <Volume2 className="h-3 w-3" />
                          </button>
                          <span className="font-sans font-bold text-slate-900 dark:text-slate-100 tracking-wide text-xs sm:text-sm">{item.eng}</span>
                        </div>
                      </div>

                      {/* Translations and AI assist shortcut */}
                      <div className="flex justify-between items-center mt-1 pt-2 border-t border-slate-101/70 dark:border-slate-800 px-0.5">
                        <button
                          onClick={() => queryAiTutor(item.eng)}
                          className="text-[9.5px] text-purple-650 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-bold bg-purple-50/50 dark:bg-purple-950/20 px-2 py-1 rounded-md border border-purple-105/20 flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles className="h-2.5 w-2.5 text-purple-550" />
                          <span>تفسير ذكي 🤖</span>
                        </button>

                        <div className="text-right">
                          <span className="text-[9px] text-slate-400 dark:text-slate-505 block font-bold leading-none mb-0.5">الترجمة:</span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">{item.ar}</span>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}


      {/* ==============================
          INTERACTIVE QUIZ VIEW
         ============================== */}
      {activeSubTab === "quiz" && (
        <div className="space-y-6">
          
          {/* 1. SETUP QUIZ TAB SCREEN */}
          {quizState === "setup" && (
            <div className="max-w-2xl mx-auto bg-slate-50/60 p-6 sm:p-8 rounded-3xl border border-slate-200/60 text-center flex flex-col items-center justify-center space-y-6 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-650 flex items-center justify-center shadow-inner">
                <Brain className="h-8 w-8 text-indigo-650" />
              </div>
              
              <div>
                <h3 className="text-base font-black text-slate-800">تجهيز اختبار المفردات للأيلتس MCQ</h3>
                <p className="text-xs text-slate-500 mt-1">
                  اختبر دقة ومعرفة كلماتك وادعم حصيلتك بمؤقت تراجعي لزيادة سرعة التذكر في لجان الاختبارات.
                </p>
              </div>

              <div className="w-full space-y-4 max-w-lg mt-2 text-right">
                
                {/* Score stats indicators if available */}
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Category level selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-550 mb-1.5">مستوى الصعوبة المطلوبة:</label>
                    <select
                      value={quizDifficulty}
                      onChange={(e) => setQuizDifficulty(e.target.value as any)}
                      className="w-full bg-white border border-slate-205/60 text-xs rounded-xl p-3 text-slate-705 focus:outline-none focus:ring-1 focus:ring-purple-500 font-sans font-semibold"
                    >
                      <option value="all">كل المستويات (All Levels)</option>
                      <option value="Beginner">مبتدئ (Beginner)</option>
                      <option value="Intermediate">متوسط (Intermediate)</option>
                      <option value="Advanced">متقدم (Advanced)</option>
                    </select>
                  </div>

                  {/* Topic category selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-555 mb-1.5 font-sans">اختر قسم مخصص للكلمات:</label>
                    <select
                      value={quizCategory}
                      onChange={(e) => setQuizCategory(e.target.value)}
                      className="w-full bg-white border border-slate-205/60 text-xs rounded-xl p-3 text-slate-705 focus:outline-none focus:ring-1 focus:ring-purple-500 font-semibold"
                    >
                      <option value="all font-sans">جميع الأقسـام (All Topics)</option>
                      {ACADEMIC_VOCAB_LIBRARY.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.title}</option>
                      ))}
                    </select>
                  </div>

                </div>

                {/* Translation Prompt Directions option */}
                <div>
                  <label className="block text-xs font-bold text-slate-505 mb-1.5 font-sans">تحديد اتجاه السؤال والترجمة:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["eng_ar", "ar_eng", "mixed"] as const).map(dir => (
                      <button
                        key={dir}
                        onClick={() => setQuizDirection(dir)}
                        className={`p-2.5 rounded-xl border text-xs font-semibold font-sans transition-all ${
                          quizDirection === dir
                            ? "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-500/10 font-bold"
                            : "bg-white border-slate-200 text-slate-655 hover:bg-slate-50"
                        }`}
                      >
                        {dir === "eng_ar" ? "إنجليزي ➡️ عربي" : dir === "ar_eng" ? "عربي ➡️ إنجليزي" : "مزيج عشوائي"}
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              <button
                onClick={() => buildQuiz(false)}
                className="w-full max-w-sm py-3 px-8 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs rounded-xl shadow-lg transition-all"
              >
                تحضير وبدء الاختبار (10 مكثف) 🎯
              </button>
            </div>
          )}

          {/* 2. ACTIVE INTERACTIVE QUIZ PROCESS */}
          {quizState === "active" && questions.length > 0 && (
            <div className="max-w-2xl mx-auto space-y-6">
              
              {/* Stats upper panel */}
              <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 font-bold gap-3 px-1">
                {/* Timer display */}
                <div className={`flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full font-sans transition-all ${timeLeft <= 5 ? "bg-red-50 text-red-600 animate-pulse border border-red-200" : ""}`}>
                  <Timer className="h-3.5 w-3.5" />
                  <span>الوقت المتبقي:</span>
                  <span className="font-mono text-sm font-black">{timeLeft} ثانية</span>
                </div>

                <div className="flex items-center gap-4">
                  <span>سؤال {currentIndex + 1} من {questions.length}</span>
                  <span className="font-mono text-purple-700">النقاط: {score} مستصحبة</span>
                </div>
              </div>

              {/* Progress bar track */}
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border">
                <div 
                  className="bg-purple-600 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
                ></div>
              </div>

              {/* Prompt box */}
              <div className="bg-slate-50/70 p-6 md:p-8 rounded-3xl border border-slate-200/60 flex flex-col space-y-6 text-center animate-fade-in relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-50 rounded-full blur-xl pointer-events-none"></div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold tracking-wide block mb-1">حدد الترجمة الصحيحة للفظ التالي:</span>
                  <h4 className="text-3xl font-black text-purple-705 tracking-wide font-sans mb-3 select-all">
                    {questions[currentIndex].question}
                  </h4>

                  {/* TTS Speech pronunciation for English text prompts only */}
                  {questions[currentIndex].direction === "eng_ar" && (
                    <button
                      onClick={() => playPronunciation(questions[currentIndex].question)}
                      className="p-1.5 bg-white shadow-sm hover:bg-slate-50 rounded-xl border text-[11px] font-bold text-slate-655 flex items-center justify-center gap-1.5 mx-auto transition-all"
                    >
                      <Volume2 className="h-3.5 w-3.5 text-purple-600" />
                      <span>استمع للنطق الأصلي</span>
                    </button>
                  )}
                </div>

                {/* Multiple Options grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3">
                  {questions[currentIndex].options.map((opt: string, optIdx: number) => {
                    const isSelect = opt === selectedOption;
                    const isCorrect = opt === questions[currentIndex].correctOption;

                    let look = "bg-white border-slate-200 text-slate-700 hover:bg-slate-50";
                    if (isAnswerSubmitted) {
                      if (isCorrect) {
                        look = "bg-emerald-50 border-emerald-400 text-emerald-800 font-bold ring-2 ring-emerald-100";
                      } else if (isSelect) {
                        look = "bg-red-50 border-red-400 text-red-800 font-medium ring-2 ring-red-100";
                      } else {
                        look = "bg-white border-slate-150 text-slate-400 opacity-60";
                      }
                    } else if (isSelect) {
                      look = "bg-purple-50 border-purple-500 text-purple-800 font-bold ring-2 ring-purple-100";
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={isAnswerSubmitted}
                        onClick={() => handleSelectOption(opt)}
                        className={`p-4 rounded-2xl border text-right transition-all flex items-center justify-between text-xs sm:text-sm font-sans ${look}`}
                      >
                        <div className="flex items-center gap-1.5">
                          {isAnswerSubmitted && isCorrect && <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600" />}
                          {isAnswerSubmitted && isSelect && !isCorrect && <X className="h-4.5 w-4.5 text-red-600" />}
                        </div>
                        <span className="font-semibold">{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Action Controls row */}
                <div className="pt-4 border-t border-slate-205/40 flex justify-between items-center flex-row-reverse gap-4">
                  {!isAnswerSubmitted ? (
                    <button
                      onClick={submitQuizAnswer}
                      disabled={!selectedOption}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl transition-all mr-auto shadow-md"
                    >
                      تأكيد الترجمة ⚡
                    </button>
                  ) : (
                    <button
                      onClick={advanceQuiz}
                      className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all mr-auto shadow-md flex items-center gap-1.5"
                    >
                      <span>{currentIndex + 1 === questions.length ? "استعراض ورقة النتائج النهائية" : "الكلمة التالية"}</span>
                      <ChevronRight className="h-4 w-4 transform rotate-180" />
                    </button>
                  )}

                  {isAnswerSubmitted && (
                    <div className="text-right text-xs max-w-[70%]">
                      {selectedOption === questions[currentIndex].correctOption ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1 justify-end">
                          <span>إجابة صحيحة وممتازة! ✨</span>
                          <CheckCircle2 className="h-4 w-4" />
                        </span>
                      ) : (
                        <span className="text-red-600 font-bold flex flex-col">
                          <span>خطأ! الإجابة المطلوبة: {questions[currentIndex].correctOption}</span>
                          <span className="text-[10px] text-slate-400 font-normal mt-0.5" dir="rtl">{questions[currentIndex].originalExplanation}</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* 3. COMPLETED RESULTS SHEET SCREEN */}
          {quizState === "completed" && (
            <div className="max-w-xl mx-auto bg-slate-50/60 p-6 sm:p-8 rounded-3xl border border-slate-200/60 text-center flex flex-col items-center justify-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shadow-lg animate-bounce">
                <Award className="h-8 w-8" />
              </div>

              <div>
                <h3 className="text-base font-black text-slate-800">لقد انتهى التحدي التقييمي اللغوي! 🎉</h3>
                <p className="text-xs text-slate-500 mt-1">
                  شاهد نسبة إتقانك ودراستك للمفردات المدعومة في حسابك:
                </p>
              </div>

              {/* Mastery breakdown badge */}
              <div className="bg-white border rounded-2.5xl p-5 w-full max-w-sm">
                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-bold block mb-1">SCORE SUMMATION</span>
                <div className="text-4xl font-black text-purple-600 font-sans tracking-tight">
                  {score} <span className="text-slate-400 text-lg">/ {questions.length}</span>
                </div>
                <div className="text-xs text-slate-500 font-bold mt-1">
                  معدل التذكر والترجمة: {Math.round((score / questions.length) * 100)}%
                </div>
                <p className="text-[11px] text-slate-405 mt-3 max-w-xs mx-auto" dir="rtl">
                  {score >= (questions.length * 0.8)
                    ? "🎉 أداء جبار للغاية! حصيلتك في الأقسام المختارة ممتازة ومطمئنة لسكور 7.5+."
                    : score >= (questions.length * 0.5)
                    ? "👍 أداء واعد وجيد. مراجعة إضافية للفظ والنصوص تضمن لك باند رفيع."
                    : "⏳ بحاجة لمزيد من المراجعة. تنقل بين الفلاش كاردز واستمع للفظ الصحيح."
                  }
                </p>
              </div>

              {/* Review wrong entries */}
              {failedQuestions.length > 0 && (
                <div className="w-full text-right bg-white border rounded-2.5xl p-4">
                  <h4 className="text-xs font-bold text-red-650 mb-2 flex items-center gap-1.5 justify-end">
                    <span>اللفظ الذي لم توفق في إجابته:</span>
                    <AlertCircle className="h-4 w-4" />
                  </h4>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {failedQuestions.map((fq, fIdx) => (
                      <div key={fq.word + fIdx} className="p-2 bg-red-50/20 border border-red-100/40 rounded-xl text-xs flex justify-between items-center text-right font-sans">
                        <span className="font-semibold text-emerald-800">{fq.correct}</span>
                        <span className="text-slate-400 font-mono">بدلاً من {fq.selected} ⬅</span>
                        <span className="font-black text-slate-800 tracking-wide">{fq.word}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Play again actions footer controls */}
              <div className="flex gap-2 w-full max-w-sm">
                <button
                  onClick={() => setQuizState("setup")}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-705 font-bold text-xs rounded-xl transition-all"
                >
                  تعديل الصعوبات ⚙️
                </button>
                <button
                  onClick={() => buildQuiz(isDailyChallenge)}
                  className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer font-sans"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>إعادة نفس الاختبار</span>
                </button>
              </div>

            </div>
          )}

        </div>
      )}


      {/* ==============================
          AI VOCABULARY TUTOR SCREEN
         ============================== */}
      {activeSubTab === "ai-tutor" && (
        <div className="space-y-6">
          
          {/* Static introduction searching form */}
          <div className="bg-gradient-to-l from-purple-50 via-indigo-50/20 to-white border border-purple-200/40 p-5 rounded-3xl text-right">
            <h3 className="text-sm font-black text-purple-800 flex items-center gap-1.5 justify-end">
              <span>مدرس الأيلتس اللغوي المساعد بالذكاء الاصطناعي 🤖</span>
              <Sparkles className="h-4 w-4 text-purple-605" />
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 mb-4">
              اكتب أي كلمة إنجليزية هنا أو اختارها من جداول التصفح. سيقوم الخادم الذكي بتحليل معانيها، وإدراج إعرابها، وإعداد جملة مفصلة بنظام الآيلتس، مع توفير كويز مخصص لها في لحظات!
            </p>

            <form 
              onSubmit={(e) => { e.preventDefault(); queryAiTutor(); }}
              className="flex gap-2"
            >
              <button
                type="submit"
                disabled={aiLoading}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-350 text-white font-bold text-xs rounded-xl transition-all shadow-md shrink-0"
              >
                {aiLoading ? "جاري التحليل والترجمة..." : "تفصيل وتحليل اللفظ 💡"}
              </button>
              <input
                type="text"
                value={aiWord}
                onChange={(e) => setAiWord(e.target.value)}
                placeholder="اكتب اللفظ هنا (مثال: analytical, investigate, perspective)..."
                className="flex-1 bg-white border border-slate-250 py-2.5 px-4 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-right font-sans"
              />
            </form>
            {aiError && (
              <p className="text-[10px] text-red-650 font-bold mt-2 text-right">{aiError}</p>
            )}
          </div>

          {/* AI RESULT DISPLAY STENCIL VIEW */}
          {aiLoading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <RefreshCw className="h-8 w-8 text-purple-600 animate-spin" />
              <div className="text-center">
                <h5 className="text-xs font-bold text-slate-700">جاري الربط مع المدرس اللغوي لـ Gemini...</h5>
                <p className="text-[10px] text-slate-400 mt-1">يجري الآن صياغة بنود المعاني، الأمثلة ومستويات الكويز المصاحب.</p>
              </div>
            </div>
          ) : aiResult ? (
            <motion.div 
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              
              {/* Core result card */}
              <div className="bg-white border rounded-3xl p-6 relative overflow-hidden shadow-md">
                <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 rounded-full blur-2xl pointer-events-none"></div>

                {/* Primary Title headers */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-1 bg-purple-100 text-purple-700 rounded-xl">Gemini Verified ✔</span>
                    <button
                      onClick={() => playPronunciation(aiResult.word)}
                      className="p-1.5 bg-slate-100 hover:bg-purple-100/50 rounded-full text-slate-500 hover:text-purple-650 transition-colors"
                      title="تشغيل اللفظ"
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="text-right">
                    <h2 className="text-2xl font-black text-slate-900 tracking-wide font-sans">{aiResult.word}</h2>
                    <span className="text-sm font-bold text-purple-700 block mt-0.5">الترجمة: {aiResult.translation}</span>
                  </div>
                </div>

                {/* Friendly description */}
                <div className="mb-5 text-right bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block mb-1">تفسير مبسط للكلمة (Simple Explanation):</span>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans">{aiResult.explanation}</p>
                </div>

                {/* Sample IELTS Sentence */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Synonyms & Antonyms block */}
                  <div className="space-y-3 text-right">
                    <div className="p-3 bg-purple-50/20 border border-purple-100 rounded-2xl">
                      <span className="text-[10px] text-purple-750 font-black block mb-1">مرادفات للآيلتس (IELTS Synonyms):</span>
                      <div className="flex flex-wrap gap-1 justify-end">
                        {aiResult.synonyms?.map((item: string, sIdx: number) => (
                          <span key={item + sIdx} className="text-[10.5px] bg-white border border-purple-100 text-purple-700 px-2 py-1 rounded-lg font-bold font-sans">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50/50 border rounded-2xl">
                      <span className="text-[10px] text-slate-450 font-black block mb-1">الأضداد المقابلة (Antonyms):</span>
                      <div className="flex flex-wrap gap-1 justify-end">
                        {aiResult.antonyms?.map((item: string, aIdx: number) => (
                          <span key={item + aIdx} className="text-[10.5px] bg-white border border-slate-200 text-slate-600 px-2 py-1 rounded-lg font-sans">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Contextual IELTS usage example */}
                  <div className="p-4 bg-indigo-50/20 border border-indigo-100/45 rounded-2.5xl text-right flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] text-indigo-750 font-bold block mb-1">نموذج استخدام في سياق الآيلتس (IELTS Usage):</span>
                      <p className="text-xs font-bold text-slate-800 font-sans leading-relaxed italic" dir="ltr">
                        "{aiResult.example}"
                      </p>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100/50">
                      <strong>التعريب:</strong> {aiResult.exampleArabic}
                    </p>
                  </div>

                </div>

              </div>

              {/* Core integrated AI quiz question if available */}
              {aiResult.quiz && aiResult.quiz.length > 0 && (
                <div className="bg-gradient-to-tr from-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl border border-white/5 text-right">
                  <div className="flex justify-between items-center border-b border-white/10 pb-3 mb-4">
                    <span className="p-1 px-2.5 bg-white/10 rounded-xl text-[10px] font-bold text-purple-300">QUIZ INTERACTION</span>
                    <h4 className="text-xs font-bold flex items-center gap-1.5 justify-end">
                      <span>اختبار فوري لقياس الفهم للفظ: {aiResult.word}</span>
                      <Lightbulb className="h-4 w-4 text-purple-300" />
                    </h4>
                  </div>

                  {/* Question */}
                  <p className="text-xs font-bold leading-relaxed mb-4 font-sans" dir="ltr">
                    {aiResult.quiz[0].question}
                  </p>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                    {aiResult.quiz[0].options?.map((opt: string, qIdx: number) => {
                      const isCorrect = opt === aiResult.quiz[0].correctAnswer;
                      const isSelected = opt === aiQuizSelected;

                      let btnStyle = "bg-white/5 border-white/10 text-slate-200 hover:bg-white/10";
                      
                      if (aiQuizAnswered) {
                        if (isCorrect) {
                          btnStyle = "bg-emerald-600/90 border-emerald-500 text-white font-bold";
                        } else if (isSelected) {
                          btnStyle = "bg-red-650/90 border-red-500 text-white";
                        } else {
                          btnStyle = "bg-white/5 border-transparent text-slate-550 opacity-55";
                        }
                      } else if (isSelected) {
                        btnStyle = "bg-purple-650/80 border-purple-400 text-white";
                      }

                      return (
                        <button
                          key={opt + qIdx}
                          disabled={aiQuizAnswered}
                          onClick={() => setAiQuizSelected(opt)}
                          className={`p-3.5 border rounded-2xl text-left transition-all text-xs font-semibold font-sans flex items-center justify-between ${btnStyle}`}
                        >
                          <div className="flex items-center gap-1">
                            {aiQuizAnswered && isCorrect && <Check className="h-3.5 w-3.5" />}
                            {aiQuizAnswered && isSelected && !isCorrect && <X className="h-3.5 w-3.5" />}
                          </div>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* AI quiz verdict controls */}
                  <div className="flex justify-between items-center gap-4 flex-row-reverse border-t border-white/10 pt-3">
                    {!aiQuizAnswered ? (
                      <button
                        onClick={() => {
                          if (aiQuizSelected) setAiQuizAnswered(true);
                        }}
                        disabled={!aiQuizSelected}
                        className="px-5 py-2 bg-purple-600 disabled:bg-white/20 hover:bg-purple-705 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                      >
                        إرسال الإجابة 🔍
                      </button>
                    ) : (
                      <p className="text-xs text-slate-300 text-right">
                        {aiQuizSelected === aiResult.quiz[0].correctAnswer ? (
                          <strong className="text-emerald-400">رائع! إجابة صحيحة وكاملة للفظ ✅</strong>
                        ) : (
                          <strong className="text-red-450">خطأ في الاختيار! الإجابة الملائمة: {aiResult.quiz[0].correctAnswer}</strong>
                        )}
                        <span className="block text-[10px] text-slate-400 font-normal mt-0.5" dir="rtl">{aiResult.quiz[0].explanation}</span>
                      </p>
                    )}
                  </div>

                </div>
              )}

            </motion.div>
          ) : (
            <div className="py-12 border border-dashed rounded-3xl text-center text-slate-400 text-xs">
              حدد أي كلمة من تصنيفات التصفح وانقر "تفسير ذكي بالذكاء" لعرض التفاصيل الفورية هنا!
            </div>
          )}

        </div>
      )}

    </div>
  );
}

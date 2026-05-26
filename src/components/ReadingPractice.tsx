import React, { useState, useEffect } from "react";
import { 
  BookOpen, 
  ExternalLink, 
  Play, 
  Square, 
  Timer, 
  Save, 
  CheckCircle2, 
  ChevronRight, 
  HelpCircle
} from "lucide-react";
import { SourceCard } from "../types";



const INITIAL_SOURCES: SourceCard[] = [
  {
    id: "r1",
    name: "Cathoven (تمرين مباشر بالتكنولوجيا الذكية) 🌐",
    url: "https://www.cathoven.com/",
    goal: "تطوير طلاقة القراءة وتفكيك وفهم النصوص باستخدام الذكاء الاصطناعي المتقدم.",
    durationCompleted: 15,
    durationGoal: 30,
    progress: 50,
    saved: true,
  },
  {
    id: "r2",
    name: "Engnovate Reading (تطوير الفهم) 💡",
    url: "https://engnovate.com/",
    goal: "التدريب على القراءة التحليلية وبناء الطلاقة اللغوية واستخراج التراكيب المتقدمة.",
    durationCompleted: 10,
    durationGoal: 25,
    progress: 40,
    saved: false,
  },
];

export default function ReadingPractice() {
  const [sources, setSources] = useState<SourceCard[]>(() => {
    const saved = localStorage.getItem("ielts_reading_sources");
    return saved ? JSON.parse(saved) : INITIAL_SOURCES;
  });

  const [activeTimerId, setActiveTimerId] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // States to edit goals
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempGoalMinutes, setTempGoalMinutes] = useState(25);



  useEffect(() => {
    localStorage.setItem("ielts_reading_sources", JSON.stringify(sources));
  }, [sources]);

  // Active Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (activeTimerId) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setTimerSeconds(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTimerId]);

  const handleOpenSource = (source: SourceCard) => {
    // Open website in new window
    window.open(source.url, "_blank", "noopener,noreferrer");
    // Automatically boot the timer for that source to make it interactive tracking
    startTimer(source.id);
  };

  const startTimer = (id: string) => {
    if (activeTimerId === id) return;
    if (activeTimerId) {
      stopTimer();
    }
    setActiveTimerId(id);
    setTimerSeconds(0);
  };

  const stopTimer = () => {
    if (!activeTimerId) return;
    const addedMinutes = Math.floor(timerSeconds / 60) || 1; // minimum 1 minute if they spend time
    setSources((prev) =>
      prev.map((source) => {
        if (source.id !== activeTimerId) return source;
        const newCompleted = Math.min(source.durationCompleted + addedMinutes, source.durationGoal);
        const newProgress = Math.round((newCompleted / source.durationGoal) * 100);
        return {
          ...source,
          durationCompleted: newCompleted,
          progress: newProgress,
        };
      })
    );
    setActiveTimerId(null);
    setTimerSeconds(0);
  };

  const toggleSave = (id: string) => {
    setSources((prev) =>
      prev.map((source) =>
        source.id === id ? { ...source, saved: !source.saved } : source
      )
    );
  };

  const startEditGoal = (source: SourceCard) => {
    setEditingId(source.id);
    setTempGoalMinutes(source.durationGoal);
  };

  const saveGoal = (id: string) => {
    setSources((prev) =>
      prev.map((source) => {
        if (source.id !== id) return source;
        const newProgress = Math.round((source.durationCompleted / tempGoalMinutes) * 100);
        return {
          ...source,
          durationGoal: tempGoalMinutes,
          progress: Math.min(newProgress, 100),
        };
      })
    );
    setEditingId(null);
  };

  const formatTimerLabel = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6 md:space-y-8 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600">📖</span>
            قسم القراءة التفاعلي (Reading Practice Hub)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            كروت بيضاء مزودة بحساب دقيق لمؤشر التقدم الأخضر ومؤقت ذاتي لحفظ ومقايسة مهارات القراءة لديك.
          </p>
        </div>
        {activeTimerId && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 text-emerald-800 px-4 py-2 rounded-2xl animate-pulse">
            <Timer className="h-4 w-4 text-emerald-600 animate-spin-slow" />
            <span className="text-xs font-semibold">
              جاري تسجيل وقت قراءتك: <strong className="font-mono">{formatTimerLabel(timerSeconds)}</strong>
            </span>
            <button
              onClick={stopTimer}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] px-2.5 py-1 rounded-lg font-bold transition-all"
            >
              حفظ وقت القراءة 💾
            </button>
          </div>
        )}
      </div>

      {/* Target description bar */}
      <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100 flex items-start gap-3">
        <div className="bg-emerald-600 text-white text-xs px-2 py-1.5 rounded-xl font-bold font-mono">IELTS Reading</div>
        <div className="text-xs text-emerald-800 space-y-1">
          <p className="font-semibold">🎯 هدف قراءة الايلتس اليومي:</p>
          <p>ننصح بالتدرب بمعدل 20–30 دقيقة يومياً من مصادر متنوعة لدراسة النصوص الأكاديمية وصياغة المفردات.</p>
        </div>
      </div>

      {/* White Cards reading source list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sources.map((source) => (
          <div
            key={source.id}
            className="bg-white border border-slate-150 rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Card Title & Save indicator */}
              <div className="flex justify-between items-start gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm leading-snug">{source.name}</h4>
                </div>
                <button
                  onClick={() => toggleSave(source.id)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                    source.saved
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-slate-50 text-slate-400 border-slate-150 hover:bg-slate-100"
                  }`}
                >
                  {source.saved ? "★ محفوظ" : "☆ حفظ"}
                </button>
              </div>

              {/* Goal Description */}
              <div className="bg-slate-50 rounded-2xl p-3 mb-4 text-xs text-slate-600 text-right">
                <span className="font-semibold text-slate-700 block mb-1">🎯 الهدف الدراسي المستهدف:</span>
                <p className="text-[11px] leading-relaxed text-slate-500">{source.goal}</p>
              </div>

              {/* Timer Progress & Settings */}
              <div className="space-y-3.5 mb-5">
                <div className="flex justify-between items-center text-xs">
                  <div className="text-slate-500 flex items-center gap-1 font-mono">
                    <span>{source.durationCompleted} دقيقة</span>
                    <span>/</span>
                    {editingId === source.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={tempGoalMinutes}
                          onChange={(e) => setTempGoalMinutes(parseInt(e.target.value) || 10)}
                          className="w-12 bg-white border border-slate-300 rounded px-1.5 py-0.5 text-center text-[11px] font-sans text-slate-800 focus:outline-none"
                        />
                        <button
                          onClick={() => saveGoal(source.id)}
                          className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                          title="حفظ الهدف"
                        >
                          <Save className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <span
                        onClick={() => startEditGoal(source)}
                        className="cursor-pointer underline decoration-dotted text-emerald-600 font-bold hover:text-emerald-700"
                        title="تعديل الهدف اليومي"
                      >
                        {source.durationGoal} دقيقة ⚙
                      </span>
                    )}
                  </div>
                  <span className="font-semibold text-emerald-600 font-mono">{source.progress}%</span>
                </div>

                {/* GREEN PROGRESS BAR */}
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${source.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Actions panel */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
              <button
                onClick={() => startTimer(source.id)}
                disabled={activeTimerId === source.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 transition-colors text-slate-600 disabled:opacity-50"
              >
                <Play className="h-3.5 w-3.5" /> ابدأ مؤقت القراءة ⏳
              </button>

              <button
                onClick={() => handleOpenSource(source)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow transition-all"
              >
                <span>افتح الموقع وابدأ التمرين</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Dedicated Reading Resources section */}
      <div className="mt-12 pt-8 border-t border-slate-200/60 dark:border-slate-800/80">
        <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-xs mb-4 text-right flex items-center justify-end gap-1.5">
          <span>المصادر والمنصات الخارجية المعتمدة للقراءة</span>
          <span className="p-1.5 bg-purple-50 dark:bg-purple-950/40 rounded-lg text-purple-600 dark:text-purple-400">🌐</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Cathoven Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-4.5 rounded-2xl flex flex-col justify-between h-40 hover:-translate-y-1 hover:shadow-lg hover:border-purple-300/50 dark:hover:border-purple-900/50 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/5 to-purple-500/5 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform"></div>
            <div>
              <div className="flex justify-between items-start mb-2 flex-row-reverse">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-indigo-600 text-white flex items-center justify-center font-black text-xs">
                  CAT
                </div>
                <span className="text-[9px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded font-black font-mono">AI READ</span>
              </div>
              <h4 className="font-extrabold text-xs text-slate-800 dark:text-white text-right">Cathoven</h4>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 text-right leading-relaxed mt-1" dir="rtl">
                صيانة الذكاء الاصطناعي لفحص تفكيك النصوص وبناء القراءة الموجهة وتطوير المفردات الصعبة فوراً بلهجات متعددة.
              </p>
            </div>
            <a
              href="https://www.cathoven.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 bg-slate-55 dark:bg-slate-850 hover:bg-purple-600 hover:text-white dark:text-slate-200 text-slate-700 font-bold text-[10.5px] py-1.5 rounded-xl flex items-center justify-center gap-1 transition-all"
            >
              <span>فتح الموقع الرسمي</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Engnovate Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-4.5 rounded-2xl flex flex-col justify-between h-40 hover:-translate-y-1 hover:shadow-lg hover:border-purple-300/50 dark:hover:border-purple-900/50 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform"></div>
            <div>
              <div className="flex justify-between items-start mb-2 flex-row-reverse">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 text-white flex items-center justify-center font-black text-xs">
                  ENG
                </div>
                <span className="text-[9px] bg-purple-50 dark:bg-purple-955/20 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded font-black font-mono">FLOW LEVEL</span>
              </div>
              <h4 className="font-extrabold text-xs text-slate-800 dark:text-white text-right">Engnovate</h4>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 text-right leading-relaxed mt-1" dir="rtl">
                منصة التدريب على التحليل اللفظي السلس وصقل الفهم اللغوي وبناء سرعة تدفق كتل الجمل الطويلة الصعبة.
              </p>
            </div>
            <a
              href="https://engnovate.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 bg-slate-55 dark:bg-slate-850 hover:bg-purple-600 hover:text-white dark:text-slate-200 text-slate-700 font-bold text-[10.5px] py-1.5 rounded-xl flex items-center justify-center gap-1 transition-all"
            >
              <span>فتح الموقع الرسمي</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* IELTS Online Tests Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-4.5 rounded-2xl flex flex-col justify-between h-40 hover:-translate-y-1 hover:shadow-lg hover:border-purple-300/50 dark:hover:border-purple-900/50 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform"></div>
            <div>
              <div className="flex justify-between items-start mb-2 flex-row-reverse">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-black text-xs font-mono">
                  IOT
                </div>
                <span className="text-[9px] bg-blue-50 dark:bg-blue-955/20 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded font-black font-mono">MOCK EXAM</span>
              </div>
              <h4 className="font-extrabold text-xs text-slate-800 dark:text-white text-right">IELTS Online Tests</h4>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 text-right leading-relaxed mt-1" dir="rtl">
                المنصة الأضخم على الإطلاق المليئة بالامتحانات الكاملة المجانية تماماً والموزعة وفق مؤشر توقيت حقيقي دقيق.
              </p>
            </div>
            <a
              href="https://ieltsonlinetests.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 bg-slate-55 dark:bg-slate-850 hover:bg-purple-600 hover:text-white dark:text-slate-200 text-slate-700 font-bold text-[10.5px] py-1.5 rounded-xl flex items-center justify-center gap-1 transition-all"
            >
              <span>تصفح نماذج الاختبارات</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

        </div>
      </div>

    </div>
  );
}


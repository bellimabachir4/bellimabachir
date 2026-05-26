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

  // Interactive 21-site Search & Tags Filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");

  const filteredSites = READING_SITES.filter(site => {
    const matchesSearch = site.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          site.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === "All" || site.tag === selectedTag;
    return matchesSearch && matchesTag;
  });



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

      {/* Dedicated Reading Resources section with 21 sites, Search, and Tag Filters */}
      <div className="mt-12 pt-8 border-t border-slate-200/60 dark:border-slate-800/80">
        <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base mb-2 text-right flex items-center justify-end gap-1.5">
          <span>المصادر الخارجية الإضافية المعتمدة للقراءة (21 موقع)</span>
          <span className="p-1.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg text-emerald-600 dark:text-emerald-400">🌐</span>
        </h3>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 text-right mb-6">
          انقر فوق أي زر وسيتم فتح الموقع فورًا في نافذة خارجية للبدء بالممارسة والتحضير.
        </p>

        {/* Search and Filters wrapper */}
        <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 mb-6 space-y-3.5">
          <div className="flex flex-col sm:flex-row-reverse gap-3 items-center justify-between">
            {/* Search Input */}
            <div className="w-full sm:w-72">
              <input
                type="text"
                placeholder="🔍 ابحث عن موقع أو مصدر..."
                className="w-full text-right bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-slate-800 dark:text-slate-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* Tag Buttons Filter */}
            <div className="flex flex-wrap gap-1.5 justify-end w-full sm:w-auto" dir="rtl">
              {["All", "News", "Academic", "Learning", "Tests", "Scientific"].map((tag) => {
                const tagLabels: { [key: string]: string } = {
                  All: "الكل",
                  News: "صحافة وأخبار",
                  Academic: "كتابات أكاديمية",
                  Learning: "تعليم وتطوير",
                  Tests: "تمارين واختبارات",
                  Scientific: "علمي وثقافي"
                };
                return (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`text-[10px] px-3 py-1.5 rounded-lg border font-bold transition-all ${
                      selectedTag === tag
                        ? "bg-emerald-600 text-white border-emerald-600 scale-102"
                        : "bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200/60 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900"
                    }`}
                  >
                    {tagLabels[tag] || tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 21 Sites Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" dir="rtl">
          {filteredSites.map((site, index) => {
            const tagStyles: { [key: string]: string } = {
              News: "bg-blue-50 text-blue-700 border-blue-150 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50",
              Academic: "bg-emerald-50 text-emerald-700 border-emerald-150 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50",
              Learning: "bg-purple-50 text-purple-700 border-purple-150 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900/50",
              Tests: "bg-orange-50 text-orange-700 border-orange-150 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-900/50",
              Scientific: "bg-pink-50 text-pink-700 border-pink-150 dark:bg-pink-950/30 dark:text-pink-400 dark:border-pink-900/50"
            };

            const tagLabels: { [key: string]: string } = {
              News: "صحافة وأخبار",
              Academic: "مستوى أكاديمي",
              Learning: "مطور مبتدئ",
              Tests: "أسئلة واختبارات",
              Scientific: "علوم وثقافة"
            };

            return (
              <div
                key={index}
                className="bg-white dark:bg-slate-900 border border-slate-150/60 dark:border-slate-800/80 p-5 rounded-3xl flex flex-col justify-between h-44 hover:-translate-y-1 hover:shadow-md hover:border-emerald-350 dark:hover:border-emerald-900/60 transition-all duration-300 relative group"
              >
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-emerald-500/5 to-indigo-500/5 rounded-full blur-xl pointer-events-none"></div>

                <div>
                  <div className="flex justify-between items-center mb-2.5">
                    <h4 className="font-extrabold text-xs text-slate-800 dark:text-white leading-tight">
                      {site.name}
                    </h4>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${tagStyles[site.tag] || "bg-slate-50 text-slate-600 border-slate-200"}`}>
                      {tagLabels[site.tag] || site.tag}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-450 text-right leading-relaxed line-clamp-2">
                    {site.desc}
                  </p>
                </div>

                <a
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 bg-slate-50 dark:bg-slate-950 hover:bg-emerald-600 dark:hover:bg-emerald-600 hover:text-white dark:hover:text-white text-slate-600 dark:text-slate-300 font-bold text-[10.5px] py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 border border-slate-200/60 dark:border-slate-850 transition-all duration-200 cursor-pointer"
                >
                  <span>أبحر في قراءة الموقع</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            );
          })}
          {filteredSites.length === 0 && (
            <div className="col-span-full text-center py-8 text-slate-400 dark:text-slate-600">
              لا توجد مصادر تطابق هذا البحث أو التصنيف.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const READING_SITES = [
  { name: "Fox News", url: "https://www.foxnews.com", desc: "أخبار عالمية وتغطيات متنوعة لتطوير كتل المفردات.", tag: "News" },
  { name: "CNN", url: "https://www.cnn.com", desc: "تغطية عالمية ممتازة لممارسة القراءة السريعة والأخبار.", tag: "News" },
  { name: "Reuters", url: "https://www.reuters.com", desc: "تقارير إخبارية موضوعية ومصطلحات سياسية واقتصادية دقيقة.", tag: "News" },
  { name: "The New York Post", url: "https://nypost.com", desc: "مقالات حيوية ومتنوعة بأسلوب قراءة سلس وشيق.", tag: "News" },
  { name: "The Washington Post", url: "https://www.washingtonpost.com", desc: "كتابات تحليلية عميقة تناسب مستوى القراءة الأكاديمي.", tag: "Academic" },
  { name: "The Guardian", url: "https://www.theguardian.com", desc: "صحيفة بريطانية مرموقة غنية بالمفردات والتراكيب القوية.", tag: "Academic" },
  { name: "VOA Learning English", url: "https://learningenglish.voanews.com", desc: "أخبار مبسطة مخصصة لمتعلمي اللغة الإنجليزية بلهجة واضحة.", tag: "Learning" },
  { name: "BBC", url: "https://www.bbc.com", desc: "المصدر البريطاني الأساسي والأهم لضبط الفهم اللغوي المتكامل.", tag: "Academic" },
  { name: "National Post", url: "https://nationalpost.com", desc: "صحيفة كندية ممتازة تقدم تغطيات ومقالات تحليلية مفيدة.", tag: "Academic" },
  { name: "British Council (Teens)", url: "https://learnenglishteens.britishcouncil.org", desc: "مواد قراءة ومهام تفاعلية منظمة من المجلس الثقافي البريطاني.", tag: "Learning" },
  { name: "Nat Geo Kids", url: "https://kids.nationalgeographic.com", desc: "حقائق علمية ممتعة وجذابة مناسبة للمبتدئين والمتوسطين.", tag: "Learning" },
  { name: "Lingua", url: "https://lingua.com", desc: "نصوص قراءة مقسمة حسب المستويات مع أسئلة اختبار الفهم.", tag: "Tests" },
  { name: "BBC Learning English", url: "https://www.bbc.co.uk/learningenglish", desc: "بوابة مجانية تعليمية تفاعلية غنية بالدروس والمفردات.", tag: "Learning" },
  { name: "Smithsonian", url: "https://www.si.edu", desc: "منشورات وقصص تاريخية وعلمية تماثل نصوص الآيلتس تماماً.", tag: "Scientific" },
  { name: "Breaking News English", url: "https://breakingnewsenglish.com", desc: "دروس تفاعلية جاهزة تعتمد على القصص الإخبارية بمستويات متعددة.", tag: "Tests" },
  { name: "ReadTheory", url: "https://readtheory.org", desc: "منصة ذكية مخصصة لتحسين مهارة الفهم القرائي وتتبع تقدمك.", tag: "Tests" },
  { name: "ESL Fast", url: "https://www.eslfast.com", desc: "مئات القصص والمقالات السريعة لمتعلمي اللغة لبناء الانسيابية.", tag: "Learning" },
  { name: "ESL Lounge", url: "https://www.esl-lounge.com", desc: "نصوص قراءات مصنفة ومعدة لتمارين الفهم والتحضير الفعلي.", tag: "Tests" },
  { name: "TeachYa", url: "https://teachya.com", desc: "تمارين واختبارات لغة مجانية لتطوير مستواك القواعدي والقرائي.", tag: "Tests" },
  { name: "ReadWorks", url: "https://www.readworks.org", desc: "أكبر مكتبة للمقالات العلمية والأدبية المرفقة بتمارين فحص الفهم.", tag: "Scientific" },
  { name: "Newsela", url: "https://newsela.com", desc: "مقالات إخبارية حديثة مقسمة ومعدة لتناسب طلاب كافة المستويات.", tag: "Academic" }
];


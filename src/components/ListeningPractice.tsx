import React, { useState, useEffect } from "react";
import { Youtube, Bookmark, CheckCircle2, Video, List, Zap, ExternalLink, Headphones, Play } from "lucide-react";

interface ListeningSource {
  id: string;
  channel: string;
  title: string;
  url: string;
  duration: string;
  videosCountCompleted: number;
  videosCountGoal: number;
  saved: boolean;
}

const INITIAL_LISTENING_CHANNELS: ListeningSource[] = [
  {
    id: "l1",
    channel: "Cathoven Listening (مستودع الاستماع الذكي) 🎧",
    title: "تدرب على الاستماع الفعلي وفهم المقاطع الصوتية واللهجات ومزامنة الفهم بأحدث النظم.",
    url: "https://www.cathoven.com/",
    duration: "30 دقيقة للتدريب",
    videosCountCompleted: 2,
    videosCountGoal: 4,
    saved: true,
  },
  {
    id: "l2",
    channel: "Engnovate Listening (تقوية الفهم السمعي) 🌟",
    title: "منصة ممتازة للتدرب على لهجات اختبار الآيلتس (البريطانية والأسترالية) والأجوبة الدقيقة.",
    url: "https://engnovate.com/",
    duration: "15 دقيقة لكل تدريب",
    videosCountCompleted: 1,
    videosCountGoal: 3,
    saved: false,
  },
];

export default function ListeningPractice() {
  const [sources, setSources] = useState<ListeningSource[]>(() => {
    const saved = localStorage.getItem("ielts_listening_sources");
    return saved ? JSON.parse(saved) : INITIAL_LISTENING_CHANNELS;
  });

  const [dailyQuotaMinutes, setDailyQuotaMinutes] = useState(30);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPodcasts = LISTENING_PODCASTS.filter(podcast => {
    return podcast.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
           podcast.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
           podcast.host.toLowerCase().includes(searchQuery.toLowerCase());
  });

  useEffect(() => {
    localStorage.setItem("ielts_listening_sources", JSON.stringify(sources));
  }, [sources]);

  const handleToggleSave = (id: string) => {
    setSources((prev) =>
      prev.map((source) =>
        source.id === id ? { ...source, saved: !source.saved } : source
      )
    );
  };

  const incrementVideoCompleted = (id: string) => {
    setSources((prev) =>
      prev.map((source) => {
        if (source.id !== id) return source;
        const newCompleted = Math.min(source.videosCountCompleted + 1, source.videosCountGoal);
        return {
          ...source,
          videosCountCompleted: newCompleted,
        };
      })
    );
  };

  const handleWatchVideo = (source: ListeningSource) => {
    window.open(source.url, "_blank", "noopener,noreferrer");
    incrementVideoCompleted(source.id);
  };

  const handleResetSection = () => {
    setSources((prev) =>
      prev.map((s) => ({ ...s, videosCountCompleted: 0 }))
    );
  };

  return (
    <div className="space-y-6 md:space-y-8 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="p-1.5 bg-orange-50 rounded-lg text-orange-500">🎧</span>
            قسم الاستماع التفاعلي (Listening Practice Suite)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            قنوات ومصادر تدريب الاستماع الرسمية للايلتز مزودة برأس مؤقت وحلقة إنجاز برتقالية.
          </p>
        </div>
        <button
          onClick={handleResetSection}
          className="text-xs text-orange-600 hover:text-orange-700 font-semibold bg-orange-50 px-3.5 py-1.5 rounded-xl border border-orange-100 transition-colors"
        >
          إعادة تعيين التقدم اليومي 🔄
        </button>
      </div>

      {/* Target description and goals selector */}
      <div className="bg-orange-50/40 border border-orange-100 rounded-3xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-3 items-start">
          <Zap className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
          <div className="text-xs text-orange-850">
            <p className="font-bold mb-0.5">⏱ الأهداف اليومية الموصى بها:</p>
            <p className="text-slate-500 leading-normal">
              تصفح دروس القنوات أدناه بمعدل 20–40 دقيقة يومياً. احرص على تدوين الكلمات الصعبة وإعادة كتابتها غيباً.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-2xl border border-orange-100 text-xs text-slate-700 shrink-0">
          <span>هدفك اليومي:</span>
          <select
            value={dailyQuotaMinutes}
            onChange={(e) => setDailyQuotaMinutes(parseInt(e.target.value))}
            className="font-bold text-orange-600 focus:outline-none bg-transparent"
          >
            <option value={20}>20 دقيقة</option>
            <option value={30}>30 دقيقة</option>
            <option value={40}>40 دقيقة</option>
          </select>
        </div>
      </div>

      {/* Listening Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sources.map((source) => {
          const ratio = source.videosCountCompleted / source.videosCountGoal;
          const percent = Math.min(Math.round(ratio * 100), 100);

          // SVG Progress Ring Parameters
          const radius = 30;
          const strokeWidth = 5;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = circumference - ratio * circumference;

          return (
            <div
              key={source.id}
              className="bg-white border-2 border-slate-100 rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="flex justify-between items-start gap-3 mb-4">
                <div className="space-y-1 text-right flex-1 select-none">
                  <div className="flex items-center gap-2">
                    <span className="p-1 px-1.5 rounded bg-orange-100 text-orange-700 text-[10px] font-black">YOUTUBE</span>
                    <h4 className="font-bold text-slate-800 text-sm">{source.channel}</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-1.5">{source.title}</p>
                </div>

                {/* SVG Progress Ring */}
                <div className="relative flex items-center justify-center shrink-0">
                  <svg className="w-16 h-16 transform -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r={radius}
                      className="text-slate-100"
                      strokeWidth={strokeWidth}
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r={radius}
                      className="text-orange-500 transition-all duration-500"
                      strokeWidth={strokeWidth}
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                    />
                  </svg>
                  <span className="absolute text-[10px] font-mono font-bold text-orange-600">
                    {percent}%
                  </span>
                </div>
              </div>

              {/* Video stats summary */}
              <div className="bg-slate-50 px-4 py-3 rounded-2xl flex justify-between items-center text-xs mb-4">
                <div className="flex items-center gap-1.5 text-slate-500 font-mono">
                  <Video className="h-3.5 w-3.5 text-orange-500" />
                  <span>{source.duration}</span>
                </div>
                <div className="text-slate-600">
                  الدروس المنجزة: <span className="font-bold text-orange-600 font-mono">{source.videosCountCompleted}</span> من <span className="font-bold font-mono">{source.videosCountGoal}</span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-2">
                <button
                  onClick={() => handleToggleSave(source.id)}
                  className={`p-2 rounded-xl border transition-colors ${
                    source.saved
                      ? "text-orange-600 bg-orange-50 border-orange-100"
                      : "text-slate-400 border-slate-200 hover:text-slate-600 hover:bg-slate-55"
                  }`}
                  title={source.saved ? "إلغاء حفظ الدرس" : "حفظ للاحق"}
                >
                  <Bookmark className="h-4 w-4 fill-current" />
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => incrementVideoCompleted(source.id)}
                    className="px-3.5 py-1.5 text-[11px] hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl transition-colors font-medium"
                    title="أعلم كمنجز يدويًا"
                  >
                    أكملت الدرس ✔
                  </button>
                  <button
                    onClick={() => handleWatchVideo(source)}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-sm hover:shadow transition-all"
                  >
                    <span>شاهد الدرس</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dedicated Listening Resources section - 10 top-rated Podcasts exactly as requested */}
      <div className="mt-12 pt-8 border-t border-slate-200/60 dark:border-slate-800/80">
        <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-base mb-2 text-right flex items-center justify-end gap-1.5">
          <span>بودكاست ومواقع التدرب على مهارة السماع (10 مصادر)</span>
          <span className="p-1.5 bg-orange-50 dark:bg-orange-950/40 rounded-lg text-orange-500">🎧</span>
        </h3>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 text-right mb-6">
          انقر فوق أي زر وسيتم توجيهك للمنصة أو مشغل البودكاست فوراً للبدء بالاستماع المباشر.
        </p>

        {/* Search box for Podcasts */}
        <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 mb-6">
          <div className="flex justify-between items-center flex-row-reverse w-full sm:w-72 mr-auto">
            <input
              type="text"
              placeholder="🔍 ابحث عن بودكاست أو متحدث..."
              className="w-full text-right bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 focus:focus-border-orange-500 text-slate-800 dark:text-slate-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* 10 Podcasts Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4" dir="rtl">
          {filteredPodcasts.map((podcast, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-900 border-2 border-slate-100/70 dark:border-slate-800/80 p-5 rounded-3xl flex flex-col justify-between h-44 hover:-translate-y-1 hover:shadow-md hover:border-orange-350 dark:hover:border-orange-900/50 transition-all duration-300 relative group"
            >
              {/* Overlay graphics */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-orange-500/5 to-purple-500/5 rounded-full blur-xl pointer-events-none"></div>

              <div>
                <div className="flex justify-between items-start mb-2">
                  <div className="text-right">
                    <h4 className="font-extrabold text-xs text-slate-800 dark:text-white leading-tight flex items-center gap-1">
                      <span>{podcast.name}</span>
                    </h4>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold block mt-0.5">
                      بتقديم: {podcast.host}
                    </span>
                  </div>
                  <span className="p-1 text-orange-600 bg-orange-50 dark:bg-orange-950/30 rounded-lg shrink-0">
                    <Headphones className="h-4 w-4" />
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-450 text-right leading-relaxed line-clamp-2 mt-1">
                  {podcast.desc}
                </p>
              </div>

              {/* Action Button: Open Link & play */}
              <a
                href={podcast.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-[10.5px] py-2 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer shadow-xs hover:shadow"
              >
                <Play className="h-3 w-3 fill-current" />
                <span>شغل البودكاست وابدأ السماع</span>
              </a>
            </div>
          ))}

          {filteredPodcasts.length === 0 && (
            <div className="col-span-full text-center py-8 text-slate-400 dark:text-slate-600">
              لا توجد قنوات بودكاست تطابق هذا البحث.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}

const LISTENING_PODCASTS = [
  { name: "Luke’s English Podcast", url: "https://teacherluke.co.uk", desc: "بودكاست بريطاني فائز بجوائز يقدم لغة حقيقية، غني بالنكت والقصص المشوقة والتعليم الفعال.", host: "Luke Thompson" },
  { name: "All Ears English", url: "https://www.allearsenglish.com", desc: "تركز المنصة على الاتصال لا الكمال 'Connection NOT Perfection' بلهجة أمريكية حيوية مذهلة.", host: "Lindsay & Michelle" },
  { name: "BBC 6 Minute English", url: "https://www.bbc.co.uk/learningenglish/english/features/6-minute-english", desc: "بودكاست بي بي سي الأيقوني لمناقشة مواضيع شيقة وبناء مفردات في 6 دقائق فقط.", host: "BBC Learning" },
  { name: "High Level Listening Advanced English Podcast", url: "https://www.highlevellistening.com", desc: "منصة ممتازة مصممة خصيصاً للمتعلمين المتقدمين وطلاب اختبار الآيلتس والمحترفين لضبط السمع.", host: "Mark & Kat" },
  { name: "RealLife English", url: "https://reallifeglobal.com", desc: "ترشدك المنصة ومستودعاتها الصوتية لفهم المتحدثين الأصليين وبناء الثقة بالنفس واللغة اليومية طبيعياً.", host: "RealLife Team" },
  { name: "Stuff You Should Know", url: "https://www.iheart.com/podcast/stuff-you-should-know-20922291/", desc: "بودكاست عالمي مدهش يشرح طريقة عمل الأشياء حول العالم بمفردات رفيعة غنية تناسب مستوى الأكاديمي.", host: "Josh & Chuck" },
  { name: "Culips ESL Podcast", url: "https://esl.culips.com", desc: "حوارات يومية سريعة وبطيئة مخصصة لشرح الكنايات والتعبيرات الاصطلاحية الشائعة للمتحدثين بطلاقة.", host: "Andrew & Friends" },
  { name: "The English We Speak (BBC)", url: "https://www.bbc.co.uk/learningenglish/english/features/the-english-we-speak", desc: "شروحات بي بي سي دقيقة وذكية للغاية لأحدث المصطلحات والاصطلاحات الإنجليزية المستعملة بالشارع.", host: "BBC Learning" },
  { name: "English Class 101", url: "https://www.englishclass101.com", desc: "بوابة صوتية ضخمة تغطي كافة المستويات مع أدوات تفاعلية وأوراق عمل لفهم سريع عميق.", host: "Innovative Language" },
  { name: "Speak English with Tiffani", url: "https://speakenglishwithtiffani.com", desc: "قناة وبودكاست تعليمي يمنحك أساليب واستراتيجيات عملية للتحدث كمتحدث أصلي بنطق صحيح وسلس.", host: "Teacher Tiffani" }
];

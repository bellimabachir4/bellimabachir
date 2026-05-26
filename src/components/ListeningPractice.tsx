import React, { useState, useEffect } from "react";
import { Youtube, Bookmark, CheckCircle2, Video, List, Zap, ExternalLink } from "lucide-react";

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

      {/* Dedicated Listening Resources section */}
      <div className="mt-12 pt-8 border-t border-slate-200/60 dark:border-slate-800/80">
        <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-xs mb-4 text-right flex items-center justify-end gap-1.5">
          <span>المصادر والمنصات الخارجية المعتمدة للاستماع</span>
          <span className="p-1.5 bg-purple-50 dark:bg-purple-950/40 rounded-lg text-purple-600 dark:text-purple-400">🌐</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Cathoven Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-4.5 rounded-2xl flex flex-col justify-between h-40 hover:-translate-y-1 hover:shadow-lg hover:border-purple-300/50 dark:hover:border-purple-900/50 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-500/5 to-purple-500/5 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform"></div>
            <div>
              <div className="flex justify-between items-start mb-2 flex-row-reverse">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-indigo-600 text-white flex items-center justify-center font-black text-xs font-mono">
                  CAT
                </div>
                <span className="text-[9px] bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 px-2 py-0.5 rounded font-black font-mono">AI ACCENT</span>
              </div>
              <h4 className="font-extrabold text-xs text-slate-800 dark:text-white text-right">Cathoven</h4>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 text-right leading-relaxed mt-1" dir="rtl">
                تدريب متصل على تفكيك اللفظ، تتبع اللهجات الأسترالية والبريطانية، ورسم استيعاب سمعي دقيق للاستماع.
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
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 text-white flex items-center justify-center font-black text-xs font-mono">
                  ENG
                </div>
                <span className="text-[9px] bg-purple-50 dark:bg-purple-955/20 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded font-black font-mono">AUDIOLOGY</span>
              </div>
              <h4 className="font-extrabold text-xs text-slate-800 dark:text-white text-right">Engnovate</h4>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 text-right leading-relaxed mt-1" dir="rtl">
                بناء مرونة استباق الأسئلة وتطوير المقاطع السمعية التحليلية مع التركيز على الكلمات المفتاحية في الآيلتس.
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
                <span className="text-[9px] bg-blue-50 dark:bg-blue-955/20 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded font-black font-mono">LISTENING LIST</span>
              </div>
              <h4 className="font-extrabold text-xs text-slate-800 dark:text-white text-right">IELTS Online Tests</h4>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 text-right leading-relaxed mt-1" dir="rtl">
                امتحانات استماع تفاعلية كاملة مع تشغيل المقاطع السمعية وحذف الأخطاء وكتابة الفراغات تلقائياً.
              </p>
            </div>
            <a
              href="https://ieltsonlinetests.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 bg-slate-55 dark:bg-slate-850 hover:bg-purple-600 hover:text-white dark:text-slate-200 text-slate-700 font-bold text-[10.5px] py-1.5 rounded-xl flex items-center justify-center gap-1 transition-all"
            >
              <span>فتح المنصة للتدرب</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

        </div>
      </div>

    </div>
  );
}

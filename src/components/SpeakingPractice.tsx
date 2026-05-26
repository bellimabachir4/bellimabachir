import React, { useState } from "react";
import { 
  Mic, 
  ExternalLink, 
  BookOpen, 
  HelpCircle, 
  Award, 
  ArrowLeftRight, 
  Heart, 
  MessageSquare, 
  CheckCircle2, 
  Globe2, 
  Info,
  Layers,
  Sparkles,
  Search,
  ChevronRight
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface ResourceCardProps {
  name: string;
  url: string;
  description: string;
  logoText: string;
  colorClass: string;
  badge?: string;
}

function ResourceCard({ name, url, description, logoText, colorClass, badge }: ResourceCardProps) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between h-full group relative overflow-hidden text-right">
      <div className={`absolute top-0 left-0 w-1.5 h-full ${colorClass.split(" ")[0]}`}></div>
      
      <div>
        <div className="flex justify-between items-start mb-2.5">
          {badge && (
            <span className="text-[9.5px] bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-305 font-bold px-2 py-0.5 rounded-md">
              {badge}
            </span>
          )}
          <div className={`w-9 h-9 rounded-xl ${colorClass} text-white flex items-center justify-center font-black text-sm tracking-widest shadow-sm`}>
            {logoText}
          </div>
        </div>

        <h4 className="font-extrabold text-xs text-slate-850 dark:text-slate-100 text-right group-hover:text-purple-600 transition-colors">
          {name}
        </h4>
        <p className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-1 text-right leading-relaxed h-11 overflow-hidden" dir="rtl">
          {description}
        </p>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-50 dark:border-slate-800/60">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-slate-50 dark:bg-slate-850 hover:bg-purple-600 dark:hover:bg-purple-600 hover:text-white dark:text-slate-200 text-slate-700 font-bold text-[10.5px] py-1.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <span>فتح الموقع الرسمي</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}

export default function SpeakingPractice() {
  const { addPracticeResult } = useAuth();
  const [markedCompleted, setMarkedCompleted] = useState<Record<string, boolean>>({});
  const [activePartTab, setActivePartTab] = useState<"step1" | "step2" | "step3">("step1");
  const [searchQuery, setSearchQuery] = useState("");

  const speakingResources = [
    {
      name: "Cathoven (التقييم اللغوي)",
      url: "https://www.cathoven.com/",
      description: "تحليل ذكي لتدفق الإجابات الصوتية للأيلتس وتقييم الطلاقة والنطق والمفردات لبناء بند مرتفع.",
      logoText: "CAT",
      colorClass: "bg-gradient-to-br from-indigo-600 to-indigo-800",
      badge: "تقييم لغوي مدفوع بالذكاء"
    },
    {
      name: "Engnovate (تطوير الفهم)",
      url: "https://engnovate.com/",
      description: "تدريب عملي على طلاقة التعبير وتدفق الأفكار ومقاومة التلعثم مع استراتيجيات الصياغة الذكية للمحادثة.",
      logoText: "ENG",
      colorClass: "bg-gradient-to-br from-emerald-500 to-emerald-700",
      badge: "تطوير الطلاقة والنطق"
    },
    {
      name: "IELTS Online Tests (اختبارات محاكاة)",
      url: "https://ieltsonlinetests.com/",
      description: "منصة اختبارات تجريبية مجانية كاملة تحاكي واجهة وأسئلة لجان اختبار الآيلتس مع توفير موقت رقمي دقيق.",
      logoText: "IOT",
      colorClass: "bg-gradient-to-br from-blue-500 to-indigo-700",
      badge: "اختبار تجريبي واقعي"
    },
    {
      name: "Advantages – 1000 Speaking Questions (بنك الأسئلة)",
      url: "https://www.ieltsadvantage.com/ielts-speaking-questions-and-topics/",
      description: "مستودع ضخم مجاني يضم أكثر من 1000 سؤال فعلي للتحدث مأخوذ من اختبارات الآيلتس السابقة مع الإجابات النموذجية.",
      logoText: "ADV",
      colorClass: "bg-gradient-to-br from-purple-650 to-pink-700",
      badge: "بنك الأسئلة المعتمدة"
    },
    {
      name: "Advantages of Speaking (استراتيجيات التحدث)",
      url: "https://www.ieltsadvantage.com/ielts-speaking/",
      description: "أفضل دليل استراتيجي تدريبي مجاني لتعلم مهارات الإقناع والهيكلة والتقنيات اللغوية في مقابلة الآيلتس.",
      logoText: "STG",
      colorClass: "bg-gradient-to-br from-amber-500 to-orange-700",
      badge: "دليل استراتيجية المقابلة"
    }
  ];

  const filteredResources = speakingResources.filter(src => 
    src.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    src.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (src.badge && src.badge.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Speaking Questions Bank (Under 1000 Advantages Core list)
  const part1Topics = [
    { category: "Work and Studies (العمل والدراسة)", questions: ["Do you study or do you work?", "What do you like most about your university?", "Why did you choose this subject?"] },
    { category: "Home and Hometown (المنزل والبلدة)", questions: ["Where is your hometown located?", "What do you like about living there?", "Are there many parks near your home?"] },
    { category: "Laisure Time (وقت الفراغ)", questions: ["What do you do in your spare time?", "Do you prefer spending time alone or with friends?", "How often do you play sports?"] }
  ];

  const part2Topics = [
    { title: "Describe a useful technological device you bought recently.", cues: ["What the device is", "When and why you bought it", "How often you use it", "Explain why it is useful to you."] },
    { title: "Describe a person who has greatly influenced your academic journey.", cues: ["Who the person is", "How you met them", "What you learned from them", "Explain how they influenced you."] }
  ];

  const part3Topics = [
    { question: "What are the advantages of using online learning platforms instead of traditional classrooms?", advantageHighlight: "Offers unparalleled structural flexibility and personalized pace." },
    { question: "Why do some people prefer living in high-tech smart cities rather than simple countryside regions?", advantageHighlight: "Guarantees robust service availability and high integration of facilities." },
    { question: "How does globalization influence traditional cultural practices in local communities?", advantageHighlight: "Enhances cross-border dialogue but can occasionally dilute native heritage." }
  ];

  const handleTrackResourceStudy = async (resourceName: string) => {
    if (markedCompleted[resourceName]) return;
    try {
      setMarkedCompleted(prev => ({ ...prev, [resourceName]: true }));
      await addPracticeResult(
        "Speaking",
        "7.5",
        `تم التدريب الخارجي الفعال بنجاح على منصة ${resourceName} لقسم التحدث ومراجعة مواضيعه اليومية.`
      );
      alert(`🎉 رائع! تم تسجيل الجلسة بنجاح، وإضافة نقاط تقديرية في مستودع الإحصائيات!`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 font-sans text-right">
      
      {/* Upper header segment */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-5">
        <div className="w-full md:w-auto">
          <h2 className="text-lg md:text-xl font-black text-slate-850 dark:text-slate-50 flex items-center justify-end gap-2 text-right">
            <span>مصادر ومنصات التدريب لقسم المحادثة (IELTS Speaking Dashboard)</span>
            <span className="p-1.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg text-indigo-600 dark:text-indigo-405">🗣</span>
          </h2>
          <p className="text-xs text-slate-405 dark:text-slate-500 mt-1 text-right">
            توجّه للتدريب على أفضل المصادر والأسئلة للامتحان الحقيقي الموثقة رسمياً. سجل ممارساتك لتحصل على نقاط وإحصائيات لتتبع تقدمك.
          </p>
        </div>
      </div>

      {/* Modern responsive Search Bar aligned with IELTS brand colours */}
      <div className="relative max-w-md mr-auto">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="h-4 w-4 text-purple-600" />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث عن المنصات والمواقع التعليمية الشريكة..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-right text-slate-700 dark:text-slate-205 focus:outline-none focus:ring-2 focus:ring-purple-550 focus:border-transparent transition-all shadow-sm"
          dir="rtl"
        />
      </div>

      {/* 5 Beautifully aligned resources cards with dynamic registers */}
      {filteredResources.length === 0 ? (
        <div className="text-center py-10 bg-slate-50/50 dark:bg-slate-950/30 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
          <p className="text-xs text-slate-400">لا توجد مواقع تعليمية تطابق بحثك حالياً.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((src, i) => (
            <div key={i} className="flex flex-col justify-between h-auto">
              <ResourceCard
                name={src.name}
                url={src.url}
                description={src.description}
                logoText={src.logoText}
                colorClass={src.colorClass}
                badge={src.badge}
              />
              {/* Real study logger indicator */}
              <button
                onClick={() => handleTrackResourceStudy(src.name)}
                disabled={markedCompleted[src.name]}
                className={`mt-2 py-1.5 px-3 text-[10px] rounded-lg font-bold transition-all border ${
                  markedCompleted[src.name]
                    ? "bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-305 border-purple-100 dark:border-purple-900/40"
                    : "bg-white dark:bg-slate-900 text-slate-500 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-300 border-slate-100 dark:border-slate-800 hover:border-purple-250 cursor-pointer"
                }`}
              >
                {markedCompleted[src.name] ? "✓ تم تسجيل دراسة المصدر" : "سجل ممارسة هذا المصدر اليوم 📥"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 1000 Advantages Speaking Questions Hub */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-5 md:p-6 shadow-sm">
        <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex gap-2">
            {(["step1", "step2", "step3"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActivePartTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  activePartTab === tab
                    ? "bg-purple-600 text-white shadow-sm"
                    : "bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 hover:bg-slate-100"
                }`}
              >
                {tab === "step1" ? "Part 1 (الأسئلة الروتينية)" : tab === "step2" ? "Part 2 (بطاقة الفكرة Cue Card)" : "Part 3 (النقاشية الصعبة)"}
              </button>
            ))}
          </div>

          <h3 className="font-extrabold text-slate-850 dark:text-slate-100 text-sm flex items-center gap-1.5 justify-end">
            <span>مستودع تدريبات الـ 1000 سؤال (Speaking Topic Cards)</span>
            <Layers className="h-4.5 w-4.5 text-purple-600" />
          </h3>
        </div>

        {/* Dynamic Part Content Render */}
        {activePartTab === "step1" && (
          <div className="space-y-4 animate-fade-in text-right">
            <p className="text-[11px] text-slate-405 leading-relaxed">أجب على هذه الأسئلة التمهيدية مباشرة مستعيناً بالتدفق والثقة، دون تأخير أو تردد مطول:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {part1Topics.map((topic, i) => (
                <div key={i} className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border dark:border-slate-850/60 text-right">
                  <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded font-black">{topic.category}</span>
                  <div className="space-y-2 mt-3 text-left font-mono text-[11px] text-slate-700 dark:text-slate-300" dir="ltr">
                    {topic.questions.map((q, idx) => (
                      <p key={idx} className="flex gap-1.5 items-start">
                        <span className="text-purple-500 font-bold">•</span>
                        <span>{q}</span>
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activePartTab === "step2" && (
          <div className="space-y-4 animate-fade-in text-right">
            <p className="text-[11px] text-slate-405 leading-relaxed">تحصل في Part 2 على دقيقة واحدة للتحضير وكتابة الأفكار، ثم الحديث بثبات لمدة دقيقتين:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {part2Topics.map((topic, i) => (
                <div key={i} className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border dark:border-slate-850/60">
                  <span className="text-[9px] bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-410 px-2.5 py-0.5 rounded-lg font-bold">CUE CARD {i+1}</span>
                  <h4 className="font-extrabold text-xs text-slate-805 dark:text-slate-105 mt-2.5 text-left font-sans leading-relaxed" dir="ltr">{topic.title}</h4>
                  
                  <div className="mt-3 bg-white dark:bg-slate-900 border dark:border-slate-850 p-3 rounded-xl text-left font-mono text-[10.5px] text-slate-500 space-y-1" dir="ltr">
                    <span className="text-[9.5px] font-bold text-slate-600 block mb-1">Cues to cover:</span>
                    {topic.cues.map((cue, idx) => (
                      <div key={idx} className="flex gap-1.5 items-start">
                        <span className="text-purple-400">•</span>
                        <span>{cue}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activePartTab === "step3" && (
          <div className="space-y-4 animate-fade-in text-right">
            <p className="text-[11px] text-slate-405 leading-relaxed">الأسئلة التحليلية العميقة. يحب المصحح استماع المقارنات والشروحات المتسلسلة والمميزات والعيوب الأكاديمية:</p>
            <div className="space-y-3">
              {part3Topics.map((item, i) => (
                <div key={i} className="bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border dark:border-slate-850/60 flex items-start gap-3 flex-row-reverse text-right">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-purple-705 dark:text-purple-410 flex items-center justify-center font-bold text-xs shrink-0 font-mono">
                    Q{i+1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 text-left" dir="ltr">{item.question}</h4>
                    <div className="mt-2 bg-purple-50/50 dark:bg-purple-955/15 p-2.5 rounded-xl border border-dashed border-purple-200/50 dark:border-purple-900/40 text-right">
                      <span className="text-[9px] text-purple-700 dark:text-purple-305 font-bold block mb-0.5">مفردة مقترحة للإجابة (Vocabulary Leverage)</span>
                      <p className="font-mono text-[11px] text-purple-900 dark:text-purple-300 font-bold text-left" dir="ltr">"{item.advantageHighlight}"</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Daily speaking challenge (Replaces old custom voice with beautiful prompt) */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3.5xl p-5 md:p-6 border border-indigo-950 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-3 flex-wrap gap-2 text-right">
          <span className="text-[9.5px] text-indigo-300 font-bold font-mono tracking-widest uppercase">IELTS Speaking Challenge</span>
          <h3 className="font-extrabold text-white text-xs flex items-center gap-1.5 justify-end">
            <span>تحدي التحدث الشخصي اليومي (Daily Practice Prompts)</span>
            <Sparkles className="h-4.5 w-4.5 text-indigo-400" />
          </h3>
        </div>

        <p className="text-xs text-slate-300 mb-4 leading-relaxed text-right">
          استغل المواقع والأدوات الأكاديمية المقترحة بالأعلى للتحضير بطلاقة وارتجل إجابة تفصيلية حول هذا الكي كارد لليوم الدراسي:
        </p>

        <div className="bg-white/5 border border-white/10 rounded-2.5xl p-4.5 text-left font-sans text-xs text-slate-200 mb-4 space-y-2 leading-relaxed">
          <p className="font-bold text-indigo-300 text-sm">Describe a beautiful public space or national park that you remember visiting.</p>
          <p className="text-[11px] text-slate-400 font-bold">You should say:</p>
          <ul className="list-disc pl-5 text-[11px] text-slate-350 space-y-1 font-mono">
            <li>Where this beautiful space is located</li>
            <li>What this place looks like and its key landscapes</li>
            <li>What you did when you visited there</li>
            <li>And explain why this place had such positive impacts on you.</li>
          </ul>
        </div>

        <div className="flex items-center gap-2 justify-end text-[10.5px] text-slate-400 italic">
          <span>افتح IELTS Speak أو IELTS Online Tests في كروت المنصات بالأعلى للارتجال وتحضير الأفكار.</span>
          <Info className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
        </div>
      </div>

      {/* Speaking Evaluation Criteria */}
      <div className="bg-slate-100/30 dark:bg-slate-900/40 p-4 rounded-2.5xl border border-slate-200/40 dark:border-slate-800/80">
        <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 mb-2.5 text-right">⚖️ معايير تقييم درجات التحدث الأربعة (Assessing Criteria)</h4>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-right">
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-850/60 p-3 rounded-xl shadow-xs">
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold block mb-1">Fluency & Coherence</span>
            <p className="text-[10px] text-slate-405 mt-0.5">الحديث بالتدفق، الترابط الطبيعي وسرعة الإدراك دون فترات صمت ملحوظة.</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-850/60 p-3 rounded-xl shadow-xs">
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block mb-1">Lexical Resource</span>
            <p className="text-[10px] text-slate-405 mt-0.5">قوة المفردات واستخدام صياغات بليغة لغوية خالية من التكرار العقيم.</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-850/60 p-3 rounded-xl shadow-xs">
            <span className="text-[10px] text-orange-600 dark:text-orange-400 font-bold block mb-1">Grammatical Range & Accuracy</span>
            <p className="text-[10px] text-slate-405 mt-0.5">التطبييق الدقيق للمقاطع الشرطية وتنوع زمن الجملة المركبة والمفردة.</p>
          </div>
          <div className="bg-white dark:bg-slate-900 border dark:border-slate-850/60 p-3 rounded-xl shadow-xs">
            <span className="text-[10px] text-pink-600 dark:text-pink-400 font-bold block mb-1">Pronunciation Accuracy</span>
            <p className="text-[10px] text-slate-405 mt-0.5">وضوح نبرة صوت الحروف، ومخارج المقاطع اللغوية السهلة الفهم للممتحن.</p>
          </div>
        </div>
      </div>

    </div>
  );
}

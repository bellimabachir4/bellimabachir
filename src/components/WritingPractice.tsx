import React, { useState } from "react";
import { ExternalLink, Edit3, HelpCircle, FileText, Sparkles, CheckSquare, X, Search, Copy, Check, ChevronDown, Award } from "lucide-react";

interface SynonymItem {
  word: string;
  synonyms: string;
}

const IELTS_SYNONYMS: SynonymItem[] = [
  { word: "Find", synonyms: "Detect, obtain, pinpoint, discover, unearth" },
  { word: "Make", synonyms: "Assemble, build, devise, construct, form" },
  { word: "Very", synonyms: "Extremely, particularly, genuinely, incredibly, really" },
  { word: "Fast", synonyms: "Accelerated, rapid, brisk, nimble, ultrafast" },
  { word: "Funny", synonyms: "Comical, witty, hilarious, amusing, humorous" },
  { word: "Amazing", synonyms: "Fabulous, awesome, incredible, mind-blowing, astounding" },
  { word: "Usually", synonyms: "Basically, generally, casually, normally, commonly" },
  { word: "Profession", synonyms: "Occupation, employment, job, walk of life, career" },
  { word: "Tourists", synonyms: "Travelers, visitors, holidaymakers, sightseers, trippers" },
  { word: "Parents", synonyms: "Guardians, forbearers, progenitors, caretakers, begetters" },
  { word: "Reduce", synonyms: "Lessen, diminish, deplete, shrink, lighten" },
  { word: "Control", synonyms: "Manage, supervise, regulate, curb, manipulate" },
  { word: "Weak", synonyms: "Feeble, vulnerable, fragile, delicate, frail" },
  { word: "Continue", synonyms: "Maintain, sustain, carry on, uphold, keep going" },
  { word: "Experts", synonyms: "Specialists, professionals, scientists, researchers" },
  { word: "Describe", synonyms: "Express, explain, illustrate, elucidate, narrate" },
  { word: "Lack", synonyms: "Deficiency, shortage, deficit, dearth, scarcity" },
  { word: "Environment", synonyms: "Natural world, mother nature, ecology, surroundings, conditions" },
  { word: "Big", synonyms: "Enormous, gigantic, massive, immense, substantial" },
  { word: "Legal", synonyms: "Legitimate, lawful, rightful, authorized, valid" },
  { word: "Essential", synonyms: "Crucial, requisite, indispensable, necessary, compulsory" },
  { word: "Country", synonyms: "Nation, state, province, kingdom, territory" },
  { word: "Increase", synonyms: "Growth, expansion, increment, surge, escalation" },
  { word: "Effect", synonyms: "Result, outcome, end-product, aftermath, impact" },
  { word: "Easy", synonyms: "Effortless, straightforward, simple, painless, outgoing" },
  { word: "Die", synonyms: "Demise, pass away, terminate, perish, succumb" },
  { word: "Children", synonyms: "Infants, newborns, youngsters, juveniles, babies" },
  { word: "World", synonyms: "Globe, earth, planet, universe, sphere" },
  { word: "Old people", synonyms: "Elderly, senior, ageing, aged, retired" },
  { word: "Government", synonyms: "Administration, authority, officials, executive, state" },
  { word: "Prison", synonyms: "Lockup, imprisonment, captivity, custody, detention" },
  { word: "Weaknesses", synonyms: "Shortcomings, deficiencies, limitation, inadequacy, flaws" },
  { word: "Games", synonyms: "Contest, tournament, sports, competition, championship" },
  { word: "Reducing", synonyms: "Mitigating, dwindling, curbing, downsizing" },
  { word: "Consume", synonyms: "Deplete, exhaust, diminish, squander, drain" },
  { word: "Disagree", synonyms: "Oppose, challenge, refute, argue, contradict" },
  { word: "Expensive", synonyms: "Costly, extravagant, high-priced, exorbitant, overpriced" },
  { word: "Modern", synonyms: "Contemporary, present-day, trendy, cutting-edge, updated" },
  { word: "Communication", synonyms: "Socialization, interaction, conversation, dealings, contact" },
  { word: "Develop", synonyms: "Upgrade, prosper, advance, elevate, improve" },
  { word: "Encourage", synonyms: "Motivate, inspire, empower, advocate, support" },
  { word: "Negative", synonyms: "Adverse, harmful, damaging, destructive" },
  { word: "Bad effects", synonyms: "Harmful impact, negative effects, detriments, repercussions" },
  { word: "Programme", synonyms: "Course, workshop, seminar, agenda, affairs" },
  { word: "Strict", synonyms: "Harsh, rigorous, rigid, stringent, unyielding" },
  { word: "Dull", synonyms: "Monotonous, uninteresting, tedious, boring, mundane" },
  { word: "New", synonyms: "Unique, latest, current, original, innovative" },
  { word: "Difference", synonyms: "Dissimilarity, contrast, disparity, variation, diversity" },
  { word: "Banned", synonyms: "Forbidden, restricted, contraband, outlawed, unlawful" },
  { word: "Pollution", synonyms: "Contamination, impairment, dirtiness, tainting, infection" },
  { word: "Wrong", synonyms: "Incorrect, mistaken, erroneous, unsound, inaccurate" },
  { word: "Conflict", synonyms: "Battle, hostility, struggle, collision, assault" },
  { word: "Effective", synonyms: "Constructive, productive, functional, capable, practical" },
  { word: "Happy", synonyms: "Cheerful, delighted, jubilant, delightful, heartwarming" },
  { word: "Calm", synonyms: "Peace, tranquil, serene, placid, harmonious" },
  { word: "Important", synonyms: "Significant, paramount, vital, pressing, crucial" },
  { word: "Students", synonyms: "Learners, trainees, pupils, schoolboys, schoolgirls" },
  { word: "Teachers", synonyms: "Educators, instructors, mentors, professors, academics" },
  { word: "People", synonyms: "Individuals, humans, citizens, mankind, humankind" },
  { word: "Advantage", synonyms: "Benefit, convenience, privilege, amenity, prerogative" },
  { word: "Disadvantage", synonyms: "Drawback, downside, handicap, trouble, impediment" },
  { word: "Have", synonyms: "Possess, own, hold, retain" },
  { word: "Acceptable", synonyms: "Reasonable, appropriate, fair, satisfactory, adequate" },
  { word: "Problem", synonyms: "Hindrance, obstacle, setback, misfortune, plight" },
  { word: "Agree", synonyms: "Assent, consent, in favor, comply, approve of" },
  { word: "Migrating", synonyms: "Shifting, moving, relocating, departing" },
  { word: "Old-fashioned", synonyms: "Outdated, obsolete, outmoded, antiquated, ancient" },
  { word: "Famous", synonyms: "Well known, renowned, eminent, prominent, distinguished" },
  { word: "Logical", synonyms: "Analytical, coherent, rational, insightful, thorough" },
  { word: "Traditional", synonyms: "Conventional, customary, classical, stereotyped, ritual" },
  { word: "Dangerous", synonyms: "Hazardous, perilous, risky, threatening, insecure" },
  { word: "Information", synonyms: "Data, figures, details, facts, statistics" },
  { word: "Youth", synonyms: "Adolescence, young people, teens, childhood, juveniles" },
  { word: "Good", synonyms: "Excellent, stunning, outstanding, exceptional, great" },
  { word: "Live", synonyms: "Dwell, reside, settle, inhabit, survive" },
  { word: "Century", synonyms: "Generation, millennium, epoch, 100 years" },
  { word: "Many", synonyms: "Countless, numerous, myriad, considerable, manifold" },
  { word: "Awful", synonyms: "Dreadful, offensive, horrible, appalling, nasty" },
  { word: "Gather", synonyms: "Accumulate, collect, assemble, aggregate, hoard" },
  { word: "Brief", synonyms: "Concise, succinct, compressed, compact, summary" },
  { word: "Begin", synonyms: "Initiate, commence, inaugurate, undertake, instigate" },
  { word: "Solution", synonyms: "Formula, remedy, resolution, panacea, way out" },
  { word: "Show", synonyms: "Exhibition, demonstration, display, presentation, showcase" },
  { word: "Strong", synonyms: "Formidable, robust, durable, tough, substantial" },
  { word: "Views", synonyms: "Opinions, notions, beliefs, ideas, concepts" }
];

export default function WritingPractice() {
  const [essayText, setEssayText] = useState("");
  const [selectedTask, setSelectedTask] = useState<"task1" | "task2">("task2");
  const [showNotification, setShowNotification] = useState(false);

  // Academic Learning Desk States
  const [learningTab, setLearningTab] = useState<"task1" | "task2" | "synonyms">("task1");
  const [task1SubTab, setTask1SubTab] = useState<"line" | "bar" | "pie" | "diagram" | "map" | "table">("line");
  const [synonymsQuery, setSynonymsQuery] = useState("");
  const [paragraphStep, setParagraphStep] = useState(1);
  const [builtParagraph, setBuiltParagraph] = useState({
    part1: "",
    part2: "",
    part3: "",
    part4: "",
    part5: ""
  });
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2050);
  };
  
  // Quick AI metrics checklist
  const wordCount = essayText.trim() === "" ? 0 : essayText.trim().split(/\s+/).length;
  const targetWords = selectedTask === "task1" ? 150 : 250;
  const percentageComplete = Math.min(Math.round((wordCount / targetWords) * 100), 100);

  // Suggested prompts
  const task2Prompts = [
    "Some people think that universities should provide graduates with the knowledge and skills needed in the workplace. Others think that the true function of a university should be to give access to knowledge for its own sake, regardless of whether the course is useful to an employer. Discuss both views and give your opinion.",
    "People in many countries are spending more and more time away from their families. Why is this happening? What effects does this have on individuals and family life?",
    "Many people think that artificial intelligence will replace humans in most routine tasks in the future. In your opinion, is this a positive or negative development?"
  ];

  const [activePromptIndex, setActivePromptIndex] = useState(0);

  const handleLaunchCathoven = () => {
    window.open("https://www.cathoven.com/", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="space-y-6 md:space-y-8 font-sans max-w-4xl mx-auto relative z-10">
      
      {/* Toast Notification Alert (Replaces window.alert for perfect iFrame portability) */}
      {showNotification && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm z-50 animate-fade-in">
          <div className="glass-card max-w-md w-full p-6 text-right relative shadow-2xl border border-white/40 rounded-3xl animate-scale-up">
            <button 
              onClick={() => setShowNotification(false)}
              className="absolute top-4 left-4 p-1.5 rounded-full hover:bg-white/20 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-3 justify-end mb-4">
              <h4 className="text-base font-bold text-slate-800">مراجعة المسودة</h4>
              <span className="p-2 bg-purple-500/10 rounded-2xl text-purple-600 block shrink-0">
                <CheckSquare className="h-5 w-5" />
              </span>
            </div>
            <div className="space-y-3 mb-6">
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                مسودتك الحالية تحتوي على <span className="text-purple-700 font-bold font-mono">{wordCount}</span> كلمة.
              </p>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                لحفظ مجهودك وترقية جودة ورقتك بالتصحيح الإملائي والقواعدي الشامل، انسخ مسودتك حالياً وانتقل مباشرة للصقها بصفحة التدريبات المعتمدة في منصة <strong className="text-indigo-600">Cathoven</strong> المتكاملة!
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowNotification(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-white/30 transition-colors"
              >
                رجوع للمحرر
              </button>
              <button
                onClick={() => {
                  setShowNotification(false);
                  handleLaunchCathoven();
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90 shadow-md shadow-purple-500/20 transition-all"
              >
                الانتقال لـ Cathoven
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="glass-card-no-hover p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-right">
        <div className="w-full">
          <h2 className="text-xl font-bold text-slate-800 flex items-center justify-end gap-2.5">
            <span>قسم الكتابة والتعبير (Writing Suite)</span>
            <span className="p-2 bg-indigo-500/15 rounded-2xl text-indigo-600">✍️</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl mr-auto">
            تصميم زجاجي بسيط ومباشر يركز تفكيرك على الأهداف الأساسية للامتحان دون تشتيت أو تعقيد واجهات.
          </p>
        </div>
      </div>

      {/* CORE ONE-BUTTON LAUNCHER (CATHOWEN INTEGRATION) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-700/80 to-indigo-900/80 border border-white/20 p-6 md:p-8 text-white shadow-xl shadow-purple-900/10 text-center flex flex-col items-center justify-center space-y-4 backdrop-blur-md">
        {/* Animated ambient backdrop lights */}
        <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-purple-500/25 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-60 h-60 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none"></div>

        <Edit3 className="h-10 w-10 text-purple-200 animate-pulse" />
        <h3 className="text-lg font-bold font-sans">ابدأ التدريب الفعلي على الكتابة الذكية</h3>
        <p className="text-xs text-purple-100/90 max-w-lg leading-relaxed font-sans">
          انتقل مباشرةً إلى منصة <strong>Cathoven</strong> المتكاملة لتقييم وصقل مهارات تعبيرك الأكاديمي وصياغة الجمل بالذكاء الاصطناعي المتقدم.
        </p>
        
        <button
          onClick={handleLaunchCathoven}
          className="flex items-center gap-2 px-8 py-3 bg-white text-purple-900 font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all text-sm group"
        >
          <span className="group-hover:translate-x-0.5 transition-transform">👉 Start Writing Practice Cathoven</span>
          <ExternalLink className="h-4 w-4 shrink-0 text-purple-700" />
        </button>
      </div>

      {/* Writing targets indicator cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Task 1 Selector */}
        <div 
          onClick={() => setSelectedTask("task1")}
          className={`p-5 rounded-3xl border cursor-pointer transition-all duration-300 flex flex-col justify-between text-right ${
            selectedTask === "task1" 
              ? "glass-card border-purple-500/40 shadow-md shadow-purple-500/5" 
              : "bg-white/30 backdrop-blur-sm border-white/20 opacity-70 hover:opacity-100"
          }`}
        >
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${selectedTask === "task1" ? "bg-purple-100 text-purple-800" : "bg-slate-100 text-slate-600"}`}>TASK 1</span>
              <span className="text-xs font-bold text-slate-700 font-mono">150 كلمة</span>
            </div>
            <p className="text-xs font-bold text-slate-800 mb-1.5 font-sans">وصف البيانات والمخططات الأكاديمية</p>
            <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
              قم بتحليل ووصف الرسوم البيانية، الجداول الإحصائية، أو الأنظمة الفيزيائية في تقرير رسمي مختصر لا يقل عن 150 كلمة.
            </p>
          </div>
        </div>

        {/* Task 2 Selector */}
        <div 
          onClick={() => setSelectedTask("task2")}
          className={`p-5 rounded-3xl border cursor-pointer transition-all duration-300 flex flex-col justify-between text-right ${
            selectedTask === "task2" 
              ? "glass-card border-purple-500/40 shadow-md shadow-purple-500/5" 
              : "bg-white/30 backdrop-blur-sm border-white/20 opacity-70 hover:opacity-100"
          }`}
        >
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${selectedTask === "task2" ? "bg-purple-100 text-purple-800" : "bg-slate-100 text-slate-600"}`}>TASK 2</span>
              <span className="text-xs font-bold text-slate-700 font-mono">250 كلمة</span>
            </div>
            <p className="text-xs font-bold text-slate-800 mb-1.5 font-sans">مقالات التعبير والنقاش الأكاديمي</p>
            <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
              اكتب مقالاً تفصيلياً رداً على وجهة نظر معينة، معضلة اجتماعية، أو ادعاء جدلي، مع تبرير الرأي في 250 كلمة على الأقل.
            </p>
          </div>
        </div>

      </div>

      {/* Lightweight writing practice playground */}
      <div className="glass-card rounded-3xl p-5 md:p-6 space-y-4 text-right">
        
        <div className="flex justify-between items-center flex-wrap gap-2 border-b border-white/20 pb-3">
          <span className="text-xs font-bold text-purple-700 block font-sans">📝 مفكرة وتدريب كتابي غير معقد لزيادة السرعة</span>
          <div className="flex gap-1.5 font-mono">
            <span className="text-[11px] bg-slate-100/70 border border-slate-200/40 text-slate-600 font-semibold px-2.5 py-1 rounded-xl">
              {wordCount} كلمة
            </span>
            <span className="text-[11px] bg-purple-50/70 border border-purple-200/40 text-purple-800 font-bold px-2.5 py-1 rounded-xl">
              الهدف الحالي: {targetWords} كلمة
            </span>
          </div>
        </div>

        {/* Prompt Selection Tab */}
        {selectedTask === "task2" && (
          <div className="bg-white/40 border border-white/30 p-3.5 rounded-2xl text-right">
            <div className="flex justify-between items-center mb-2">
              <button
                onClick={() => {
                  setActivePromptIndex((prev) => (prev + 1) % task2Prompts.length);
                }}
                className="text-[10px] text-indigo-600 font-bold hover:underline transition-all flex items-center gap-1"
              >
                تحديث المقترح 🔄
              </button>
              <span className="text-[10px] bg-slate-200/60 text-slate-700 px-2 py-0.5 rounded-md font-bold font-sans">أفكار ومقترحات للمقالات:</span>
            </div>
            <p className="text-xs italic text-slate-650 leading-relaxed text-left font-sans" dir="ltr">
              "{task2Prompts[activePromptIndex]}"
            </p>
          </div>
        )}

        <textarea
          value={essayText}
          onChange={(e) => setEssayText(e.target.value)}
          placeholder={`اكتب مسودتك أو جزء من مقالك التجريبي هنا لتتبع سرعة كتابتك وتأكدك من الوصول للحدود المطلوبة (${targetWords} كلمة)...`}
          className="w-full h-44 p-4 text-xs border border-white/45 rounded-2xl bg-white/40 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/25 font-sans resize-none placeholder-slate-400"
          dir="ltr"
        />

        {/* Real-time statistics bar */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          
          <div className="flex items-center gap-2.5 flex-1 min-w-[200px]">
            <div className="w-full bg-slate-200/50 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${percentageComplete}%` }}
              ></div>
            </div>
            <span className="text-xs font-mono font-bold text-slate-700 w-10 shrink-0 text-left">
              {percentageComplete}%
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setEssayText("")}
              className="px-4 py-2 text-xs text-slate-500 hover:text-slate-700 hover:bg-white/30 rounded-xl font-semibold transition-colors"
            >
              مسح المفكرة
            </button>
            <button
              onClick={() => {
                setShowNotification(true);
              }}
              disabled={wordCount === 0}
              className="px-5 py-2 text-xs font-bold bg-slate-800 hover:bg-slate-900 disabled:bg-slate-200/50 disabled:text-slate-400 text-white rounded-xl transition-all shadow-sm"
            >
              تدقيق ومراجعة الكلمات 🔎
            </button>
          </div>

        </div>
      </div>

      {/* ------------------- ACADEMIC LEARNING STATION (محطة التعلم الأكاديمي الشامل) ------------------- */}
      <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-xl space-y-6 text-right relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Learning station header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-slate-200/40 pb-5">
          <div className="flex items-center gap-2.5 rtl-layout justify-end w-full md:w-auto">
            <div className="text-right">
              <h3 className="text-base font-bold text-slate-900 font-sans">قسم الكتابة والتعلم الأكاديمي (Academic Learning Station)</h3>
              <p className="text-xs text-slate-500 font-sans mt-0.5">تحويل التدرب إلى مهارة واعية وحفظ المصطلحات الأكاديمية المطلوبة لـ Task 1 و Task 2.</p>
            </div>
            <span className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl shadow-sm">
              <Award className="h-5 w-5 animate-pulse" />
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200/50 pb-3 justify-end" dir="rtl">
          <button
            onClick={() => setLearningTab("task1")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              learningTab === "task1"
                ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
            }`}
          >
            📊 مصطلحات التعبير الأكاديمي (Task 1 Vocabulary)
          </button>
          <button
            onClick={() => setLearningTab("task2")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              learningTab === "task2"
                ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
            }`}
          >
            ✍️ هيكل بناء الفقرات والمقالات (Task 2 Guide)
          </button>
          <button
            onClick={() => setLearningTab("synonyms")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              learningTab === "synonyms"
                ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200/80"
            }`}
          >
            🔍 بنك المترادفات والبدائل الذكية (IELTS Synonyms)
          </button>
        </div>

        {/* Tab content inside station */}
        {learningTab === "task1" && (
          <div className="space-y-6 text-right animate-fade-in" dir="rtl">
            <div className="bg-purple-50/50 border border-purple-100 p-4 rounded-2xl">
              <p className="text-xs text-purple-800 leading-relaxed">
                💡 <strong>استراتيجية الكتابة الأكاديمية Task 1:</strong> يحتاج المصحح لرؤية استخدام متنوع للمفردات الدقيقة لوصف التغيرات والمقارنات. لتفادي تكرار الكلمات، احفظ الفئات المحددة أدناه لتوظيفها بشكل صحيح!
              </p>
            </div>

            {/* Sub-tabs for chart types */}
            <div className="flex flex-wrap gap-1.5 bg-slate-100/60 p-1.5 rounded-2xl justify-end">
              {[
                { id: "line", label: "📈 Line Graphs" },
                { id: "bar", label: "📊 Bar Charts" },
                { id: "pie", label: "🥧 Pie Charts" },
                { id: "diagram", label: "⚙️ Diagrams / Processes" },
                { id: "map", label: "🗺️ Maps" },
                { id: "table", label: "📋 Tables & Data" }
              ].map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setTask1SubTab(sub.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                    task1SubTab === sub.id
                      ? "bg-white text-purple-700 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* Sub-tab core vocabulary rendering */}
            {task1SubTab === "line" && (
              <div className="bg-white/50 border border-slate-150 rounded-2xl p-4 md:p-5 space-y-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 border-b border-slate-100 pb-2 justify-end">
                  <span>Essential Vocabulary for Line Graphs & Trends</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { eng: "increased gradually", ar: "ارتفع تدريجياً" },
                    { eng: "rose steadily", ar: "صعد باضطراد" },
                    { eng: "grew significantly", ar: "نما بشكل ملحوظ" },
                    { eng: "climbed sharply", ar: "ارتفع بصعود حاد" },
                    { eng: "declined rapidly", ar: "انخفض بسرعة فائقة" },
                    { eng: "dropped slightly", ar: "انخفض قليلاً" },
                    { eng: "fell dramatically", ar: "سقط بشكل دراماتيكي" },
                    { eng: "fluctuated throughout the period", ar: "تقلب طوال الفترة" },
                    { eng: "remained stable", ar: "ظل مستقراً وثابتاً" },
                    { eng: "reached a peak", ar: "وصل إلى ذروة قصوى" },
                    { eng: "hit the lowest point", ar: "وصل لأدنى نقطة قاع" },
                    { eng: "levelled off", ar: "استقر واستوى الخط" }
                  ].map((item, i) => (
                    <div key={i} className="p-3 bg-white border border-slate-100 rounded-xl flex items-center justify-between text-right text-xs hover:border-purple-300 transition-colors">
                      <button 
                        onClick={() => handleCopyText(item.eng, `line-${i}`)}
                        className="text-slate-400 hover:text-purple-600 transition-colors"
                        title="Copy phrase"
                      >
                        {copiedIndex === `line-${i}` ? <Check className="h-3.5 w-3.5 text-purple-600" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                      <div className="text-right">
                        <span className="font-mono font-bold text-purple-700 block text-left" dir="ltr">{item.eng}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">{item.ar}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {task1SubTab === "bar" && (
              <div className="bg-white/50 border border-slate-150 rounded-2xl p-4 md:p-5 space-y-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 border-b border-slate-100 pb-2 justify-end">
                  <span>Essential Vocabulary for Bar Charts</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { eng: "the highest figure", ar: "الرقم الأعلى المسجل" },
                    { eng: "the lowest proportion", ar: "النسبة الأدنى المقارنة" },
                    { eng: "significantly higher than", ar: "أعلى بوضوح وبشكل ملحوظ من" },
                    { eng: "slightly lower than", ar: "أقل بقليل وبفارق ضئيل من" },
                    { eng: "roughly the same as", ar: "تقريباً نفس القيمة بالمطابقة" },
                    { eng: "meanwhile, twice as high as", ar: "بينا الآخر سجل ضعفي النسبة" },
                    { eng: "accounted for the largest share", ar: "شكلت الحصة الأكبر من المجموع" },
                    { eng: "represented the smallest category", ar: "مثلت الفئة الأصغر على الإطلاق" },
                    { eng: "exceeded", ar: "تجاوز تخطياً" },
                    { eng: "surpassed", ar: "تفوق على الأرقام الأخرى" },
                    { eng: "fell behind", ar: "تراجع وسجل خلف الباقين" }
                  ].map((item, i) => (
                    <div key={i} className="p-3 bg-white border border-slate-100 rounded-xl flex items-center justify-between text-right text-xs hover:border-purple-300 transition-colors">
                      <button 
                        onClick={() => handleCopyText(item.eng, `bar-${i}`)}
                        className="text-slate-400 hover:text-purple-600 transition-colors"
                        title="Copy phrase"
                      >
                        {copiedIndex === `bar-${i}` ? <Check className="h-3.5 w-3.5 text-purple-600" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                      <div className="text-right">
                        <span className="font-mono font-bold text-purple-700 block text-left" dir="ltr">{item.eng}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">{item.ar}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {task1SubTab === "pie" && (
              <div className="bg-white/50 border border-slate-150 rounded-2xl p-4 md:p-5 space-y-4">
                <div className="border-b border-slate-100 pb-2 text-xs font-bold text-slate-800 justify-end flex">Essential Vocabulary for Pie Charts</div>
                <div className="space-y-4 text-right">
                  <div>
                    <h5 className="text-[11px] font-bold text-purple-850 mb-2">● Proportion Language (لغة وصف الحصص والنسب مئوية):</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {[
                        { eng: "accounted for", ar: "شكلت الحصة المسجلة" },
                        { eng: "constituted", ar: "كونت / بلغت نسبتها" },
                        { eng: "represented", ar: "مثلت الشريحة التابعة" },
                        { eng: "made up", ar: "ألفت ما يعادل" },
                        { eng: "comprised", ar: "ضمت / اشتملت على" },
                        { eng: "formed the largest", ar: "شكلت الشريحة الأكبر" },
                        { eng: "smallest proportion", ar: "النسبة والكسر الأصغر" },
                        { eng: "the dominant category", ar: "الفئة والقطاع المهيمن" },
                        { eng: "a minor share", ar: "حصة وثيرة صغيرة جداً" }
                      ].map((item, i) => (
                        <div key={i} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                          <button onClick={() => handleCopyText(item.eng, `piep-${i}`)} className="text-slate-400 hover:text-purple-600">
                            {copiedIndex === `piep-${i}` ? <Check className="h-3 w-3 text-purple-600" /> : <Copy className="h-3 w-3" />}
                          </button>
                          <div className="text-right">
                            <span className="font-mono font-semibold text-slate-705 block text-left" dir="ltr">{item.eng}</span>
                            <span className="text-[9px] text-slate-400">{item.ar}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-[11px] font-bold text-purple-850 mb-2">● Comparison Language (لغة المقارنات والتناسب):</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {[
                        { eng: "significantly higher than", ar: "أعلى بشكل لافت للنظر عن" },
                        { eng: "considerably lower than", ar: "أقل بدرجة ملموسة عن" },
                        { eng: "roughly similar to", ar: "مشابه بشكل تقريبي لـ" },
                        { eng: "nearly double", ar: "قارب الضعف والمثليين" },
                        { eng: "more than half", ar: "تجاوز حاجز النصف (50%+)" },
                        { eng: "just under a third", ar: "أقل بقليل من الثلث (33%-)" }
                      ].map((item, i) => (
                        <div key={i} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                          <button onClick={() => handleCopyText(item.eng, `piec-${i}`)} className="text-slate-400 hover:text-purple-600">
                            {copiedIndex === `piec-${i}` ? <Check className="h-3 w-3 text-purple-600" /> : <Copy className="h-3 w-3" />}
                          </button>
                          <div className="text-right">
                            <span className="font-mono font-semibold text-slate-707 block text-left" dir="ltr">{item.eng}</span>
                            <span className="text-[9px] text-slate-400">{item.ar}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {task1SubTab === "diagram" && (
              <div className="bg-white/50 border border-slate-150 rounded-2xl p-4 md:p-5 space-y-4">
                <div className="border-b border-slate-100 pb-2 text-xs font-bold text-slate-800 flex justify-end">Essential Vocabulary for Diagrams, Processes & Cycles</div>
                <div className="space-y-4 text-right">
                  <div>
                    <h5 className="text-[11px] font-bold text-purple-850 mb-2">● Sequencing Connectors (المربطات الزمنية تتابعاً):</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {[
                        { eng: "begins with", ar: "تستهل وتبدأ الخطوات بـ" },
                        { eng: "followed by", ar: "يتبع ويلي هذه الخطوة" },
                        { eng: "then, next", ar: "ثم، تالياً لذلك" },
                        { eng: "subsequently", ar: "بالتبعية والتعاقب بعد ذلك" },
                        { eng: "after that", ar: "عقب إنهاء ذلك مباشرة" },
                        { eng: "thereafter", ar: "وبناء عليه في التتابع" },
                        { eng: "finally, in the final stage, concludes with", ar: "أخيراً، بالمرحلة الختامية، تلخص بـ" }
                      ].map((item, i) => (
                        <div key={i} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                          <button onClick={() => handleCopyText(item.eng, `seq-${i}`)} className="text-slate-400 hover:text-purple-600">
                            {copiedIndex === `seq-${i}` ? <Check className="h-3 w-3 text-purple-600" /> : <Copy className="h-3 w-3" />}
                          </button>
                          <div className="text-right">
                            <span className="font-mono font-semibold text-slate-705 block text-left" dir="ltr">{item.eng}</span>
                            <span className="text-[9px] text-slate-400">{item.ar}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="text-[11px] font-bold text-purple-850 mb-2">● Process Verbs (الأفعال في صيغة المبني للمعلوم والمجهول):</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {[
                        { eng: "Collected / is collected", ar: "جمع / يتم تجميعه وفرزه" },
                        { eng: "Processed / is processed", ar: "عولج / تُتم معالجته آلياً" },
                        { eng: "Sorted / is sorted", ar: "فرز / يتم عزله وتصنيفه" },
                        { eng: "Heated / is heated", ar: "سخن / يعرض لدرجات الحرارة" },
                        { eng: "Shaped / is shaped", ar: "شكل / يتم صياغة هيكله" },
                        { eng: "Transported / is transported", ar: "نقل / يُشحن ويتم توزيعه" },
                        { eng: "packaged / is packaged", ar: "غلف / يوضع في عبوات مخصصة" }
                      ].map((item, i) => (
                        <div key={i} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs">
                          <button onClick={() => handleCopyText(item.eng, `proc-${i}`)} className="text-slate-400 hover:text-purple-600">
                            {copiedIndex === `proc-${i}` ? <Check className="h-3 w-3 text-purple-600" /> : <Copy className="h-3 w-3" />}
                          </button>
                          <div className="text-right">
                            <span className="font-mono font-semibold text-slate-705 block text-left" dir="ltr">{item.eng}</span>
                            <span className="text-[9px] text-slate-400">{item.ar}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {task1SubTab === "map" && (
              <div className="bg-white/50 border border-slate-150 rounded-2xl p-4 md:p-5 space-y-4">
                <div className="border-b border-slate-100 pb-2 text-xs font-bold text-slate-800 flex justify-end">Must-Use Vocabulary for Descriptions of Maps (تطور المواقع والبلدات)</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { eng: "expanded / was converted into", ar: "توسع / تم تحويله بالكامل إلى" },
                    { eng: "replaced / removed", ar: "استبدل / تمت إزالته لصالح" },
                    { eng: "constructed / developed", ar: "شيد وبني / طورت المرافق" },
                    { eng: "renovated / relocated", ar: "رمم وجدد / نقل الموقع والارتكاز" },
                    { eng: "demolished", ar: "هُدم وسحب التخطيط التابع له" },
                    { eng: "to the east, to the north", ar: "باتجاه الشرق، باتجاه الشمال" },
                    { eng: "along the coast, adjacent to", ar: "على امتداد الساحل، مجاور لـ" },
                    { eng: "opposite, nearby", ar: "في الجهة المقابلة، على مقربة من" },
                    { eng: "between, surrounding", ar: "بين المنتصف، يحيط بالمنطقة" },
                    { eng: "experienced transformation", ar: "شهد تحولاً جذرياً في التخطيط" },
                    { eng: "underwent redevelopment", ar: "خضع بالكامل لعمليات إعادة تطوير" },
                    { eng: "notable structural change", ar: "تغير بنيوي وهيكلي ملحوظ للأنظار" },
                    { eng: "urban expansion", ar: "التمدد العمراني والتوسع للمدينة" }
                  ].map((item, i) => (
                    <div key={i} className="p-3 bg-white border border-slate-100 rounded-xl flex items-center justify-between text-xs hover:border-purple-300 transition-colors">
                      <button onClick={() => handleCopyText(item.eng, `map-${i}`)} className="text-slate-400 hover:text-purple-600">
                        {copiedIndex === `map-${i}` ? <Check className="h-3 w-3 text-purple-600" /> : <Copy className="h-3 w-3" />}
                      </button>
                      <div className="text-right">
                        <span className="font-mono font-bold text-purple-750 block text-left" dir="ltr">{item.eng}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">{item.ar}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {task1SubTab === "table" && (
              <div className="bg-white/50 border border-slate-150 rounded-2xl p-4 md:p-5 space-y-4">
                <div className="border-b border-slate-100 pb-2 text-xs font-bold text-slate-800 flex justify-end">Must-Use Vocabulary for Tables & Data Compilations</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { eng: "the highest figure", ar: "أعلى رقم وقيمة مسجلة للبيان" },
                    { eng: "the lowest proportion", ar: "النسبة والكسر الأدنى في الجدول" },
                    { eng: "closely followed by", ar: "متبوعاً عن قرب بفرق بسيط بـ" },
                    { eng: "showed similar values", ar: "أبدى قيم معدلات مماثلة للنقاط" },
                    { eng: "registered / recorded", ar: "سجلت / دونت إحصاءات قياسية" },
                    { eng: "exceeded / fell behind", ar: "فاقت وتجاوزت / تأخرت خلف المعدل" },
                    { eng: "demonstrated", ar: "أظهرت وأبدت بوضوح" },
                    { eng: "roughly / approximately / nearly", ar: "تقريباً / حوالي / بصورة تقريبية" },
                    { eng: "just over / just under", ar: "أعلى بقليل من / أدنى بقليل من" },
                    { eng: "considerably more than", ar: "أكثر بشكل ملحوظ وبفارق كبير عن" },
                    { eng: "dramatically lower than", ar: "أقل بدرجة مأهولة ودراماتيكية من" },
                    { eng: "a mid-range cluster", ar: "تجمع درجات مئوية بالفئات المتوسطة" },
                    { eng: "a noticeable gap / a significant margin", ar: "فجوة وبون ملحوظ / هامش تفوق كبير" },
                    { eng: "comparatively modest", ar: "متواضع نسبياً بمقارنته مع البقية" }
                  ].map((item, i) => (
                    <div key={i} className="p-3 bg-white border border-slate-100 rounded-xl flex items-center justify-between text-xs hover:border-purple-300 transition-colors">
                      <button onClick={() => handleCopyText(item.eng, `table-${i}`)} className="text-slate-400 hover:text-purple-600">
                        {copiedIndex === `table-${i}` ? <Check className="h-3 w-3 text-purple-600" /> : <Copy className="h-3 w-3" />}
                      </button>
                      <div className="text-right">
                        <span className="font-mono font-bold text-purple-750 block text-left" dir="ltr">{item.eng}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">{item.ar}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {learningTab === "task2" && (
          <div className="space-y-6 text-right animate-fade-in" dir="rtl">
            <div className="bg-purple-50/50 border border-purple-100 p-4 rounded-2xl">
              <p className="text-xs text-purple-800 leading-relaxed">
                ✍️ <strong>بناء المقال الأكاديمي Task 2:</strong> يزن اختبار الكتابة طريقة ربطك للأفكار وبناء الهيكل المنطقي للمقالة. استخدم الشروحات والأدلة والروابط أدناه لتتعلم كتابة فقرة مثالية من 5 أجزاء!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Introduction Part */}
              <div className="bg-white/50 border border-slate-150 p-4 rounded-2xl space-y-3.5">
                <h4 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2 flex justify-between items-center" dir="ltr">
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">SECTION 1</span>
                  <span>1. Introduction & Opinions (مقدمة المقال)</span>
                </h4>
                
                <div className="space-y-3 text-right">
                  <div>
                    <span className="text-[11px] font-bold text-purple-800 block mb-1">■ Paraphrasing the question (إعادة صياغة السؤال):</span>
                    <div className="flex gap-1.5 flex-wrap">
                      {["In the contemporary era", "These days"].map((phr, idx) => (
                        <button key={idx} onClick={() => handleCopyText(phr, `intro-p-${idx}`)} className="text-[10px] font-mono bg-slate-50 border border-slate-100 text-slate-700 px-2.5 py-1 rounded-lg hover:border-purple-250 flex items-center gap-1">
                          <span dir="ltr">{phr}</span>
                          <span className="text-slate-400 text-[9px]">{copiedIndex === `intro-p-${idx}` ? "✔" : "📋"}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-purple-800 block mb-1">■ Giving your opinion (إعطاء وتأكيد الرأي الأكاديمي):</span>
                    <div className="flex gap-1.5 flex-wrap">
                      {[
                        "I completely agree that",
                        "I totally disagree that",
                        "In my opinion",
                        "Personally, I believe that",
                        "This essay will discuss both views and give my opinion"
                      ].map((phr, idx) => (
                        <button key={idx} onClick={() => handleCopyText(phr, `intro-o-${idx}`)} className="text-[10px] font-mono bg-slate-50 border border-slate-100 text-slate-700 px-2.5 py-1 rounded-lg hover:border-purple-250 flex items-center gap-1">
                          <span dir="ltr">{phr}</span>
                          <span className="text-slate-400 text-[9px]">{copiedIndex === `intro-o-${idx}` ? "✔" : "📋"}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* General Linking Words Panel */}
              <div className="bg-white/50 border border-slate-150 p-4 rounded-2xl space-y-3.5">
                <h4 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2 flex justify-between items-center" dir="ltr">
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">SECTION 2</span>
                  <span>5. General Linking & Contrasting Words</span>
                </h4>

                <div className="space-y-3 text-right text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-purple-800 block mb-1">■ Moreover / furthermore / besides this (= and):</span>
                    <p className="text-[10px] text-slate-500 mb-2 leading-relaxed">تُسخدم لإضافة فكرة جديدة داعمة لنفس السياق.</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-purple-800 block mb-1">■ therefore / thus / so / as a result (= result):</span>
                    <p className="text-[10px] text-slate-500 mb-2 leading-relaxed">للتعبيير عن النواتج والعواقب المترتبة على الفكرة.</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-purple-800 block mb-1">■ however / although / nevertheless / nonetheless / on the other hand / whereas (= but):</span>
                    <p className="text-[10px] text-slate-500 mb-2 leading-relaxed">لربط الأفكار المتناقضة وعرض وجهات النظر البديلة بموضوعية.</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-purple-800 block mb-1">■ despite / contrasting:</span>
                    <div className="flex gap-1.5 flex-wrap mt-1">
                      {["This can lead to", "On the other hand", "However", "While this may be true", "Nevertheless"].map((phr, idx) => (
                        <button key={idx} onClick={() => handleCopyText(phr, `link-c-${idx}`)} className="text-[10px] font-mono bg-slate-50 border border-slate-100 text-slate-705 px-2 py-0.5 rounded hover:border-purple-300">
                          <span dir="ltr">{phr}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Interactive Builder for Body Paragraph - 5 steps */}
            <div className="bg-gradient-to-br from-slate-50 to-purple-50/20 border border-slate-200/60 p-5 rounded-3xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-200/50 pb-2">
                <span className="text-[10px] bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full font-bold">INTERACTIVE DESK TOOL</span>
                <h4 className="text-xs font-bold text-slate-800">🛠️ تدريب بناء فقرة العرض المتكاملة (Practice Paragraph Builder - 5 Parts)</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-2" dir="rtl">
                {[
                  { step: 1, label: "Part 1: Topic Sentence", desc: "أدخل الفكرة كـ Firstly / Secondly" },
                  { step: 2, label: "Part 2: Explanation", desc: "أضف الشرح والتفسير بالتفصيل" },
                  { step: 3, label: "Part 3: Give Example", desc: "أضف مثالاً توضيحياً حياً" },
                  { step: 4, label: "Part 4: Support Opinion", desc: "أضف إحصائية داعمة (دراسة NYU)" },
                  { step: 5, label: "Part 5: Link / Finish", desc: "تأكيد النتيجة وصيغة الاستخلاص" }
                ].map((s) => (
                  <button
                    key={s.step}
                    onClick={() => setParagraphStep(s.step)}
                    className={`p-2.5 rounded-xl text-right border transition-all ${
                      paragraphStep === s.step
                        ? "bg-purple-600 text-white border-purple-500 shadow-sm"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span className="text-[10px] font-bold block">الخطوة {s.step}</span>
                    <span className="text-[11px] font-bold block mt-0.5">{s.label}</span>
                  </button>
                ))}
              </div>

              {/* Step workspace UI */}
              <div className="bg-white border border-slate-150 p-4 rounded-2xl text-right text-xs space-y-3">
                {paragraphStep === 1 && (
                  <div className="space-y-2 animate-fade-in">
                    <p className="font-semibold text-purple-800">Part 1: Topic Sentence (أول جملة بالفكرة)</p>
                    <p className="text-slate-500 text-[11px]">ابدأ فقرتك برابط تسلسلي يعبر بوضوح عن الفكرة الرئيسية الأولى أو الثانية:</p>
                    <div className="flex gap-2.5 flex-wrap pt-1">
                      {["Firstly", "First of all", "Secondly", "In addition"].map((word, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setBuiltParagraph({ ...builtParagraph, part1: word + "..." });
                            handleCopyText(word, `pstep1-${idx}`);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-dashed border-purple-300 bg-purple-50/55 hover:bg-purple-100 font-mono font-bold text-[11px] text-purple-900"
                        >
                          {word}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {paragraphStep === 2 && (
                  <div className="space-y-2 animate-fade-in">
                    <p className="font-semibold text-purple-800">Part 2: Add an Explanation (شروحات الفكرة وتفسيرها)</p>
                    <p className="text-slate-500 text-[11px]">أضف تعليلاً وشرحاً متطوراً لتفكيك وجهة النظر وجعلها معقولة:</p>
                    <div className="flex gap-2.5 flex-wrap pt-1">
                      {["It helps people...", "In fact...", "What I mean...", "Moreover..."].map((word, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setBuiltParagraph({ ...builtParagraph, part2: word });
                            handleCopyText(word, `pstep2-${idx}`);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-dashed border-purple-300 bg-purple-50/55 hover:bg-purple-100 font-mono font-bold text-[11px] text-purple-900"
                        >
                          {word}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {paragraphStep === 3 && (
                  <div className="space-y-2 animate-fade-in">
                    <p className="font-semibold text-purple-800">Part 3: Give an Example (إعطاء مثال ملموس وحي)</p>
                    <p className="text-slate-500 text-[11px]">احرص على ضرب أمثلة من الحياة اليومية أو سياق المجتمع لدعم طريقتك التفسيرية:</p>
                    <div className="flex gap-2.5 flex-wrap pt-1">
                      {["For instance...", "To illustrate...", "Let's take this situation...", "Furthermore..."].map((word, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setBuiltParagraph({ ...builtParagraph, part3: word });
                            handleCopyText(word, `pstep3-${idx}`);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-dashed border-purple-300 bg-purple-50/55 hover:bg-purple-100 font-mono font-bold text-[11px] text-purple-900 cursor-pointer"
                        >
                          {word}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {paragraphStep === 4 && (
                  <div className="space-y-2 animate-fade-in">
                    <p className="font-semibold text-purple-800">Part 4: Support your opinion with academic study (البراهين من دراسات رسمية)</p>
                    <p className="text-slate-500 text-[11px]">يعشق المصححون الاستشهاد بالدراسات والتقارير الجامعية الأكاديمية لجعل الورقة ثقيلة وعالية التقييم:</p>
                    <div className="pt-1">
                      <button
                        onClick={() => {
                          const str = "a study published by New York University in 2020 concluded that ..% of ...";
                          setBuiltParagraph({ ...builtParagraph, part4: str });
                          handleCopyText(str, "pstep4-nyu");
                        }}
                        className="px-3 py-2 rounded-xl border border-purple-500 bg-purple-50 font-mono font-bold text-[11px] text-purple-950 flex items-center gap-2 text-right cursor-pointer"
                      >
                        <span>انسخ قالب دراسة NYU المعياري:</span>
                        <span className="underline block" dir="ltr">"a study published by New York University in 2020 concluded that ..% of..."</span>
                      </button>
                    </div>
                  </div>
                )}

                {paragraphStep === 5 && (
                  <div className="space-y-2 animate-fade-in">
                    <p className="font-semibold text-purple-800">Part 5: Link / Finish / Conclusion (ربط الفقرة وتلخيصها ومقدمة الختام)</p>
                    <p className="text-slate-500 text-[11px]">أنهِ الفقرة بصياغة تبرز الاستنتاج لتنهي مقالك، أو جملة Conclusion ختامية:</p>
                    <div className="flex gap-2.5 flex-wrap pt-1">
                      {["Therefore...", "As a result...", "This shows that...", "Thus...", "To conclude, In my view... restate the two reasons"].map((word, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setBuiltParagraph({ ...builtParagraph, part5: word });
                            handleCopyText(word, `pstep5-${idx}`);
                          }}
                          className="px-3 py-1.5 rounded-xl border border-dashed border-purple-300 bg-purple-50/55 hover:bg-purple-100 font-mono font-bold text-[11px] text-purple-900 cursor-pointer"
                        >
                          {word}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Simulated built paragraph view */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 mt-4 text-right">
                  <span className="text-[10px] bg-slate-200 text-slate-500 px-2 py-0.5 rounded-md font-bold block mb-2 w-max">مخطط وبنية الفقرة المجمعة:</span>
                  <p className="font-mono text-xs text-slate-700 bg-white p-2.5 rounded border border-slate-100 leading-relaxed text-left" dir="ltr">
                    {builtParagraph.part1 || "Firstly..."} [Explanation: {builtParagraph.part2 || "..."}] [Example: {builtParagraph.part3 || "..."}] [NYU Support: {builtParagraph.part4 || "..."}] [Conclusion Link: {builtParagraph.part5 || "..."}]
                  </p>
                  <button
                    onClick={() => {
                      const fullF = `${builtParagraph.part1 || "Firstly,"} [Explanation: ${builtParagraph.part2}] [Example: ${builtParagraph.part3}] [Support: ${builtParagraph.part4}] [Link: ${builtParagraph.part5}]`;
                      handleCopyText(fullF, "copied-built-full");
                    }}
                    className="mt-2 text-[10px] bg-purple-600 hover:bg-purple-700 text-white font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 mr-auto cursor-pointer"
                  >
                    <span>{copiedIndex === "copied-built-full" ? "✔ تم النسخ!" : "نسخ هيكل الفقرة بالكامل لاستخدامه"}</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* 4. Official Writing Preparation & Correction Tools Section */}
      <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-6">
        <h3 className="font-extrabold text-slate-800 dark:text-slate-100 text-xs mb-4 text-right flex items-center justify-end gap-1.5">
          <span>أدوات تصحيح وتدقيق الكتابة الخارجية المعتمدة</span>
          <Award className="h-4.5 w-4.5 text-purple-600" />
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Cathoven */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl flex flex-col justify-between h-40 hover:-translate-y-1 hover:shadow-lg transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-550/5 to-purple-550/5 rounded-full blur-2xl pointer-events-none"></div>
            <div>
              <div className="flex justify-between items-start mb-2 flex-row-reverse">
                <span className="font-black text-xs text-slate-850 dark:text-white">Cathoven</span>
                <span className="text-[9px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 px-1.5 py-0.5 rounded font-black">تحليل المقالات</span>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 text-right leading-relaxed mt-1" dir="rtl">
                صياغة نقدية للكتلة المقالية وتحليل ترابط الجمل والثراء النحوي للفقرات بالذكاء الاصطناعي.
              </p>
            </div>
            <a
              href="https://www.cathoven.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 bg-slate-50 dark:bg-slate-850 hover:bg-purple-600 hover:text-white dark:text-slate-200 text-slate-700 font-bold text-[10px] py-1.5 rounded-xl flex items-center justify-center gap-1 transition-all"
            >
              <span>فتح الموقع</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Engnovate Writing */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl flex flex-col justify-between h-40 hover:-translate-y-1 hover:shadow-lg transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-550/5 to-pink-550/5 rounded-full blur-2xl pointer-events-none"></div>
            <div>
              <div className="flex justify-between items-start mb-2 flex-row-reverse">
                <span className="font-black text-xs text-slate-850 dark:text-white">Engnovate</span>
                <span className="text-[9px] bg-purple-50 dark:bg-purple-955/20 text-purple-700 dark:text-purple-400 px-1.5 py-0.5 rounded font-black">تحسين الصياغة</span>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 text-right leading-relaxed mt-1" dir="rtl">
                دروس ذكية وهياكل معتمدة لبناء فقرات نموذجية قوية، وزيادة ترابط النص ومفردات المقال.
              </p>
            </div>
            <a
              href="https://engnovate.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 bg-slate-50 dark:bg-slate-850 hover:bg-purple-600 hover:text-white dark:text-slate-200 text-slate-700 font-bold text-[10px] py-1.5 rounded-xl flex items-center justify-center gap-1 transition-all"
            >
              <span>افتح الموقع لتعلم الصياغة</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Advantages – 1000 Speaking Questions */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl flex flex-col justify-between h-40 hover:-translate-y-1 hover:shadow-lg transition-all relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-555/5 to-indigo-555/5 rounded-full blur-2xl pointer-events-none"></div>
            <div>
              <div className="flex justify-between items-start mb-2 flex-row-reverse">
                <span className="font-black text-xs text-slate-850 dark:text-white">IELTS Advantages</span>
                <span className="text-[9px] bg-purple-55 dark:bg-purple-950/40 text-purple-700 dark:text-purple-305 px-1.5 py-0.5 rounded font-black">أدلة ومواضيع</span>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 text-right leading-relaxed mt-1" dir="rtl">
                الحصول على الأسئلة الحية من لجان تفكيك الفكر ومهارات الاستجابة وحلول المقالات الفائقة.
              </p>
            </div>
            <a
              href="https://ieltsadvantage.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 bg-slate-50 dark:bg-slate-850 hover:bg-purple-600 hover:text-white dark:text-slate-200 text-slate-700 font-bold text-[10px] py-1.5 rounded-xl flex items-center justify-center gap-1 transition-all"
            >
              <span>فتح الموقع المعتمد</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

        </div>
      </div>

    </div>
  );
}

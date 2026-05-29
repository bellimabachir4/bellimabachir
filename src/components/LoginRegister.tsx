import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { 
  Mail, 
  Lock, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  BookOpen, 
  ShieldCheck, 
  ArrowRight,
  Eye,
  EyeOff,
  Globe,
  KeyRound
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function LoginRegister() {
  const { 
    login, 
    register, 
    loginWithGoogle, 
    loginWithFacebook, 
    loginWithApple, 
    loginAsGuest, 
    sendPasswordReset 
  } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [showForgot, setShowForgot] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false); // Controls modern email form drawer

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [forgotEmail, setForgotEmail] = useState("");

  // UI status
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Password assessment
  const calculatePasswordStrength = (pwd: string) => {
    let score = 0;
    if (!pwd) return { label: "فارغ", score: 0, color: "bg-slate-200 dark:bg-slate-800" };
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score < 2) return { label: "ضعيف جداً ❌", score, color: "bg-red-500" };
    if (score < 4) return { label: "متوسط ⚡", score, color: "bg-orange-400" };
    return { label: "قوي وآمن جداً ممتاز 💪✨", score, color: "bg-emerald-500" };
  };

  const strength = calculatePasswordStrength(password);

  const requirements = [
    { label: "6 خانات على الأقل", met: password.length >= 6 },
    { label: "حرف كبير واحد على الأقل (A-Z)", met: /[A-Z]/.test(password) },
    { label: "رمز خاص واحد على الأقل (مثل @, #, $)", met: /[^A-Za-z0-9]/.test(password) },
    { label: "رقم واحد على الأقل (0-9)", met: /[0-9]/.test(password) },
  ];

  const isValidEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim() || !password) {
      setError("الرجاء ملء كافة حقول البريد وكلمة المرور.");
      return;
    }

    if (!isValidEmail(email)) {
      setError("صيغة البريد الإلكتروني المدخلة غير صحيحة.");
      return;
    }

    setLoading(true);
    try {
      await login(email, password, rememberMe);
      setSuccess("تم تسجيل الدخول بنجاح! جاري تحويلك...");
    } catch (err: any) {
      setError(err.message || "فشل تسجيل الدخول. هل الحساب صحيح؟");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setError("الرجاء تعبئة كافة الحقول المطلوبة للتسجيل.");
      return;
    }

    if (fullName.trim().length < 3) {
      setError("الرجاء كتابة اسم كامل ثنائي على الأقل (3 أحرف فأكثر).");
      return;
    }

    if (!isValidEmail(email)) {
      setError("البريد الإلكتروني المدخل غير صحيح.");
      return;
    }

    if (password.length < 6) {
      setError("يجب ألا تقل كلمة المرور الخاصة بك عن 6 خانات.");
      return;
    }

    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين، الرجاء التحقق والمطابقة.");
      return;
    }

    setLoading(true);
    try {
      await register(fullName, email, password);
      setSuccess("🎉 تم تسجيل حسابك بنجاح! جاري الانتقال للوحة التحكم ومزامنة ملفك الدراسي...");
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء التسجيل، ربما البريد مستخدم بالفعل.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!forgotEmail.trim() || !isValidEmail(forgotEmail)) {
      setError("الرجاء إدخال بريد إلكتروني صحيح لإرسال تلميح استعادة المرور.");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordReset(forgotEmail);
      setSuccess("📧 تم إرسال رابط استعادة تعيين الرمز السري بنجاح! تفقد بريدك الوارد.");
      setTimeout(() => {
        setShowForgot(false);
        setSuccess("");
      }, 5000);
    } catch (err: any) {
      setError(err.message || "فشل إرسال بريد استعادة كلمة المرور، يرجى إعادة المحاولة.");
    } finally {
      setLoading(false);
    }
  };

  const executeGoogleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const executeFacebookLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithFacebook();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const executeAppleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await loginWithApple();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const executeGuestLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await loginAsGuest();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans transition-colors duration-300">
      {/* Background radial glowing gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[35rem] h-[35rem] rounded-full bg-purple-400/10 dark:bg-purple-900/15 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[35rem] h-[35rem] rounded-full bg-emerald-400/10 dark:bg-emerald-900/15 blur-[130px] pointer-events-none"></div>

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden relative z-10 transition-all duration-350">
        
        {/* Left Column: Welcome Banner & Stats Preview */}
        <div className="lg:col-span-5 bg-gradient-to-tr from-purple-800 via-indigo-905 to-slate-900 p-8 text-white flex flex-col justify-between items-center text-center relative min-h-[300px] lg:min-h-[600px]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-500/15 via-transparent to-transparent pointer-events-none"></div>
          
          {/* Logo Frame */}
          <div className="flex flex-col items-center gap-2 mt-4 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white text-indigo-950 flex items-center justify-center font-black text-2xl tracking-tighter shadow-xl">
              IELTS
            </div>
            <h1 className="text-xl font-bold tracking-tight mt-3">منصة التدريب الذكي لاختبار الآيلتس</h1>
            <p className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full font-bold mt-1">
              مصحح ومقيّم فوري بالذكاء الاصطناعي 🤖
            </p>
          </div>

          {/* Presentation of value propositions */}
          <div className="my-8 space-y-4 max-w-sm text-right relative z-10 w-full">
            <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/5 backdrop-blur-md">
              <div className="p-2.5 bg-indigo-500/20 rounded-xl text-purple-300">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">بيئة عمل آمنة ومزامنة سحابية</h4>
                <p className="text-[10px] text-slate-300 mt-0.5 leading-relaxed">يرتبط حسابك الدراسي تلقائياً بـ Firebase لحفظ نتائج تمارين القراءة، السمع، والمحادثة.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/5 backdrop-blur-md">
              <div className="p-2.5 bg-indigo-500/20 rounded-xl text-emerald-300">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">متابعة دقيقة لمستويات الكلمات</h4>
                <p className="text-[10px] text-slate-300 mt-0.5 leading-relaxed">تقصّى تقدمك الفعلي في المفردات وحقّق هدفك الأسبوعي بلمسة زر واحدة متينة.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/5 backdrop-blur-md">
              <div className="p-2.5 bg-indigo-500/20 rounded-xl text-amber-300">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">الاستعداد تحت أي ظرف وسرعة فائقة</h4>
                <p className="text-[10px] text-slate-300 mt-0.5 leading-relaxed">صُممت المنصة لتُلائم شاشتك على الهاتف والكمبيوتر ومن أي متصفح (Chrome, Safari).</p>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 font-mono relative z-10">
            IELTS Academy • Secure Session 2026
          </div>
        </div>

        {/* Right Column: Interaction Authentication Forms */}
        <div className="lg:col-span-12 xl:col-span-7 p-6 sm:p-10 flex flex-col justify-center text-right dark:bg-slate-900/90">
          
          <AnimatePresence mode="wait">
            {showForgot ? (
              // FORGOT PASSWORD TAB
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <button 
                  onClick={() => { setShowForgot(false); setError(""); setSuccess(""); }}
                  className="mb-6 flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-bold ml-auto transition-all cursor-pointer"
                >
                  <span>العودة لصفحة تسجيل الدخول</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <h2 className="text-xl font-black text-slate-900 dark:text-white">هل نسيت الرمز السري؟ 🔒</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 mb-6 leading-relaxed">
                  فقط اكتب بريدك الإلكتروني هنا وسنقوم بمراجعة البيانات وتزويدك بـرابط آمن ومباشر لإعادة تعيين كلمة مرورك فوراً.
                </p>

                {error && (
                  <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-xs px-4 py-3 rounded-xl mb-4.5 flex items-start gap-2.5">
                    <AlertCircle className="h-4.5 w-4.5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                    <span className="leading-relaxed">{error}</span>
                  </div>
                )}
                {success && (
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-400 text-xs px-4 py-3 rounded-xl mb-4.5 flex items-start gap-2.5">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-450 mt-0.5 shrink-0" />
                    <span>{success}</span>
                  </div>
                )}

                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">البريد الإلكتروني للتعافي:</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="example@mail.com"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs text-left text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-950 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-sm cursor-pointer"
                  >
                    {loading ? "جاري المعالجة..." : "إرسال رابط استعادة الرمز السري ✉️"}
                  </button>
                </form>
              </motion.div>
            ) : (
              // DUAL TAB LOGIN / REGISTER
              <motion.div
                key={isLogin ? "login" : "register"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {/* Header Switch Toggles */}
                <div className="flex justify-center p-1 bg-slate-100 dark:bg-slate-950 rounded-xl mb-6 max-w-xs mx-auto border border-slate-200/50 dark:border-slate-850">
                  <button
                    onClick={() => { setIsLogin(false); setError(""); setSuccess(""); }}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${!isLogin ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"}`}
                  >
                    إنشاء حساب جديد
                  </button>
                  <button
                    onClick={() => { setIsLogin(true); setError(""); setSuccess(""); }}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${isLogin ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300"}`}
                  >
                    تسجيل الدخول
                  </button>
                </div>

                <div className="mb-6">
                  <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center justify-end gap-1.5">
                    <span>{isLogin ? "مرحباً بك في لوحة آيلتس الذكية 👋" : "تجهيز حساب طالب آيلتس متميز 🎓"}</span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-450 mt-1 leading-relaxed">
                    {isLogin ? "سجّل دخولك فوراً للمطالبة بملفك الأكاديمي، واكتشاف سر المراجعة الصوتية والكتب الفورية." : "احصل على وصول كامل ومجاني بنسبة 100% لمصادر المحادثة والكلمات تحت مظلة آمنة."}
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 text-xs px-4 py-3.5 rounded-xl mb-5 flex items-start gap-2.5">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
                    <div className="space-y-1">
                      <p className="font-bold">خطأ في المصادقة:</p>
                      <p className="leading-relaxed text-[11px]">{error}</p>
                    </div>
                  </div>
                )}
                {success && (
                  <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-450 text-xs px-4 py-3 rounded-xl mb-5 flex items-start gap-2.5">
                    <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                    <span className="leading-relaxed">{success}</span>
                  </div>
                )}

                {/* SOCIAL SINGLE-SIGN ON (SSO) BUTTONS BLOCK */}
                <div className="space-y-3 mb-6">
                  
                  {/* Google SSO */}
                  <button
                    onClick={executeGoogleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-between py-3 px-4 bg-white hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 transition-all shadow-xs cursor-pointer group hover:-translate-y-0.5"
                  >
                    <svg className="h-4.5 w-4.5 group-hover:scale-105 transition-transform shrink-0" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                    <span className="text-right">Continue with Google (حساب جوجل)</span>
                    <span className="text-[9px] font-mono text-slate-450 dark:text-slate-500">SSO SECURE</span>
                  </button>

                  {/* Facebook SSO */}
                  <button
                    onClick={executeFacebookLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-between py-3 px-4 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 border border-[#1877F2]/20 dark:border-[#1877F2]/30 rounded-xl text-xs font-bold text-[#1877F2] dark:text-[#5890ff] transition-all cursor-pointer group hover:-translate-y-0.5"
                  >
                    <svg className="h-4.5 w-4.5 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span className="text-right">Continue with Facebook (حساب فيسبوك)</span>
                    <span className="text-[9px] font-mono text-blue-500/60">SSO SECURE</span>
                  </button>

                  {/* Apple SSO */}
                  <button
                    onClick={executeAppleLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-between py-3 px-4 bg-slate-950 hover:bg-slate-900 border border-slate-900 rounded-xl text-xs font-bold text-white transition-all cursor-pointer group hover:-translate-y-0.5 shadow-sm"
                  >
                    <svg className="h-4.5 w-4.5 fill-current shrink-0" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.58 2.95-1.39z"/>
                    </svg>
                    <span className="text-right">Continue with Apple (حساب آبل)</span>
                    <span className="text-[9px] font-mono text-slate-300">SSO SECURE</span>
                  </button>

                  {/* Continue with Email Trigger Selector */}
                  {!showEmailForm && (
                    <button
                      onClick={() => setShowEmailForm(true)}
                      className="w-full flex items-center justify-between py-3 px-4 bg-purple-50 hover:bg-purple-100/70 dark:bg-purple-950/20 dark:hover:bg-purple-950/40 border border-purple-200/60 dark:border-purple-900 rounded-xl text-xs font-bold text-purple-700 dark:text-purple-300 transition-all cursor-pointer hover:shadow-xs"
                    >
                      <Mail className="h-4.5 w-4.5 text-purple-500 shrink-0" />
                      <span>Continue with Email (سجل بالبريد الإلكتروني)</span>
                      <span className="text-[9px] bg-purple-100 dark:bg-purple-950 px-2 py-0.5 rounded text-purple-600 dark:text-purple-400 font-bold">نموذج</span>
                    </button>
                  )}

                </div>

                {/* EXPANDABLE EMAIL-PASSWORD FORM DRAWER */}
                <AnimatePresence>
                  {showEmailForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden mb-6"
                      transition={{ duration: 0.3 }}
                    >
                      <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-150 dark:border-slate-850 space-y-4">
                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => setShowEmailForm(false)}
                            className="text-[10px] bg-slate-200 dark:bg-slate-900 px-2.5 py-1 rounded-lg text-slate-600 dark:text-slate-400 font-semibold cursor-pointer"
                          >
                            إخفاء النموذج ×
                          </button>
                          <span className="text-xs font-black text-slate-700 dark:text-slate-350 flex items-center gap-1">
                            <span>صندوق التسجيل بالبريد والرمز</span>
                            <KeyRound className="h-3.5 w-3.5 text-purple-500" />
                          </span>
                        </div>

                        {isLogin ? (
                          // EMAIL LOGIN INNER FORM
                          <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">البريد الإلكتروني:</label>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <input
                                  type="email"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  placeholder="student@example.com"
                                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-xs text-left text-slate-800 dark:text-white"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <div className="flex justify-between items-center px-0.5">
                                <button 
                                  type="button"
                                  onClick={() => setShowForgot(true)}
                                  className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
                                >
                                  استعادة كلمة المرور؟
                                </button>
                                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">رمز المرور المختار:</label>
                              </div>
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute left-3 top-3 text-slate-400 hover:text-slate-650"
                                >
                                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                                <input
                                  type={showPassword ? "text" : "password"}
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  placeholder="••••••••"
                                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-xs text-left text-slate-800 dark:text-white font-mono"
                                />
                              </div>
                            </div>

                            <div className="flex items-center justify-between px-0.5">
                              <label className="flex items-center gap-1.5 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={rememberMe}
                                  onChange={(e) => setRememberMe(e.target.checked)}
                                  className="rounded text-purple-600 border-slate-300 focus:ring-purple-500 h-3.5 w-3.5"
                                />
                                <span className="text-[11px] text-slate-500 dark:text-slate-400 select-none">تذكر بقاء دخولي آلياً</span>
                              </label>
                            </div>

                            <button
                              type="submit"
                              disabled={loading}
                              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                            >
                              {loading ? "جاري الدخول والمزامنة السحابية..." : "تسجيل الدخول الآمن بالمركب 🚀"}
                            </button>
                          </form>
                        ) : (
                          // EMAIL REGISTER INNER FORM
                          <form onSubmit={handleRegisterSubmit} className="space-y-3">
                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">الاسم الكامل لملف الشهادة:</label>
                              <div className="relative">
                                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <input
                                  type="text"
                                  value={fullName}
                                  onChange={(e) => setFullName(e.target.value)}
                                  placeholder="مثال: يوسف الكندري"
                                  className="w-full pr-4 pl-10 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-xs text-right text-slate-800 dark:text-white"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">البريد الإلكتروني المعتمد:</label>
                              <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                <input
                                  type="email"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  placeholder="student@example.com"
                                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-xs text-left text-slate-800 dark:text-white"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">رمز المرور القوي:</label>
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="absolute left-3 top-3 text-slate-400 hover:text-slate-650"
                                >
                                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                                <input
                                  type={showPassword ? "text" : "password"}
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  placeholder="••••••••"
                                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-xs text-left text-slate-800 dark:text-white font-mono"
                                />
                              </div>

                              {/* Password live strength indicator */}
                              {password && (
                                <div className="mt-2 p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800/80 text-right space-y-1.5">
                                  <p className="text-[9px] font-bold text-slate-500">متطلبات وصحة الرمز:</p>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 bg-slate-50 dark:bg-slate-950 p-2 rounded-lg">
                                    {requirements.map((req, idx) => (
                                      <div key={idx} className="flex items-center justify-end gap-1.5">
                                        <span className={`text-[9px] ${req.met ? "text-emerald-600 font-bold" : "text-slate-400"}`}>
                                          {req.label}
                                        </span>
                                        {req.met ? (
                                          <span className="text-emerald-500 text-[9px] font-black">✓</span>
                                        ) : (
                                          <span className="text-slate-300 text-[9px]">•</span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                  <div className="flex justify-between items-center text-[9px] pt-1">
                                    <span className="font-bold text-slate-600 dark:text-slate-400">{strength.label}</span>
                                    <span className="text-slate-400">مقياس أمان الرمز:</span>
                                  </div>
                                  <div className="h-1 bg-slate-200 dark:bg-slate-850 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full ${strength.color} transition-all duration-300`}
                                      style={{ width: `${Math.min(100, (strength.score / 5) * 100)}%` }}
                                    ></div>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">تأكيد رمز المرور:</label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                                <input
                                  type="password"
                                  value={confirmPassword}
                                  onChange={(e) => setConfirmPassword(e.target.value)}
                                  placeholder="••••••••"
                                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 text-xs text-left text-slate-800 dark:text-white font-mono"
                                />
                              </div>
                            </div>

                            <button
                              type="submit"
                              disabled={loading}
                              className="w-full bg-indigo-650 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
                            >
                              {loading ? "جاري البناء والمزامنة..." : "إنشاء الحساب ومزامنة الملف سحابياً 🎉"}
                            </button>
                          </form>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px]">
                    <span className="px-3 bg-white dark:bg-slate-900 text-slate-450 dark:text-slate-500">أو تصفح بشكل سريع</span>
                  </div>
                </div>

                {/* Secure Guest Access and Platform Notes */}
                <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                  <span className="text-[9px] text-slate-450 dark:text-slate-500 text-center sm:text-right leading-relaxed">
                    🎓 يتم حفظ البيانات محلياً على جهازك في حال الدخول السريع حتى تقرر تسجيل حساب دائم.
                  </span>

                  <button
                    onClick={executeGuestLogin}
                    disabled={loading}
                    className="w-full sm:w-auto flex items-center justify-center gap-1 py-2 px-4 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs font-black transition-colors shrink-0 cursor-pointer"
                  >
                    <BookOpen className="h-4 w-4 shrink-0" />
                    <span>تخطي ودخول سريع ⚡</span>
                  </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </div>
  );
}

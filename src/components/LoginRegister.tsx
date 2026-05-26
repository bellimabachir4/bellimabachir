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
  EyeOff
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function LoginRegister() {
  const { login, register, loginWithGoogle, loginAsGuest, sendPasswordReset } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showForgot, setShowForgot] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [forgotEmail, setForgotEmail] = useState("");

  // UI state
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Password strength calculation
  const calculatePasswordStrength = (password: string) => {
    let score = 0;
    if (!password) return { label: "فارغ", score: 0, color: "bg-slate-200" };
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

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

  // Validate Email
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
      setSuccess("🎉 تم تسجيل حسابك وإرسال بريد التفعيل بنجاح! جاري الانتقال للوحة التحكم...");
    } catch (err: any) {
      setError(err.message || "حدث خطأ أثناء التسجيل، ربما البريد مستخدم.");
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
      setSuccess("📧 تم إرسال رابط استعادة تعيين الرمز السري بنجاح! تفقد بريدك الوارد وصندوق الرسائل غير المرغوبة (Spams).");
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

  return (
    <div className="min-h-screen bg-slate-50/60 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Dynamic Background Glowing Circles */}
      <div className="absolute top-[-10%] right-[-10%] w-[35rem] h-[35rem] rounded-full bg-purple-300/25 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[35rem] h-[35rem] rounded-full bg-indigo-300/35 blur-[130px] pointer-events-none"></div>

      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/40 shadow-2xl shadow-slate-200/50 overflow-hidden relative z-10">
        
        {/* Left Aspect: Brand Welcome Hero Intro */}
        <div className="lg:col-span-5 bg-gradient-to-tr from-purple-700 via-indigo-805 to-slate-900 p-8 text-white flex flex-col justify-between items-center text-center relative min-h-[300px] lg:min-h-[580px]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none"></div>
          
          {/* Logo */}
          <div className="flex flex-col items-center gap-2 mt-4">
            <div className="w-14 h-14 rounded-2xl bg-white text-indigo-900 flex items-center justify-center font-black text-xl tracking-tighter shadow-xl">
              IELTS
            </div>
            <h1 className="text-xl font-bold tracking-tight mt-2">منصة التدريب التفاعلي للآيلتس</h1>
            <p className="text-[10px] bg-white/10 text-purple-200 px-2 py-0.5 rounded-full font-bold">
              مصحح ذكي بأحدث تقنيات Gemini 🤖
            </p>
          </div>

          {/* Core App value slider presentation */}
          <div className="my-8 space-y-4 max-w-sm text-right">
            <div className="flex items-start gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
              <div className="p-1.5 bg-indigo-505/20 rounded-xl text-purple-300">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">تقييم نبرات التحدث الفوري</h4>
                <p className="text-[10px] text-slate-300 mt-0.5">حلل نبرتك اللغوية ونطقك وحصل نتائج تفصيلية بالبند على الفور.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
              <div className="p-1.5 bg-indigo-505/20 rounded-xl text-emerald-300">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">منصة مفردات أكاديمية متكاملة</h4>
                <p className="text-[10px] text-slate-300 mt-0.5">افتح فلاش كاردز تدريبية واختبر قوتك ومستواك في مختلف بنود الكلمات.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
              <div className="p-1.5 bg-indigo-505/20 rounded-xl text-amber-300">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">متابعة الأيام والأهداف الذاتية</h4>
                <p className="text-[10px] text-slate-300 mt-0.5">احفظ إحصائياتك من استماع وقراءة، وتفرغ لمنافسة جدولك الأسبوعي.</p>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 font-mono">
            آيلتس دوت كوم • نسخة آمنة 2026
          </div>
        </div>

        {/* Right Aspect: Interactive Authenticity Forms */}
        <div className="lg:col-span-12 xl:col-span-7 p-6 sm:p-10 flex flex-col justify-center text-right">
          
          <AnimatePresence mode="wait">
            {showForgot ? (
              // Forgot Password Tab
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <button 
                  onClick={() => { setShowForgot(false); setError(""); setSuccess(""); }}
                  className="mb-6 flex items-center gap-1.5 text-xs text-indigo-650 hover:text-indigo-800 font-bold ml-auto transition-colors"
                >
                  <span>العودة لصفحة تسجيل الدخول</span>
                  <ArrowRight className="h-3 w-3" />
                </button>

                <h2 className="text-xl font-bold text-slate-900">هل نسيت الرمز السري؟ 🔒</h2>
                <p className="text-xs text-slate-500 mt-1 mb-6">
                  لا تقلق، فقط سجل بريدك الإلكتروني وسيتم تزويدك بارشادات بسيطة لاسترجاع حسابك.
                </p>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-2.5 rounded-xl mb-4 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-650" />
                    <span>{error}</span>
                  </div>
                )}
                {success && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-2.5 rounded-xl mb-4 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>{success}</span>
                  </div>
                )}

                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">البريد الإلكتروني للتعافي:</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type="email"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="example@mail.com"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs text-left"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-sm"
                  >
                    {loading ? "جاري الإرسال ومراجعة البريد..." : "إرسال رابط تهيئة الرمز الفوري ✉️"}
                  </button>
                </form>
              </motion.div>
            ) : (
              // Login / Register Tabs
              <motion.div
                key={isLogin ? "login" : "register"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {/* Header Switch Toggles */}
                <div className="flex justify-center p-1 bg-slate-100 rounded-xl mb-6 max-w-xs mx-auto">
                  <button
                    onClick={() => { setIsLogin(false); setError(""); setSuccess(""); }}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${!isLogin ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                  >
                    إنشاء حساب جديد
                  </button>
                  <button
                    onClick={() => { setIsLogin(true); setError(""); setSuccess(""); }}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${isLogin ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}
                  >
                    تسجيل الدخول
                  </button>
                </div>

                <div className="mb-4">
                  <h2 className="text-lg font-black text-slate-800">
                    {isLogin ? "أهلاً بك مجدداً في نظام الآيلتس! 👋" : "تجهيز حساب طالب آيلتس متميز 🎓"}
                  </h2>
                  <p className="text-[11px] text-slate-550 mt-0.5">
                    {isLogin ? "سجل معلوماتك المعتمدة لتكمل استعدادك ومراجعة إحصائياتك اللغوية." : "احصل على وصول آمن وسلس لخطتك وإنجاز الكلمات والتقييم الفوري."}
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-2.5 rounded-xl mb-4 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-red-650" />
                    <span>{error}</span>
                  </div>
                )}
                {success && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-2.5 rounded-xl mb-4 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>{success}</span>
                  </div>
                )}

                {isLogin ? (
                  // LOGIN FORM
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">البريد الإلكتروني:</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="example@mail.com"
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs text-left"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center sm:px-1">
                        <button 
                          type="button"
                          onClick={() => setShowForgot(true)}
                          className="text-[11.5px] text-indigo-650 hover:underline font-bold"
                        >
                          نسيت الرمز؟
                        </button>
                        <label className="text-xs font-semibold text-slate-700">كلمة المرور:</label>
                      </div>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                        >
                          {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                        </button>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          id="login-password-input"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs text-left font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between px-1">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded text-indigo-650 border-slate-300 focus:ring-indigo-500 h-4 w-4"
                        />
                        <span className="text-xs text-slate-550">تذكر تسجيل دخولي لاحقاً</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-md shadow-indigo-500/10"
                    >
                      {loading ? "جاري الدخول ومراجعة الحساب..." : "تسجيل الدخول الآمن 🚀"}
                    </button>
                  </form>
                ) : (
                  // REGISTER FORM
                  <form onSubmit={handleRegisterSubmit} className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">الاسم الكامل:</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="أحمد الفارسي"
                          className="w-full pr-4 pl-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs text-right"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">البريد الإلكتروني:</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="example@mail.com"
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs text-left"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">كلمة المرور:</label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-3 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
                        >
                          {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                        </button>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          id="register-password-input"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs text-left font-mono"
                        />
                      </div>

                      {/* Password requirements live checklist */}
                      {password && (
                        <div className="mt-2 p-2.5 bg-slate-50 rounded-xl border border-slate-100/80 text-right space-y-1.5 animate-fadeIn" id="password-requirements-checklist-container">
                          <p className="text-[10px] font-bold text-slate-600">شروط وصلاحية كلمة المرور:</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5" id="password-checklist-grid-element">
                            {requirements.map((req, idx) => (
                              <div key={idx} className="flex items-center justify-end gap-1.5" id={`password-req-row-idx-${idx}`}>
                                <span className={`text-[10px] select-none ${req.met ? "text-emerald-700 font-medium" : "text-slate-400"}`}>
                                  {req.label}
                                </span>
                                {req.met ? (
                                  <span className="text-emerald-500 text-[10px] font-bold" id={`req-met-check-${idx}`}>✓</span>
                                ) : (
                                  <span className="text-slate-300 text-[10px]" id={`req-unmet-dot-${idx}`}>•</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Password strength meter implementation */}
                      {password && (
                        <div className="mt-2 p-1.5 bg-slate-50 rounded-lg border border-slate-100">
                          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                            <span>{strength.label}</span>
                            <span>أمان المفتاح:</span>
                          </div>
                          <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${strength.color} transition-all duration-300`}
                              style={{ width: `${Math.min(100, (strength.score / 5) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700">تأكيد كلمة المرور:</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs text-left font-mono"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-md"
                    >
                      {loading ? "جاري تعميد الحساب والمزامنة..." : "إنشاء حساب الطالب والبدء 🎉"}
                    </button>
                  </form>
                )}

                {/* Third-party divider login supports */}
                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-white text-slate-400">أو يمكنك الدخول السريع عبر</span>
                  </div>
                </div>

                {/* Google Sign In & Guest Login Button row */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => loginWithGoogle()}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-250 rounded-xl text-xs font-bold text-slate-600 transition-colors shadow-sm"
                  >
                    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                    </svg>
                    <span>حساب Google</span>
                  </button>

                  <button
                    onClick={() => loginAsGuest()}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 bg-purple-50 hover:bg-purple-100/85 border border-purple-150 rounded-xl text-xs font-bold text-purple-700 transition-colors shadow-sm"
                  >
                    <BookOpen className="h-4 w-4 shrink-0 text-purple-500" />
                    <span>دخول كزائر سريع ⚡</span>
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

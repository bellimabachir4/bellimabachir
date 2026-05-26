import React, { useState, useEffect } from "react";
import { Plus, Trash2, CheckCircle2, Circle, ArrowLeftRight, Clock, Save, RefreshCw } from "lucide-react";
import { DayPlan, StudyTask } from "../types";

const INITIAL_PLAN: DayPlan[] = [
  {
    day: "الإثنين - Monday",
    tasks: [
      { id: "m1", skill: "Reading", duration: 30, completed: true },
      { id: "m2", skill: "Listening", duration: 25, completed: false },
      { id: "m3", skill: "Speaking", duration: 15, completed: false },
    ],
  },
  {
    day: "الثلاثاء - Tuesday",
    tasks: [
      { id: "t1", skill: "Vocabulary", duration: 20, completed: true },
      { id: "t2", skill: "Writing", duration: 40, completed: false },
      { id: "t3", skill: "Practice Test", duration: 60, completed: false },
    ],
  },
  {
    day: "الأربعاء - Wednesday",
    tasks: [
      { id: "w1", skill: "Reading", duration: 25, completed: false },
      { id: "w2", skill: "Speaking", duration: 20, completed: false },
    ],
  },
  {
    day: "الخميس - Thursday",
    tasks: [
      { id: "th1", skill: "Listening", duration: 30, completed: false },
      { id: "th2", skill: "Writing", duration: 45, completed: false },
    ],
  },
  {
    day: "الجمعة - Friday",
    tasks: [
      { id: "f1", skill: "Vocabulary", duration: 15, completed: false },
      { id: "f2", skill: "Reading", duration: 25, completed: false },
      { id: "f3", skill: "Speaking", duration: 15, completed: false },
    ],
  },
  {
    day: "السبت - Saturday",
    tasks: [
      { id: "sa1", skill: "Practice Test", duration: 90, completed: false },
    ],
  },
  {
    day: "الأحد - Sunday",
    tasks: [
      { id: "su1", skill: "Vocabulary", duration: 20, completed: false },
    ],
  },
];

export default function WeeklyPlan() {
  const [weeklyPlan, setWeeklyPlan] = useState<DayPlan[]>(() => {
    const saved = localStorage.getItem("ielts_weekly_plan");
    return saved ? JSON.parse(saved) : INITIAL_PLAN;
  });

  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [newSkill, setNewSkill] = useState<StudyTask["skill"]>("Reading");
  const [newDuration, setNewDuration] = useState(30);

  useEffect(() => {
    localStorage.setItem("ielts_weekly_plan", JSON.stringify(weeklyPlan));
  }, [weeklyPlan]);

  const handleToggleTask = (dayIndex: number, taskId: string) => {
    setWeeklyPlan((prev) =>
      prev.map((dayPlan, dIdx) => {
        if (dIdx !== dayIndex) return dayPlan;
        return {
          ...dayPlan,
          tasks: dayPlan.tasks.map((task) =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
          ),
        };
      })
    );
  };

  const handleAddTask = (dayIndex: number) => {
    const newTask: StudyTask = {
      id: Date.now().toString(),
      skill: newSkill,
      duration: newDuration,
      completed: false,
    };

    setWeeklyPlan((prev) =>
      prev.map((dayPlan, dIdx) => {
        if (dIdx !== dayIndex) return dayPlan;
        return {
          ...dayPlan,
          tasks: [...dayPlan.tasks, newTask],
        };
      })
    );
  };

  const handleDeleteTask = (dayIndex: number, taskId: string) => {
    setWeeklyPlan((prev) =>
      prev.map((dayPlan, dIdx) => {
        if (dIdx !== dayIndex) return dayPlan;
        return {
          ...dayPlan,
          tasks: dayPlan.tasks.filter((task) => task.id !== taskId),
        };
      })
    );
  };

  const handleMoveTask = (dayIndex: number, taskId: string, direction: "up" | "down") => {
    // Easily reorder tasks within the same day
    setWeeklyPlan((prev) =>
      prev.map((dayPlan, dIdx) => {
        if (dIdx !== dayIndex) return dayPlan;
        const tasks = [...dayPlan.tasks];
        const index = tasks.findIndex((t) => t.id === taskId);
        if (index === -1) return dayPlan;

        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= tasks.length) return dayPlan;

        // Swap
        const temp = tasks[index];
        tasks[index] = tasks[targetIndex];
        tasks[targetIndex] = temp;

        return {
          ...dayPlan,
          tasks,
        };
      })
    );
  };

  // Move task to another day (Drag-and-drop equivalent trigger)
  const handleMoveTaskToOtherDay = (currentDayIndex: number, taskId: string, targetDayIndex: number) => {
    const taskToMove = weeklyPlan[currentDayIndex].tasks.find((t) => t.id === taskId);
    if (!taskToMove) return;

    setWeeklyPlan((prev) =>
      prev.map((dayPlan, dIdx) => {
        if (dIdx === currentDayIndex) {
          return {
            ...dayPlan,
            tasks: dayPlan.tasks.filter((t) => t.id !== taskId),
          };
        }
        if (dIdx === targetDayIndex) {
          return {
            ...dayPlan,
            tasks: [...dayPlan.tasks, { ...taskToMove, id: Date.now().toString() }],
          };
        }
        return dayPlan;
      })
    );
  };

  const resetToDefault = () => {
    if (window.confirm("هل أنت متأكد من إعادة ضبط جدول الأسبوع إلى الافتراضي؟")) {
      setWeeklyPlan(INITIAL_PLAN);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 font-sans shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-800">📅 خطة الأسبوع التفاعلية (Weekly Study Plan)</h2>
          <p className="text-xs text-slate-500 mt-1">
            خصص خطة دراستك اليومية، انقل المهام بين الأيام، وقم بمتابعة تقدمك المستمر.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetToDefault}
            className="flex items-center gap-1 text-slate-500 hover:text-red-600 text-xs border border-slate-200 hover:border-red-200 px-3 py-1.5 rounded-xl transition-all"
          >
            <RefreshCw className="h-3 w-3" /> إعادة ضبط الافتراضي
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Days of the week selector Tabs */}
        <div className="lg:col-span-4 space-y-2">
          <label className="block text-xs font-semibold text-slate-400 mb-2">اختر اليوم لتعديل مهامه:</label>
          {weeklyPlan.map((dPlan, idx) => {
            const completedCount = dPlan.tasks.filter((t) => t.completed).length;
            const totalCount = dPlan.tasks.length;
            const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

            return (
              <button
                key={idx}
                onClick={() => setActiveDayIndex(idx)}
                className={`w-full text-right p-3.5 rounded-2xl border transition-all flex justify-between items-center ${
                  activeDayIndex === idx
                    ? "bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-100"
                    : "bg-white border-slate-100 hover:bg-slate-55 hover:border-slate-200 text-slate-700"
                }`}
              >
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-sm">{dPlan.day}</span>
                  <span className={`text-[10px] ${activeDayIndex === idx ? "text-purple-200" : "text-slate-400"}`}>
                    {totalCount} مهام مخصصة ({completedCount} منجزة)
                  </span>
                </div>
                {totalCount > 0 && (
                  <div className="text-[10px] px-2.5 py-0.5 rounded-full bg-black/10 text-inherit font-mono font-bold">
                    {percent}%
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Day Task Manager */}
        <div className="lg:col-span-8 bg-slate-50 rounded-3xl p-5 md:p-6 border border-slate-150">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-800 text-base">
              مهام يوم <span className="text-purple-600">{weeklyPlan[activeDayIndex].day}</span>
            </h3>
            <span className="text-xs bg-purple-100 text-purple-800 px-2.5 py-1 rounded-full font-semibold">
              المجموع: {weeklyPlan[activeDayIndex].tasks.reduce((acc, curr) => acc + curr.duration, 0)} دقيقة
            </span>
          </div>

          {/* Task list for active day */}
          <div className="space-y-2.5 mb-6">
            {weeklyPlan[activeDayIndex].tasks.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs bg-white rounded-2xl border border-dashed border-slate-200">
                لا توجد مهام دراسية مضافة لهذا اليوم. تفضل بإضافة واحدة بالأسفل!
              </div>
            ) : (
              weeklyPlan[activeDayIndex].tasks.map((task, taskIdx) => {
                // Determine badges background colors for different skills
                const skillColors: Record<string, string> = {
                  Reading: "bg-emerald-50 text-emerald-700 border-emerald-100",
                  Listening: "bg-orange-50 text-orange-700 border-orange-100",
                  Speaking: "bg-purple-50 text-purple-700 border-purple-100",
                  Writing: "bg-blue-50 text-blue-700 border-blue-100",
                  Vocabulary: "bg-pink-50 text-pink-700 border-pink-100",
                  "Practice Test": "bg-slate-100 text-slate-800 border-slate-200",
                };

                return (
                  <div
                    key={task.id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white rounded-2xl border ${
                      task.completed ? "border-slate-100 opacity-80" : "border-slate-150"
                    } gap-3`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleTask(activeDayIndex, task.id)}
                        className="text-slate-400 hover:text-purple-600 transition-colors"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-purple-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-slate-300" />
                        )}
                      </button>

                      <div className="flex flex-col items-start">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                              skillColors[task.skill] || "bg-slate-50 text-slate-600"
                            }`}
                          >
                            {task.skill}
                          </span>
                          <span
                            className={`text-xs font-semibold ${
                              task.completed ? "line-through text-slate-400" : "text-slate-700"
                            }`}
                          >
                            مراجعة والتدرب على المهارة اليومية
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5 font-mono">
                          <Clock className="h-3 w-3" /> {task.duration} دقيقة
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-1 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                      {/* Move to another day dropdown */}
                      <select
                        onChange={(e) => {
                          if (e.target.value !== "") {
                            handleMoveTaskToOtherDay(activeDayIndex, task.id, parseInt(e.target.value));
                            e.target.value = "";
                          }
                        }}
                        className="text-[10px] bg-slate-50 text-slate-600 border border-slate-200 rounded px-1.5 py-1 focus:outline-none"
                        defaultValue=""
                      >
                        <option value="" disabled>انقل إلى يوم آخر...</option>
                        {weeklyPlan.map((d, dIdx) => (
                          dIdx !== activeDayIndex ? <option key={dIdx} value={dIdx}>{d.day.split(" - ")[0]}</option> : null
                        ))}
                      </select>

                      <button
                        onClick={() => handleDeleteTask(activeDayIndex, task.id)}
                        className="p-1.5 text-slate-300 hover:text-red-500 rounded transition-colors"
                        title="حذف المهمة"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Add task controller on selected day */}
          <div className="bg-white rounded-2xl p-4 border border-slate-150">
            <h4 className="text-xs font-bold text-slate-700 mb-3 text-right">أضف مهمة دراسية جديدة للجدول:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">المهارة المستهدفة:</label>
                <select
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value as StudyTask["skill"])}
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-500"
                >
                  <option value="Reading">Reading (القراءة) 📖</option>
                  <option value="Listening">Listening (الاستماع) 🎧</option>
                  <option value="Speaking">Speaking (المحادثة) 🗣</option>
                  <option value="Writing">Writing (الكتابة) ✍️</option>
                  <option value="Vocabulary">Vocabulary (المفردات) 🧠</option>
                  <option value="Practice Test">Practice Test (اختبار تجريبي) 📊</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1 font-mono">الوقت المخصص (بالدقائق):</label>
                <input
                  type="number"
                  min="5"
                  max="120"
                  value={newDuration}
                  onChange={(e) => setNewDuration(parseInt(e.target.value) || 20)}
                  className="w-full bg-slate-50 border border-slate-200 text-xs rounded-xl p-2.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-purple-500 font-mono"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => handleAddTask(activeDayIndex)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Plus className="h-4 w-4" /> أضف إلى الخطة اليومية
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

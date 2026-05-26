export interface StudyTask {
  id: string;
  skill: "Reading" | "Listening" | "Speaking" | "Writing" | "Vocabulary" | "Practice Test";
  duration: number; // in minutes
  completed: boolean;
  notes?: string;
}

export interface DayPlan {
  day: string; // e.g., "Monday", "Tuesday", etc.
  tasks: StudyTask[];
}

export interface SourceCard {
  id: string;
  name: string;
  url: string;
  goal: string;
  durationCompleted: number; // minutes spent
  durationGoal: number; // minutes target
  progress: number; // percentage
  saved?: boolean;
}

export interface QuestionBankTopic {
  id: string;
  topic: string;
  part1: string[];
  part2Cue: string;
  part3: string[];
}

export interface SpeakingEvaluationResponse {
  band: string;
  corrections: string;
  improvements: string[];
  explanation: string;
}

export interface IELTSBadges {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface AnalyticsData {
  readingHistory: number[];
  listeningHistory: number[];
  speakingHistory: number[];
  writingHistory: number[];
  dates: string[];
  totalHours: number;
  streak: number;
}

export interface Habit {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: string;
  userId: string;
  createdAt: Date;
  completions: { [date: string]: boolean };
}

export interface HabitInput {
  title: string;
  description: string;
  time: string;
  icon: string;
}
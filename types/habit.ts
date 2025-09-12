export interface Habit {
  name: ReactNode;
  id: string;
  title: string;
  description: string;
  time: string;
  icon: string;
  frequency: 'daily' | 'weekdays' | 'weekends' | 'weekly';
  userId: string;
  createdAt: Date;
  completions: { [date: string]: boolean };
}

export interface HabitInput {
  title: string;
  description: string;
  time: string;
  icon: string;
  frequency: 'daily' | 'weekdays' | 'weekends' | 'weekly';
}
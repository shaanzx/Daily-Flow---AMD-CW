import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  getDoc,
  query, 
  where, 
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Habit, HabitInput } from '@/types/habit';

export class HabitService {
  static async createHabit(habitData: HabitInput, userId: string): Promise<string> {
    const habit = {
      ...habitData,
      userId,
      createdAt: new Date(),
      completions: {}
    };
    
    const docRef = await addDoc(collection(db, 'habits'), habit);
    return docRef.id;
  }

  static async getUserHabits(userId: string): Promise<Habit[]> {
    const q = query(
      collection(db, 'habits'),
      where('userId', '==', userId),
      orderBy('createdAt', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Habit));
  }

  static async getHabit(habitId: string): Promise<Habit | null> {
    const habitRef = doc(db, 'habits', habitId);
    const habitSnap = await getDoc(habitRef);
    
    if (habitSnap.exists()) {
      return {
        id: habitSnap.id,
        ...habitSnap.data()
      } as Habit;
    }
    
    return null;
  }

  static async updateHabit(habitId: string, updates: Partial<HabitInput>): Promise<void> {
    const habitRef = doc(db, 'habits', habitId);
    await updateDoc(habitRef, {
      ...updates,
      updatedAt: new Date()
    });
  }

  static async deleteHabit(habitId: string): Promise<void> {
    const habitRef = doc(db, 'habits', habitId);
    await deleteDoc(habitRef);
  }

  static async toggleHabitCompletion(habitId: string, date: string, completed: boolean): Promise<void> {
    const habitRef = doc(db, 'habits', habitId);
    const completionKey = `completions.${date}`;
    
    await updateDoc(habitRef, {
      [completionKey]: completed
    });
  }

  static getTodayString(): string {
    return new Date().toISOString().split('T')[0];
  }

  static isHabitActiveToday(habit: Habit): boolean {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    
    switch (habit.frequency) {
      case 'daily':
        return true;
      case 'weekdays':
        return dayOfWeek >= 1 && dayOfWeek <= 5; // Monday to Friday
      case 'weekends':
        return dayOfWeek === 0 || dayOfWeek === 6; // Saturday and Sunday
      case 'weekly':
        return true; // User can complete once per week
      default:
        return true;
    }
  }

  static calculateStreak(habits: Habit[]): number {
    if (habits.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      // Filter habits that should be active on this date
      const activeHabits = habits.filter(habit => {
        const habitDate = new Date(date);
        const dayOfWeek = habitDate.getDay();
        
        switch (habit.frequency) {
          case 'daily':
            return true;
          case 'weekdays':
            return dayOfWeek >= 1 && dayOfWeek <= 5;
          case 'weekends':
            return dayOfWeek === 0 || dayOfWeek === 6;
          case 'weekly':
            return true; // Consider weekly habits active every day for streak calculation
          default:
            return true;
        }
      });
      
      const completedHabits = activeHabits.filter(habit => habit.completions[dateString]);
      const completionRate = activeHabits.length > 0 ? completedHabits.length / activeHabits.length : 0;
      
      if (completionRate >= 0.5) { // At least 50% of active habits completed
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  static getWeeklyStats(habits: Habit[]): { average: number; days: number[] } {
    const days: number[] = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      const dayOfWeek = date.getDay();
      
      // Filter habits that should be active on this date
      const activeHabits = habits.filter(habit => {
        switch (habit.frequency) {
          case 'daily':
            return true;
          case 'weekdays':
            return dayOfWeek >= 1 && dayOfWeek <= 5;
          case 'weekends':
            return dayOfWeek === 0 || dayOfWeek === 6;
          case 'weekly':
            return true;
          default:
            return true;
        }
      });
      
      const completedHabits = activeHabits.filter(habit => habit.completions[dateString]);
      const completionRate = activeHabits.length > 0 ? Math.round((completedHabits.length / activeHabits.length) * 100) : 0;
      days.unshift(completionRate);
    }
    
    const average = days.length > 0 ? Math.round(days.reduce((sum, day) => sum + day, 0) / days.length) : 0;
    
    return { average, days };
  }

  static getMonthlyStats(habits: Habit[]): { average: number; weeks: number[] } {
    const weeks: number[] = [];
    const today = new Date();
    
    for (let week = 0; week < 4; week++) {
      let weekTotal = 0;
      let weekDays = 0;
      
      for (let day = 0; day < 7; day++) {
        const date = new Date(today);
        date.setDate(date.getDate() - (week * 7 + day));
        const dateString = date.toISOString().split('T')[0];
        const dayOfWeek = date.getDay();
        
        // Filter habits that should be active on this date
        const activeHabits = habits.filter(habit => {
          switch (habit.frequency) {
            case 'daily':
              return true;
            case 'weekdays':
              return dayOfWeek >= 1 && dayOfWeek <= 5;
            case 'weekends':
              return dayOfWeek === 0 || dayOfWeek === 6;
            case 'weekly':
              return true;
            default:
              return true;
          }
        });
        
        const completedHabits = activeHabits.filter(habit => habit.completions[dateString]);
        const completionRate = activeHabits.length > 0 ? (completedHabits.length / activeHabits.length) * 100 : 0;
        weekTotal += completionRate;
        weekDays++;
      }
      
      weeks.unshift(weekDays > 0 ? Math.round(weekTotal / weekDays) : 0);
    }
    
    const average = weeks.length > 0 ? Math.round(weeks.reduce((sum, week) => sum + week, 0) / weeks.length) : 0;
    
    return { average, weeks };
  }

  static subscribeUserHabits(userId: string, callback: (habits: Habit[]) => void) {
    const q = query(
      collection(db, 'habits'),
      where('userId', '==', userId),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, snapshot => {
      const habits: Habit[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Habit));
      callback(habits);
    });

    return unsubscribe; 
  }
}
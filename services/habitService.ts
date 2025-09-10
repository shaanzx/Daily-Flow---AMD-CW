import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  where, 
  orderBy 
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
}
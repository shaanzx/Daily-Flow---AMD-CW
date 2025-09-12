import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { HabitService } from '@/services/habitService';
import { Habit } from '@/types/habit';
import HabitCard from '@/components/HabitCard';
import StatsCard from '@/components/StatsCard';
import { Calendar, TrendingUp, Target, Flame, Plus } from 'lucide-react-native';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const loadHabits = async () => {
    if (!user) return;

    try {
      const userHabits = await HabitService.getUserHabits(user.uid);
      setHabits(userHabits);
    } catch (error) {
      console.error('Error loading habits:', error);
      Alert.alert('Error', 'Failed to load habits');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleHabit = async (habitId: string, completed: boolean) => {
    try {
      const today = HabitService.getTodayString();
      await HabitService.toggleHabitCompletion(habitId, today, completed);
      
      setHabits(prevHabits =>
        prevHabits.map(habit =>
          habit.id === habitId
            ? { ...habit, completions: { ...habit.completions, [today]: completed } }
            : habit
        )
      );
    } catch (error) {
      console.error('Error toggling habit:', error);
      Alert.alert('Error', 'Failed to update habit');
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    Alert.alert(
      'Delete Habit',
      'Are you sure you want to delete this habit?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await HabitService.deleteHabit(habitId);
              setHabits(prevHabits => prevHabits.filter(habit => habit.id !== habitId));
              Alert.alert('Success', 'Habit deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete habit');
            }
          },
        },
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHabits();
    setRefreshing(false);
  };

  useEffect(() => {
    loadHabits();
  }, [user]);

  const today = HabitService.getTodayString();
  const completedCount = habits.filter(habit => habit.completions[today]).length;
  const completionRate = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;
  
  // Calculate streak
  const streak = HabitService.calculateStreak(habits);
  
  // Calculate weekly stats
  const weeklyStats = HabitService.getWeeklyStats(habits);

  const stats = [
    { 
      title: 'Today\'s Progress', 
      value: `${completedCount}/${habits.length}`, 
      percentage: completionRate,
      icon: Target,
      color: '#3B82F6'
    },
    { 
      title: 'Current Streak', 
      value: `${streak} days`, 
      percentage: streak > 0 ? 100 : 0,
      icon: Flame,
      color: '#F59E0B'
    },
    { 
      title: 'Weekly Average', 
      value: `${weeklyStats.average}%`, 
      percentage: weeklyStats.average,
      icon: TrendingUp,
      color: '#10B981'
    },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading your habits...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Good morning!</Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </View>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => router.push('/(tabs)/add')}
          >
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Your Progress</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll}>
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </ScrollView>
      </View>

      <View style={styles.periodSelector}>
        {(['daily', 'weekly', 'monthly'] as const).map((period) => (
          <TouchableOpacity
            key={period}
            style={[
              styles.periodButton,
              selectedPeriod === period && styles.periodButtonActive
            ]}
            onPress={() => setSelectedPeriod(period)}
          >
            <Text style={[
              styles.periodText,
              selectedPeriod === period && styles.periodTextActive
            ]}>
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.habitsSection}>
        <Text style={styles.sectionTitle}>Today's Habits</Text>
        {habits.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Target size={48} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No habits yet</Text>
            <Text style={styles.emptySubtitle}>
              Start building healthy habits by adding your first one!
            </Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={() => router.push('/(tabs)/add')}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.emptyButtonText}>Add Your First Habit</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={habits}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <HabitCard
                habit={item}
                onToggle={(completed) => handleToggleHabit(item.id, completed)}
                onDelete={() => handleDeleteHabit(item.id)}
                onEdit={() => router.push(`/(tabs)/edit/${item.id}`)}
                isCompleted={item.completions[today] || false}
              />
            )}
            scrollEnabled={false}
            contentContainerStyle={styles.habitsList}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748B',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  date: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 4,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  statsSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  statsScroll: {
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  periodSelector: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 24,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
  },
  periodTextActive: {
    color: '#1E293B',
    fontWeight: '600',
  },
  habitsSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  habitsList: {
    gap: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
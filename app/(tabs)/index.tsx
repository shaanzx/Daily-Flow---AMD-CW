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
import { TrendingUp, Target, Flame, Plus } from 'lucide-react-native';
import { router } from 'expo-router';
import UpdateHabitModal from '@/components/UpdateHabitModal';

export default function HomeScreen() {
  const { user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 🔥 Update modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

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

  useEffect(() => {
  if (!user) return;

  setLoading(true);
  const unsubscribe = HabitService.subscribeUserHabits(user.uid, (userHabits) => {
    setHabits(userHabits);
    setLoading(false);
  });

  return () => unsubscribe(); // Clean up listener on unmount
}, [user]);

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

  const handleUpdateHabit = async (updatedHabit: Habit) => {
    try {
      await HabitService.updateHabit(updatedHabit.id, updatedHabit);
      setHabits(prev =>
        prev.map(habit => (habit.id === updatedHabit.id ? updatedHabit : habit))
      );
      setModalVisible(false);
    } catch (error) {
      console.error('Error updating habit:', error);
      Alert.alert('Error', 'Failed to update habit');
    }
  };

  const handleEditHabit = (habit: Habit) => {
    setSelectedHabit(habit);
    setModalVisible(true);
  };

  useEffect(() => {
    loadHabits();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHabits();
    setRefreshing(false);
  };

  // Filter habits that should be active today
  const today = HabitService.getTodayString();
  const todaysHabits = habits.filter(habit => HabitService.isHabitActiveToday(habit));
  const completedCount = todaysHabits.filter(habit => habit.completions[today]).length;
  const completionRate =
    todaysHabits.length > 0 ? Math.round((completedCount / todaysHabits.length) * 100) : 0;

  // Calculate streak
  const streak = HabitService.calculateStreak(habits);

  // Calculate weekly stats
  const weeklyStats = HabitService.getWeeklyStats(habits);

  const stats = [
    {
      title: "Today's Progress",
      value: `${completedCount}/${todaysHabits.length}`,
      percentage: completionRate,
      icon: Target,
      color: '#3B82F6',
    },
    {
      title: 'Current Streak',
      value: `${streak} days`,
      percentage: streak > 0 ? Math.min(streak * 10, 100) : 0,
      icon: Flame,
      color: '#F59E0B',
    },
    {
      title: 'Weekly Average',
      value: `${weeklyStats.average}%`,
      percentage: weeklyStats.average,
      icon: TrendingUp,
      color: '#10B981',
    },
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning! 🌅';
    if (hour < 17) return 'Good afternoon! ☀️';
    return 'Good evening! 🌙';
  };

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
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.date}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={() => router.push('/(tabs)/add')}>
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>📊 Your Progress</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsScroll}>
          {stats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </ScrollView>
      </View>

      <View style={styles.habitsSection}>
        <Text style={styles.sectionTitle}>
          🎯 Today's Habits ({completedCount}/{todaysHabits.length})
        </Text>
        {todaysHabits.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🎯</Text>
            <Text style={styles.emptyTitle}>No habits for today</Text>
            <Text style={styles.emptySubtitle}>
              {habits.length === 0
                ? 'Start building healthy habits by adding your first one!'
                : 'All your habits are scheduled for other days. Great job staying organized!'}
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={() => router.push('/(tabs)/add')}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.emptyButtonText}>
                {habits.length === 0 ? 'Add Your First Habit' : 'Add Another Habit'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={todaysHabits}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <HabitCard
                habit={item}
                onToggle={(completed) => handleToggleHabit(item.id, completed)}
                onDelete={() => handleDeleteHabit(item.id)}
                onEdit={() => handleEditHabit(item)} // ✅ FIXED
                isCompleted={item.completions[today] || false}
              />
            )}
            scrollEnabled={false}
            contentContainerStyle={styles.habitsList}
          />
        )}
      </View>

      {habits.length > todaysHabits.length && (
        <View style={styles.allHabitsSection}>
          <Text style={styles.sectionTitle}>📅 All Your Habits</Text>
          <FlatList
            data={habits}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <HabitCard
                habit={item}
                onToggle={(completed) => handleToggleHabit(item.id, completed)}
                onDelete={() => handleDeleteHabit(item.id)}
                onEdit={() => handleEditHabit(item)} // ✅ FIXED
                isCompleted={item.completions[today] || false}
                showFrequency={true}
              />
            )}
            scrollEnabled={false}
            contentContainerStyle={styles.habitsList}
          />
        </View>
      )}

      {/* 🔥 Update Modal */}
      <UpdateHabitModal
        visible={modalVisible}
        habit={selectedHabit}
        onClose={() => setModalVisible(false)}
        onSave={handleUpdateHabit}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' },
  loadingText: { fontSize: 16, color: '#64748B' },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { fontSize: 28, fontWeight: 'bold', color: '#1E293B' },
  date: { fontSize: 16, color: '#64748B', marginTop: 4 },
  addButton: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#3B82F6',
    alignItems: 'center', justifyContent: 'center', shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8,
  },
  statsSection: { paddingHorizontal: 24, paddingVertical: 24 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#1E293B', marginBottom: 16 },
  statsScroll: { marginHorizontal: -24, paddingHorizontal: 24 },
  habitsSection: { paddingHorizontal: 24, paddingBottom: 24 },
  allHabitsSection: {
    paddingHorizontal: 24, paddingBottom: 24,
    borderTopWidth: 1, borderTopColor: '#E2E8F0',
    marginTop: 12, paddingTop: 24,
  },
  habitsList: { gap: 12 },
  emptyContainer: {
    alignItems: 'center', paddingVertical: 48, backgroundColor: '#FFFFFF',
    borderRadius: 16, marginVertical: 8,
  },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#1E293B', marginBottom: 8 },
  emptySubtitle: {
    fontSize: 16, color: '#64748B', textAlign: 'center',
    marginBottom: 24, paddingHorizontal: 32, lineHeight: 22,
  },
  emptyButton: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#3B82F6',
    paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12,
    shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 8,
  },
  emptyButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});

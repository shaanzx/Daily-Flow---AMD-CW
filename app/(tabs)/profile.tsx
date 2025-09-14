import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { HabitService } from '@/services/habitService';
import { Habit } from '@/types/habit';
import { router } from 'expo-router';
import { 
  User, 
  Mail, 
  LogOut, 
  Settings, 
  Calendar, 
  Target, 
  TrendingUp, 
  Award,
  Clock,
  Flame,
  BarChart3,
  Bell,
  Shield,
  HelpCircle,
  Star,
  ChevronRight
} from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  
  useEffect(() => {
  if (!user) return;

  setLoading(true);

  const unsubscribe = HabitService.subscribeUserHabits(user.uid, (userHabits) => {
    setHabits(userHabits);
    setLoading(false);
  });

  return () => unsubscribe(); 
}, [user]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      const userHabits = await HabitService.getUserHabits(user.uid);
      setHabits(userHabits);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUserData();
    setRefreshing(false);
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out');
            }
          },
        },
      ]
    );
  };

  const today = HabitService.getTodayString();
  const todaysHabits = habits.filter(habit => HabitService.isHabitActiveToday(habit));
  const completedToday = todaysHabits.filter(habit => habit.completions[today]).length;
  const completionRate = todaysHabits.length > 0 ? Math.round((completedToday / todaysHabits.length) * 100) : 0;
  const streak = HabitService.calculateStreak(habits);
  const weeklyStats = HabitService.getWeeklyStats(habits);

  const totalCompletions = habits.reduce((total, habit) => {
    return total + Object.values(habit.completions).filter(Boolean).length;
  }, 0);

  const bestStreak = Math.max(streak, 0);

  const stats = [
    { label: 'Active Habits', value: habits.length.toString(), icon: Target, color: '#3B82F6' },
    { label: 'Current Streak', value: `${streak}`, icon: Flame, color: '#F59E0B' },
    { label: 'Completion Rate', value: `${completionRate}%`, icon: TrendingUp, color: '#10B981' },
  ];

  const achievements = [
    { label: 'Total Completions', value: totalCompletions.toString(), icon: Award, color: '#8B5CF6' },
    { label: 'Best Streak', value: `${bestStreak}`, icon: Star, color: '#F59E0B' },
    { label: 'Weekly Average', value: `${weeklyStats.average}%`, icon: BarChart3, color: '#06B6D4' },
  ];

  const menuSections = [
    {
      title: 'Preferences',
      items: [
        { icon: Settings, label: 'App Settings', onPress: () => Alert.alert('Coming Soon', 'Settings will be available in the next update!') },
        { icon: Bell, label: 'Notifications', onPress: () => Alert.alert('Coming Soon', 'Notification settings coming soon!') },
        { icon: Shield, label: 'Privacy', onPress: () => Alert.alert('Privacy', 'Your data is stored securely and never shared with third parties.') },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help & FAQ', onPress: () => Alert.alert('Help', 'For support, please contact us at support@habittracker.app') },
        { icon: Mail, label: 'Contact Us', onPress: () => Alert.alert('Contact', 'Email us at support@habittracker.app for any questions or feedback!') },
      ]
    }
  ];

  const getUserDisplayName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'Habit Tracker User';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning! 🌅';
    if (hour < 17) return 'Good afternoon! ☀️';
    return 'Good evening! 🌙';
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <User size={48} color="#FFFFFF" />
        </View>
        <Text style={styles.greeting}>{getGreeting()}</Text>
        <Text style={styles.name}>{getUserDisplayName()}</Text>
        <Text style={styles.email}>{user?.email || 'demo@example.com'}</Text>
        
        <View style={styles.headerStats}>
          <View style={styles.headerStat}>
            <Text style={styles.headerStatValue}>{completedToday}</Text>
            <Text style={styles.headerStatLabel}>Today</Text>
          </View>
          <View style={styles.headerStatDivider} />
          <View style={styles.headerStat}>
            <Text style={styles.headerStatValue}>{streak}</Text>
            <Text style={styles.headerStatLabel}>Streak</Text>
          </View>
          <View style={styles.headerStatDivider} />
          <View style={styles.headerStat}>
            <Text style={styles.headerStatValue}>{habits.length}</Text>
            <Text style={styles.headerStatLabel}>Habits</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>📊 Your Progress</Text>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: `${stat.color}15` }]}>
                <stat.icon size={24} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.achievementsContainer}>
        <Text style={styles.sectionTitle}>🏆 Achievements</Text>
        <View style={styles.achievementsGrid}>
          {achievements.map((achievement, index) => (
            <View key={index} style={styles.achievementCard}>
              <View style={[styles.achievementIconContainer, { backgroundColor: `${achievement.color}15` }]}>
                <achievement.icon size={20} color={achievement.color} />
              </View>
              <View style={styles.achievementContent}>
                <Text style={styles.achievementValue}>{achievement.value}</Text>
                <Text style={styles.achievementLabel}>{achievement.label}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {menuSections.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <Text style={styles.sectionTitle}>
            {section.title === 'Preferences' ? '⚙️ Preferences' : '💬 Support'}
          </Text>
          
          <View style={styles.menuContainer}>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity 
                key={itemIndex} 
                style={[
                  styles.menuItem,
                  itemIndex === section.items.length - 1 && styles.menuItemLast
                ]} 
                activeOpacity={0.7}
                onPress={item.onPress}
              >
                <View style={styles.menuLeft}>
                  <View style={styles.menuIconContainer}>
                    <item.icon size={20} color="#64748B" />
                  </View>
                  <Text style={styles.menuText}>{item.label}</Text>
                </View>
                <ChevronRight size={16} color="#CBD5E1" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.7}
      >
        <LogOut size={20} color="#EF4444" />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Habit Tracker v1.0.0</Text>
        <Text style={styles.footerSubtext}>Built with ❤️ for better habits</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
    backgroundColor: '#3B82F6',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  greeting: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerStat: {
    alignItems: 'center',
    flex: 1,
  },
  headerStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerStatLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  headerStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 16,
  },
  statsContainer: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  achievementsContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  achievementsGrid: {
    gap: 12,
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  achievementContent: {
    flex: 1,
  },
  achievementValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  achievementLabel: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEF2F2',
    marginHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#94A3B8',
  },
});
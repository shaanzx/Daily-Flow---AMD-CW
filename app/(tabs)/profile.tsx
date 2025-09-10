import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useAuth, logout } from '@/context/AuthContext';
import { router } from 'expo-router';
import { User, Mail, LogOut, Settings, Calendar, Target, TrendingUp } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              router.replace('/(auth)/authScreen');
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  const stats = [
    { label: 'Total Habits', value: '12', icon: Target },
    { label: 'Streak Days', value: '7', icon: Calendar },
    { label: 'Completion Rate', value: '85%', icon: TrendingUp },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <User size={48} color="#FFFFFF" />
        </View>
        <Text style={styles.name}>Welcome Back!</Text>
        <Text style={styles.email}>{user?.email || 'Not available'}</Text>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Your Progress</Text>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <stat.icon size={24} color="#3B82F6" />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuLeft}>
              <Settings size={20} color="#64748B" />
              <Text style={styles.menuText}>App Preferences</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuLeft}>
              <Mail size={20} color="#64748B" />
              <Text style={styles.menuText}>Support</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
        activeOpacity={0.7}
      >
        <LogOut size={20} color="#EF4444" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
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
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
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
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
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
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuText: {
    fontSize: 16,
    color: '#1E293B',
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
    marginBottom: 32,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
});
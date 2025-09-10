import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { HabitService } from '@/services/habitService';
import { Habit } from '@/types/habit';
import { Edit3, BookOpen, Dumbbell, Droplets, Moon, Brain, Zap, Heart, Star, ArrowLeft } from 'lucide-react-native';

const HABIT_ICONS = [
  { key: 'book', icon: BookOpen, label: 'Reading' },
  { key: 'dumbbell', icon: Dumbbell, label: 'Exercise' },
  { key: 'water', icon: Droplets, label: 'Water' },
  { key: 'sleep', icon: Moon, label: 'Sleep' },
  { key: 'meditation', icon: Brain, label: 'Meditation' },
  { key: 'run', icon: Zap, label: 'Energy' },
  { key: 'heart', icon: Heart, label: 'Health' },
  { key: 'star', icon: Star, label: 'Goals' },
];

export default function EditHabitScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [time, setTime] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('star');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    loadHabit();
  }, [id]);

  const loadHabit = async () => {
    if (!id || !user) return;

    try {
      const habitData = await HabitService.getHabit(id);
      if (habitData && habitData.userId === user.uid) {
        setHabit(habitData);
        setTitle(habitData.title);
        setDescription(habitData.description);
        setTime(habitData.time);
        setSelectedIcon(habitData.icon);
      } else {
        Alert.alert('Error', 'Habit not found or access denied');
        router.back();
      }
    } catch (error) {
      console.error('Error loading habit:', error);
      Alert.alert('Error', 'Failed to load habit');
      router.back();
    } finally {
      setInitialLoading(false);
    }
  };

  const handleUpdateHabit = async () => {
    if (!title || !description || !time) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!habit) return;

    setLoading(true);
    try {
      await HabitService.updateHabit(habit.id, {
        title,
        description,
        time,
        icon: selectedIcon,
      });

      Alert.alert('Success', 'Habit updated successfully!', [
        {
          text: 'OK',
          onPress: () => router.back(),
        }
      ]);
    } catch (error) {
      console.error('Error updating habit:', error);
      Alert.alert('Error', 'Failed to update habit');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading habit...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Habit</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.iconHeader}>
          <Edit3 size={32} color="#3B82F6" />
          <Text style={styles.title}>Update Your Habit</Text>
          <Text style={styles.subtitle}>Make changes to improve your routine</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Habit Title</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Morning Exercise"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="e.g., 30 minutes of cardio workout"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Time</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 7:00 AM"
              value={time}
              onChangeText={setTime}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Choose Icon</Text>
            <View style={styles.iconsContainer}>
              {HABIT_ICONS.map(({ key, icon: IconComponent, label }) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.iconOption,
                    selectedIcon === key && styles.iconOptionSelected,
                  ]}
                  onPress={() => setSelectedIcon(key)}
                >
                  <IconComponent
                    size={24}
                    color={selectedIcon === key ? '#FFFFFF' : '#3B82F6'}
                  />
                  <Text style={[
                    styles.iconLabel,
                    selectedIcon === key && styles.iconLabelSelected,
                  ]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleUpdateHabit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Updating Habit...' : 'Update Habit'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
  },
  iconHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginTop: 12,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  iconsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  iconOption: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    minWidth: 80,
  },
  iconOptionSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  iconLabel: {
    fontSize: 12,
    color: '#3B82F6',
    marginTop: 4,
    fontWeight: '500',
  },
  iconLabelSelected: {
    color: '#FFFFFF',
  },
  button: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
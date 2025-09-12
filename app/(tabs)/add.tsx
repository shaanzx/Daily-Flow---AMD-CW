import React, { useState } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { HabitService } from '@/services/habitService';
import { Plus } from 'lucide-react-native';

const HABIT_ICONS = [
  { key: 'reading', emoji: '📚', label: 'Reading' },
  { key: 'exercise', emoji: '💪', label: 'Exercise' },
  { key: 'water', emoji: '💧', label: 'Water' },
  { key: 'sleep', emoji: '🛌', label: 'Sleep' },
  { key: 'meditation', emoji: '🧘', label: 'Meditation' },
  { key: 'running', emoji: '🏃', label: 'Running' },
  { key: 'healthy-food', emoji: '🥗', label: 'Healthy Food' },
  { key: 'study', emoji: '📖', label: 'Study' },
  { key: 'music', emoji: '🎵', label: 'Music' },
  { key: 'work', emoji: '💼', label: 'Work' },
  { key: 'creative', emoji: '🎨', label: 'Creative' },
  { key: 'social', emoji: '👥', label: 'Social' },
];

const TIME_SLOTS = [
  { label: 'Morning', value: '06:00', period: '6:00 AM' },
  { label: 'Early Morning', value: '07:00', period: '7:00 AM' },
  { label: 'Mid Morning', value: '09:00', period: '9:00 AM' },
  { label: 'Noon', value: '12:00', period: '12:00 PM' },
  { label: 'Afternoon', value: '15:00', period: '3:00 PM' },
  { label: 'Evening', value: '18:00', period: '6:00 PM' },
  { label: 'Night', value: '21:00', period: '9:00 PM' },
  { label: 'Custom', value: 'custom', period: 'Custom Time' },
];

const FREQUENCY_OPTIONS = [
  { key: 'daily', label: 'Daily', description: 'Every day' },
  { key: 'weekdays', label: 'Weekdays', description: 'Monday - Friday' },
  { key: 'weekends', label: 'Weekends', description: 'Saturday - Sunday' },
  { key: 'weekly', label: 'Weekly', description: 'Once a week' },
];

export default function AddHabitScreen() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTime, setSelectedTime] = useState('07:00');
  const [customTime, setCustomTime] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('reading');
  const [frequency, setFrequency] = useState('daily');
  const [loading, setLoading] = useState(false);

  const getDisplayTime = () => {
    if (selectedTime === 'custom') {
      return customTime || 'Enter custom time';
    }
    const timeSlot = TIME_SLOTS.find(slot => slot.value === selectedTime);
    return timeSlot?.period || selectedTime;
  };

  const handleAddHabit = async () => {
    if (!title || !description) {
      Alert.alert('Missing Information', 'Please fill in the habit title and description');
      return;
    }

    if (selectedTime === 'custom' && !customTime) {
      Alert.alert('Missing Time', 'Please enter a custom time or select a preset time');
      return;
    }

    if (!user) {
      Alert.alert('Authentication Error', 'You must be logged in to add habits');
      return;
    }

    setLoading(true);
    try {
      const finalTime = selectedTime === 'custom' ? customTime : selectedTime;
      
      await HabitService.createHabit(
        {
          title,
          description,
          time: finalTime,
          icon: selectedIcon,
          frequency,
        },
        user.uid
      );

      Alert.alert('Success! 🎉', 'Your new habit has been created successfully!', [
        {
          text: 'Great!',
          onPress: () => {
            setTitle('');
            setDescription('');
            setSelectedTime('07:00');
            setCustomTime('');
            setSelectedIcon('reading');
            setFrequency('daily');
            router.push('/(tabs)');
          }
        }
      ]);
    } catch (error) {
      console.error('Error adding habit:', error);
      Alert.alert('Error', 'Failed to create habit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Plus size={28} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>Create New Habit</Text>
          <Text style={styles.subtitle}>Build a healthy routine that sticks</Text>
        </View>

        <View style={styles.form}>
          {/* Habit Title */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>✨ What's your habit?</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Morning workout, Read 20 pages..."
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Description */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>📝 Add details (optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe your habit to stay motivated..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Icon Selection */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>🎯 Choose an icon</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconsScrollView}>
              <View style={styles.iconsContainer}>
                {HABIT_ICONS.map(({ key, emoji, label }) => (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.iconOption,
                      selectedIcon === key && styles.iconOptionSelected,
                    ]}
                    onPress={() => setSelectedIcon(key)}
                  >
                    <Text style={styles.iconEmoji}>{emoji}</Text>
                    <Text style={[
                      styles.iconLabel,
                      selectedIcon === key && styles.iconLabelSelected,
                    ]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Time Selection */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>⏰ When will you do it?</Text>
            <View style={styles.timeContainer}>
              {TIME_SLOTS.map(({ label, value, period }) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.timeOption,
                    selectedTime === value && styles.timeOptionSelected,
                  ]}
                  onPress={() => setSelectedTime(value)}
                >
                  <Text style={[
                    styles.timeLabel,
                    selectedTime === value && styles.timeLabelSelected,
                  ]}>
                    {label}
                  </Text>
                  <Text style={[
                    styles.timePeriod,
                    selectedTime === value && styles.timePeriodSelected,
                  ]}>
                    {period}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            {selectedTime === 'custom' && (
              <TextInput
                style={[styles.input, styles.customTimeInput]}
                placeholder="Enter time (e.g., 8:30 AM)"
                value={customTime}
                onChangeText={setCustomTime}
                placeholderTextColor="#9CA3AF"
              />
            )}
          </View>

          {/* Frequency Selection */}
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>🔄 How often?</Text>
            <View style={styles.frequencyContainer}>
              {FREQUENCY_OPTIONS.map(({ key, label, description }) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.frequencyOption,
                    frequency === key && styles.frequencyOptionSelected,
                  ]}
                  onPress={() => setFrequency(key)}
                >
                  <View style={styles.frequencyContent}>
                    <Text style={[
                      styles.frequencyLabel,
                      frequency === key && styles.frequencyLabelSelected,
                    ]}>
                      {label}
                    </Text>
                    <Text style={[
                      styles.frequencyDescription,
                      frequency === key && styles.frequencyDescriptionSelected,
                    ]}>
                      {description}
                    </Text>
                  </View>
                  <View style={[
                    styles.radioButton,
                    frequency === key && styles.radioButtonSelected,
                  ]}>
                    {frequency === key && <View style={styles.radioButtonInner} />}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.createButton, loading && styles.buttonDisabled]}
            onPress={handleAddHabit}
            disabled={loading}
          >
            <Text style={styles.createButtonText}>
              {loading ? '⏳ Creating Habit...' : '🚀 Create Habit'}
            </Text>
            {loading && (
              <ActivityIndicator size="small" color="white" />
            )}
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    gap: 28,
  },
  inputSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#1E293B',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  iconsScrollView: {
    marginHorizontal: -4,
  },
  iconsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 4,
    gap: 12,
  },
  iconOption: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 80,
  },
  iconOptionSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  iconLabel: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
    textAlign: 'center',
  },
  iconLabelSelected: {
    color: '#FFFFFF',
  },
  timeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeOption: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  timeOptionSelected: {
    backgroundColor: '#EBF4FF',
    borderColor: '#3B82F6',
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  timeLabelSelected: {
    color: '#3B82F6',
  },
  timePeriod: {
    fontSize: 12,
    color: '#64748B',
  },
  timePeriodSelected: {
    color: '#3B82F6',
  },
  customTimeInput: {
    marginTop: 8,
  },
  frequencyContainer: {
    gap: 12,
  },
  frequencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  frequencyOptionSelected: {
    backgroundColor: '#EBF4FF',
    borderColor: '#3B82F6',
  },
  frequencyContent: {
    flex: 1,
  },
  frequencyLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  frequencyLabelSelected: {
    color: '#3B82F6',
  },
  frequencyDescription: {
    fontSize: 14,
    color: '#64748B',
  },
  frequencyDescriptionSelected: {
    color: '#3B82F6',
  },
  radioButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#3B82F6',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#3B82F6',
  },
  createButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
});
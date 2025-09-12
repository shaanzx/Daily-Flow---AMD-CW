import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Habit } from '@/types/habit';

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

type UpdateHabitModalProps = {
  visible: boolean;
  habit: Habit | null;
  onClose: () => void;
  onSave: (updatedHabit: Habit) => void;
};

export default function UpdateHabitModal({
  visible,
  habit,
  onClose,
  onSave,
}: UpdateHabitModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('reading');
  const [selectedTime, setSelectedTime] = useState('07:00');
  const [customTime, setCustomTime] = useState('');
  const [frequency, setFrequency] = useState('daily');

  useEffect(() => {
    if (habit) {
      setTitle(habit.title || '');
      setDescription(habit.description || '');
      setSelectedIcon(habit.icon || 'reading');
      setFrequency(habit.frequency || 'daily');
      if (habit.time && TIME_SLOTS.some(slot => slot.value === habit.time)) {
        setSelectedTime(habit.time);
        setCustomTime('');
      } else {
        setSelectedTime('custom');
        setCustomTime(habit.time || '');
      }
    }
  }, [habit]);

  if (!habit) return null;

  const handleSave = () => {
    const finalTime = selectedTime === 'custom' ? customTime : selectedTime;
    onSave({
      ...habit,
      title,
      description,
      icon: selectedIcon,
      frequency,
      time: finalTime,
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.modal}>
          <Text style={styles.title}>Update Habit</Text>

          {/* Title */}
          <TextInput
            style={styles.input}
            placeholder="Habit Title"
            value={title}
            onChangeText={setTitle}
          />

          {/* Description */}
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Habit Description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />

          {/* Icon */}
          <Text style={styles.sectionTitle}>🎯 Choose an icon</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconsScrollView}>
            <View style={styles.iconsContainer}>
              {HABIT_ICONS.map(({ key, emoji, label }) => (
                <TouchableOpacity
                  key={key}
                  style={[styles.iconOption, selectedIcon === key && styles.iconOptionSelected]}
                  onPress={() => setSelectedIcon(key)}
                >
                  <Text style={styles.iconEmoji}>{emoji}</Text>
                  <Text style={[styles.iconLabel, selectedIcon === key && styles.iconLabelSelected]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Time */}
          <Text style={styles.sectionTitle}>⏰ When will you do it?</Text>
          <View style={styles.timeContainer}>
            {TIME_SLOTS.map(({ label, value, period }) => (
              <TouchableOpacity
                key={value}
                style={[styles.timeOption, selectedTime === value && styles.timeOptionSelected]}
                onPress={() => setSelectedTime(value)}
              >
                <Text style={[styles.timeLabel, selectedTime === value && styles.timeLabelSelected]}>
                  {label}
                </Text>
                <Text style={[styles.timePeriod, selectedTime === value && styles.timePeriodSelected]}>
                  {period}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {selectedTime === 'custom' && (
            <TextInput
              style={[styles.input, styles.customTimeInput]}
              placeholder="Enter custom time"
              value={customTime}
              onChangeText={setCustomTime}
            />
          )}

          {/* Frequency */}
          <Text style={styles.sectionTitle}>🔄 How often?</Text>
          <View style={styles.frequencyContainer}>
            {FREQUENCY_OPTIONS.map(({ key, label, description }) => (
              <TouchableOpacity
                key={key}
                style={[styles.frequencyOption, frequency === key && styles.frequencyOptionSelected]}
                onPress={() => setFrequency(key)}
              >
                <View style={styles.frequencyContent}>
                  <Text style={[styles.frequencyLabel, frequency === key && styles.frequencyLabelSelected]}>
                    {label}
                  </Text>
                  <Text style={[styles.frequencyDescription, frequency === key && styles.frequencyDescriptionSelected]}>
                    {description}
                  </Text>
                </View>
                <View style={[styles.radioButton, frequency === key && styles.radioButtonSelected]}>
                  {frequency === key && <View style={styles.radioButtonInner} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Buttons */}
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#1E293B',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 6,
    color: '#1E293B',
  },
  iconsScrollView: { marginHorizontal: -4 },
  iconsContainer: { flexDirection: 'row', gap: 12, paddingHorizontal: 4 },
  iconOption: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 70,
  },
  iconOptionSelected: { backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
  iconEmoji: { fontSize: 22, marginBottom: 2 },
  iconLabel: { fontSize: 12, color: '#475569', fontWeight: '600', textAlign: 'center' },
  iconLabelSelected: { color: '#FFFFFF' },
  timeContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  timeOption: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  timeOptionSelected: { backgroundColor: '#EBF4FF', borderColor: '#3B82F6' },
  timeLabel: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 2 },
  timeLabelSelected: { color: '#3B82F6' },
  timePeriod: { fontSize: 12, color: '#64748B' },
  timePeriodSelected: { color: '#3B82F6' },
  customTimeInput: { marginTop: 8 },
  frequencyContainer: { gap: 12 },
  frequencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  frequencyOptionSelected: { backgroundColor: '#EBF4FF', borderColor: '#3B82F6' },
  frequencyContent: { flex: 1 },
  frequencyLabel: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 2 },
  frequencyLabelSelected: { color: '#3B82F6' },
  frequencyDescription: { fontSize: 12, color: '#64748B' },
  frequencyDescriptionSelected: { color: '#3B82F6' },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: { borderColor: '#3B82F6' },
  radioButtonInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#3B82F6' },
  buttons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 16 },
  cancelButton: { paddingVertical: 10, paddingHorizontal: 16 },
  cancelText: { color: '#64748B', fontWeight: '600' },
  saveButton: { backgroundColor: '#3B82F6', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 16 },
  saveText: { color: '#fff', fontWeight: '700' },
});

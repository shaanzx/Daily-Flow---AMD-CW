import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Habit } from '@/types/habit';
import {
  Clock,
  CircleCheck as CheckCircle,
  Circle,
  MoreHorizontal,
} from 'lucide-react-native';

interface HabitCardProps {
  habit: Habit;
  onToggle: (completed: boolean) => void;
  onDelete: () => void;
  onEdit: () => void;
  isCompleted: boolean;
  showFrequency?: boolean;
}

const HABIT_EMOJIS: { [key: string]: string } = {
  reading: '📚',
  exercise: '💪',
  water: '💧',
  sleep: '🛌',
  meditation: '🧘',
  running: '🏃',
  'healthy-food': '🥗',
  study: '📖',
  music: '🎵',
  work: '💼',
  creative: '🎨',
  social: '👥',
};

const FREQUENCY_LABELS: { [key: string]: string } = {
  daily: 'Daily',
  weekdays: 'Weekdays',
  weekends: 'Weekends',
  weekly: 'Weekly',
};

export default function HabitCard({
  habit,
  onToggle,
  onDelete,
  onEdit,
  isCompleted,
  showFrequency = false,
}: HabitCardProps) {
  const habitEmoji = HABIT_EMOJIS[habit.icon] || '⭐';

  const showOptions = () => {
    Alert.alert('Habit Options', `What would you like to do with "${habit.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Edit', onPress: onEdit },
      { text: 'Delete', style: 'destructive', onPress: onDelete },
    ]);
  };

  const formatTime = (time: string) => {
    if (time.includes(':')) {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${displayHour}:${minutes} ${ampm}`;
    }
    return time;
  };

  return (
    <View style={[styles.container, isCompleted && styles.completedContainer]}>
      <View style={styles.innerRow}>
        {/* Left side */}
        <TouchableOpacity
          style={styles.leftRow}
          onPress={() => onToggle(!isCompleted)}
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer, isCompleted && styles.iconContainerCompleted]}>
            <Text style={styles.emoji}>{habitEmoji}</Text>
          </View>

          <View style={styles.textContainer}>
            <Text style={[styles.title, isCompleted && styles.completedTitle]}>{habit.title}</Text>
            {habit.description ? (
              <Text style={[styles.description, isCompleted && styles.completedDescription]}>
                {habit.description}
              </Text>
            ) : null}

            <View style={styles.metaRow}>
              <View style={styles.timeRow}>
                <Clock size={12} color="#64748B" />
                <Text style={styles.time}>{formatTime(habit.time)}</Text>
              </View>
              {showFrequency && (
                <View style={styles.frequencyChip}>
                  <Text style={styles.frequency}>
                    {FREQUENCY_LABELS[habit.frequency] || 'Daily'}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>

        {/* Right side */}
        <View style={styles.rightRow}>
          <TouchableOpacity
            style={styles.optionsButton}
            onPress={showOptions}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MoreHorizontal size={20} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onToggle(!isCompleted)}>
            {isCompleted ? (
              <CheckCircle size={28} color="#10B981" />
            ) : (
              <Circle size={28} color="#CBD5E1" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  completedContainer: {
    opacity: 0.7,
  },
  innerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    marginRight: 12,
  },
  iconContainerCompleted: {
    backgroundColor: '#DCFCE7',
    borderColor: '#10B981',
  },
  emoji: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#64748B',
  },
  description: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  completedDescription: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  time: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  frequencyChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  frequency: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  optionsButton: {
    padding: 4,
  },
});

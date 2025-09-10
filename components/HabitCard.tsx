import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Habit } from '@/types/habit';
import { Clock, CircleCheck as CheckCircle, Circle } from 'lucide-react-native';

interface HabitCardProps {
  habit: Habit;
  onToggle: (completed: boolean) => void;
  isCompleted: boolean;
}

const iconMap: { [key: string]: any } = {
  'book': require('lucide-react-native').BookOpen,
  'dumbbell': require('lucide-react-native').Dumbbell,
  'water': require('lucide-react-native').Droplets,
  'sleep': require('lucide-react-native').Moon,
  'meditation': require('lucide-react-native').Brain,
  'run': require('lucide-react-native').Zap,
  'heart': require('lucide-react-native').Heart,
  'star': require('lucide-react-native').Star,
};

export default function HabitCard({ habit, onToggle, isCompleted }: HabitCardProps) {
  const IconComponent = iconMap[habit.icon] || require('lucide-react-native').Circle;

  return (
    <View style={[styles.container, isCompleted && styles.completedContainer]}>
      <TouchableOpacity
        style={styles.content}
        onPress={() => onToggle(!isCompleted)}
        activeOpacity={0.7}
      >
        <View style={styles.leftSection}>
          <View style={[styles.iconContainer, isCompleted && styles.iconContainerCompleted]}>
            <IconComponent size={20} color={isCompleted ? '#FFFFFF' : '#3B82F6'} />
          </View>
          <View style={styles.textContainer}>
            <Text style={[styles.title, isCompleted && styles.completedTitle]}>
              {habit.title}
            </Text>
            <Text style={[styles.description, isCompleted && styles.completedDescription]}>
              {habit.description}
            </Text>
            <View style={styles.timeContainer}>
              <Clock size={12} color="#64748B" />
              <Text style={styles.time}>{habit.time}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.checkContainer}>
          {isCompleted ? (
            <CheckCircle size={28} color="#10B981" />
          ) : (
            <Circle size={28} color="#CBD5E1" />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  completedContainer: {
    opacity: 0.8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerCompleted: {
    backgroundColor: '#10B981',
  },
  textContainer: {
    flex: 1,
    gap: 4,
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
  },
  completedDescription: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  time: {
    fontSize: 12,
    color: '#64748B',
  },
  checkContainer: {
    marginLeft: 12,
  },
});
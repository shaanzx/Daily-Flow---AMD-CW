import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Habit } from '@/types/habit';
import { Clock, CircleCheck as CheckCircle, Circle, Edit3, Trash2, MoreHorizontal } from 'lucide-react-native';
import { BookOpen, Dumbbell, Droplets, Moon, Brain, Zap, Heart, Star } from 'lucide-react-native';

interface HabitCardProps {
  habit: Habit;
  onToggle: (completed: boolean) => void;
  onDelete: () => void;
  onEdit: () => void;
  isCompleted: boolean;
}

const iconMap: { [key: string]: any } = {
  'book': BookOpen,
  'dumbbell': Dumbbell,
  'water': Droplets,
  'sleep': Moon,
  'meditation': Brain,
  'run': Zap,
  'heart': Heart,
  'star': Star,
};

export default function HabitCard({ habit, onToggle, onDelete, onEdit, isCompleted }: HabitCardProps) {
  const IconComponent = iconMap[habit.icon] || Star;

  const showOptions = () => {
    Alert.alert(
      'Habit Options',
      'What would you like to do?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Edit', onPress: onEdit },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ]
    );
  };

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
        
        <View style={styles.rightSection}>
          <TouchableOpacity
            style={styles.optionsButton}
            onPress={showOptions}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MoreHorizontal size={20} color="#94A3B8" />
          </TouchableOpacity>
          
          <View style={styles.checkContainer}>
            {isCompleted ? (
              <CheckCircle size={28} color="#10B981" />
            ) : (
              <Circle size={28} color="#CBD5E1" />
            )}
          </View>
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
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  rightSection: {
    alignItems: 'center',
    gap: 8,
  },
  optionsButton: {
    padding: 4,
  },
  checkContainer: {
    marginLeft: 8,
  },
});
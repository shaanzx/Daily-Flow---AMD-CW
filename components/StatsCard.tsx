import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface StatsCardProps {
  title: string;
  value: string;
  percentage: number;
  icon: LucideIcon;
  color: string;
}

export default function StatsCard({ title, value, percentage, icon: Icon, color }: StatsCardProps) {
  return (
    <View style={[styles.container, { borderLeftColor: color }]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
          <Icon size={20} color={color} />
        </View>
        <Text style={styles.percentage}>{percentage}%</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${percentage}%`, backgroundColor: color }
          ]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    minWidth: 160,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  value: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#F1F5F9',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
});
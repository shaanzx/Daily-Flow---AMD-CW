import React from 'react';
import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View, TouchableOpacity, Animated } from 'react-native';
import { Home, ArrowLeft, Target } from 'lucide-react-native';
import { useEffect, useRef } from 'react';

export default function NotFoundScreen() {
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -10,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <>
      <Stack.Screen options={{ 
        title: 'Page Not Found',
        headerShown: false 
      }} />
      <View style={styles.container}>
        <Animated.View 
          style={[
            styles.content,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: bounceAnim }]
            }
          ]}
        >
          <Animated.View style={styles.emojiContainer}>
            <Text style={styles.emoji}>🎯</Text>
          </Animated.View>

          <Text style={styles.errorCode}>404</Text>
          
          <Text style={styles.title}>Oops! Page Not Found</Text>
          <Text style={styles.subtitle}>
            Looks like this habit got lost! 🤔{'\n'}
            Don't worry, let's get you back on track.
          </Text>

          <View style={styles.motivationContainer}>
            <Target size={20} color="#3B82F6" />
            <Text style={styles.motivationText}>
              "Every mistake is a step towards building better habits!"
            </Text>
          </View>

          <View style={styles.buttonsContainer}>
            <Link href="/(tabs)" asChild>
              <TouchableOpacity style={styles.primaryButton}>
                <Home size={20} color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Go to Home</Text>
              </TouchableOpacity>
            </Link>

            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => {
                if (typeof window !== 'undefined' && window.history?.length > 1) {
                  window.history.back();
                } else {
                }
              }}
            >
              <ArrowLeft size={20} color="#3B82F6" />
              <Text style={styles.secondaryButtonText}>Go Back</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Habits Found</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>∞</Text>
              <Text style={styles.statLabel}>Possibilities</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>1</Text>
              <Text style={styles.statLabel}>Way Forward</Text>
            </View>
          </View>
        </Animated.View>

        {/* Background Decoration */}
        <View style={styles.backgroundDecoration}>
          <View style={[styles.circle, styles.circle1]} />
          <View style={[styles.circle, styles.circle2]} />
          <View style={[styles.circle, styles.circle3]} />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    position: 'relative',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    zIndex: 1,
  },
  emojiContainer: {
    marginBottom: 24,
  },
  emoji: {
    fontSize: 80,
    textAlign: 'center',
  },
  errorCode: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 16,
    textShadowColor: '#3B82F620',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  motivationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 32,
    gap: 8,
  },
  motivationText: {
    fontSize: 14,
    color: '#3B82F6',
    fontStyle: 'italic',
    fontWeight: '500',
    flex: 1,
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
    marginBottom: 32,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#3B82F6',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryButtonText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 16,
  },
  backgroundDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.1,
  },
  circle1: {
    width: 200,
    height: 200,
    backgroundColor: '#3B82F6',
    top: -100,
    right: -100,
  },
  circle2: {
    width: 150,
    height: 150,
    backgroundColor: '#10B981',
    bottom: -75,
    left: -75,
  },
  circle3: {
    width: 100,
    height: 100,
    backgroundColor: '#F59E0B',
    top: '40%',
    left: -50,
  },
});
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import axios from 'axios';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const HF_API_KEY = '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'; 

//Model
const HF_MODEL = 'gpt2-medium'; 
interface Message {
  id: string;
  text: string;
  isUser: boolean;
}

interface HFResponseItem {
  generated_text?: string;
  error?: string;
}

type HFResponse = HFResponseItem[];

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  const buttonScale = useSharedValue(1);
  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleButtonPressIn = () => {
    buttonScale.value = withTiming(0.95, { duration: 100 });
  };

  const handleButtonPressOut = () => {
    buttonScale.value = withTiming(1, { duration: 100 });
  };

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await axios.post<HFResponse>(
        `https://api-inference.huggingface.co/models/${HF_MODEL}`,
        { inputs: inputText },
        { 
          headers: { 
            Authorization: `Bearer ${HF_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000 
        }
      );

      let aiText = 'Sorry, I could not generate a response.';
      
      if (response.data && response.data.length > 0) {
        const responseItem = response.data[0];
        
        if (responseItem.generated_text) {
          aiText = responseItem.generated_text.trim();
          aiText = aiText.replace(inputText, '').trim();
        } else if (responseItem.error) {
          aiText = `Error: ${responseItem.error}`;
        }
      }

      const aiMessage: Message = {
        id: Date.now().toString(),
        text: aiText,
        isUser: false,
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      console.error('Chat error:', error.message || error);
      
      let errorMessage = 'Sorry, something went wrong. Please try again.';
      
      if (error.response?.status === 404) {
        errorMessage = 'Model not found. Please check the model name.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please check your API key.';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timeout. Please try again.';
      }

      const errorMessageObj: Message = {
        id: Date.now().toString(),
        text: errorMessage,
        isUser: false,
      };
      setMessages(prev => [...prev, errorMessageObj]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageContainer, item.isUser ? styles.userMessage : styles.aiMessage]}>
      <Text style={item.isUser ? styles.userText : styles.aiText}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <LinearGradient colors={['#1A1A1A', '#1A1A1A']} style={{ flex: 1 }}>
        <View style={styles.container}>
          <Text style={styles.title}>Habit Coach Chat</Text>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
          />
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Ask about habits, tips, or reminders..."
              value={inputText}
              onChangeText={setInputText}
              style={styles.textInput}
              placeholderTextColor="#9CA3AF"
              onSubmitEditing={sendMessage}
              returnKeyType="send"
            />
            <Animated.View style={animatedButtonStyle}>
              <TouchableOpacity
                onPress={sendMessage}
                onPressIn={handleButtonPressIn}
                onPressOut={handleButtonPressOut}
                disabled={isLoading}
                style={styles.sendButton}
              >
                {isLoading ? (
                  <ActivityIndicator color="#6B7280" size="small" />
                ) : (
                  <Feather name="send" size={24} color="#6B7280" />
                )}
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    margin: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 16, color: 'black' },
  messageContainer: { marginBottom: 12, padding: 12, borderRadius: 12, maxWidth: '80%' },
  userMessage: { backgroundColor: '#6B7280', alignSelf: 'flex-end' },
  aiMessage: { backgroundColor: '#E5E7EB', alignSelf: 'flex-start' },
  userText: { color: 'white' },
  aiText: { color: 'black' },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F3F4F6', 
    borderRadius: 12, 
    paddingHorizontal: 12, 
    paddingVertical: 8 
  },
  textInput: { 
    flex: 1, 
    color: '#111827', 
    paddingVertical: 6, 
    paddingHorizontal: 8 
  },
  sendButton: {
    padding: 8,
  },
});

export default ChatScreen;
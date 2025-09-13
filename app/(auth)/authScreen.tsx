// AuthScreen.tsx
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
  Switch,
  Modal,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

// Firebase imports
import { auth } from "@/config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";

const AuthScreen = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [cPassword, setCPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);

  // Password reset modal states
  const [resetModalVisible, setResetModalVisible] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>("");
  const [isResetLoading, setIsResetLoading] = useState<boolean>(false);

  // Animation values
  const inputScale = useSharedValue(1);
  const buttonScale = useSharedValue(1);

  const animatedInputStyle = useAnimatedStyle(() => ({
    transform: [{ scale: inputScale.value }],
  }));

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleInputFocus = () => {
    inputScale.value = withTiming(1.02, { duration: 200 });
  };

  const handleInputBlur = () => {
    inputScale.value = withTiming(1, { duration: 200 });
  };

  const handleButtonPressIn = () => {
    buttonScale.value = withTiming(0.95, { duration: 100 });
  };

  const handleButtonPressOut = () => {
    buttonScale.value = withTiming(1, { duration: 100 });
  };

  // Auth handlers (login/register)
  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (!isLogin && password !== cPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        Alert.alert("Success", "Logged in successfully!");
        router.push("/(tabs)");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        Alert.alert("Success", "Registration successful! Please log in.");
        setIsLogin(true);
      }
    } catch (err: any) {
      console.error(err);
      let message = "Something went wrong. Please try again.";

      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        message = "Invalid credentials. Please check your email and password.";
      } else if (err.code === "auth/email-already-in-use") {
        message = "This email is already in use. Please log in instead.";
      } else if (err.code === "auth/weak-password") {
        message = "Password should be at least 6 characters long.";
      } else if (err.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      }

      Alert.alert("Failed", message);
    } finally {
      setIsLoading(false);
    }
  };

  // Password reset function
  const handlePasswordReset = async () => {
    if (!resetEmail) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }
    setIsResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      Alert.alert(
        "Success",
        "Password reset email sent. Please check your inbox (and spam)."
      );
      setResetModalVisible(false);
      setResetEmail("");
    } catch (err: any) {
      console.error(err);
      let message = "Something went wrong. Please try again.";

      if (err.code === "auth/user-not-found") {
        message = "No user found with this email address.";
      } else if (err.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      } else if (err.code === "auth/too-many-requests") {
        message = "Too many requests. Try again later.";
      }
      Alert.alert("Failed", message);
    } finally {
      setIsResetLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <LinearGradient
        colors={["#1A1A1A", "#1A1A1A"]}
        className="flex-1 justify-center px-6"
      >
        <View className="bg-white rounded-xl p-6 shadow-lg max-w-md w-full mx-auto h-full justify-center gap-3">
          <Text className="text-2xl font-bold text-center text-black mb-20">
            Go ahead and set up your account
          </Text>
          <Text className="text-center text-gray-600 mb-6">
            Sign in/up to enjoy the best managing experience
          </Text>

          {/* Login/Register Toggle */}
          <View className="flex-row justify-around mb-6">
            <TouchableOpacity
              onPress={() => setIsLogin(true)}
              className={`flex-1 p-2 rounded-l-lg ${
                isLogin ? "bg-gray-200" : "bg-gray-100"
              }`}
            >
              <Text className="text-center text-gray-800 font-medium">Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsLogin(false)}
              className={`flex-1 p-2 rounded-r-lg ${
                !isLogin ? "bg-gray-200" : "bg-gray-100"
              }`}
            >
              <Text className="text-center text-gray-800 font-medium">Register</Text>
            </TouchableOpacity>
          </View>

          {/* Email Input */}
          <Animated.View style={animatedInputStyle} className="mb-4">
            <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
              <Feather name="mail" size={20} color="#6B7280" />
              <TextInput
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                className="flex-1 ml-2 text-gray-800"
                placeholderTextColor="#9CA3AF"
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </View>
          </Animated.View>

          {/* Password Input */}
          <Animated.View style={animatedInputStyle} className="mb-4">
            <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
              <Feather name="lock" size={20} color="#6B7280" />
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                className="flex-1 ml-2 text-gray-800"
                placeholderTextColor="#9CA3AF"
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Feather
                  name={showPassword ? "eye" : "eye-off"}
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>
            </View>
          </Animated.View>

          {!isLogin && (
            <Animated.View style={animatedInputStyle} className="mb-4">
              <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
                <Feather name="lock" size={20} color="#6B7280" />
                <TextInput
                  placeholder="Confirm Password"
                  value={cPassword}
                  onChangeText={setCPassword}
                  secureTextEntry={!showPassword}
                  className="flex-1 ml-2 text-gray-800"
                  placeholderTextColor="#9CA3AF"
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                />
              </View>
            </Animated.View>
          )}

          {/* Remember Me and Forgot Password */}
          <View className="flex-row justify-between mb-4">
            <View className="flex-row items-center">
              <Switch
                value={rememberMe}
                onValueChange={setRememberMe}
                trackColor={{ false: "#D1D5DB", true: "#6B7280" }}
                thumbColor={rememberMe ? "#FFF" : "#FFF"}
              />
              <Text className="ml-2 text-gray-800">Remember me</Text>
            </View>
            <TouchableOpacity onPress={() => setResetModalVisible(true)}>
              <Text className="text-blue-600">Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Login/Register Button */}
          <Animated.View style={animatedButtonStyle}>
            <TouchableOpacity
              onPress={handleAuth}
              onPressIn={handleButtonPressIn}
              onPressOut={handleButtonPressOut}
              disabled={isLoading}
              className={`rounded-lg p-3 ${
                isLoading ? "bg-gray-400" : "bg-[#6B7280]"
              }`}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text className="text-center text-white font-semibold text-lg">
                  {isLogin ? "Login" : "Register"}
                </Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Social Login (kept as-is) */}
          <View className="mt-6">
            <Text className="text-center text-gray-600 mb-4">Or login with</Text>
            <View className="flex-row justify-around">
              <TouchableOpacity
                onPress={() => Alert.alert("Google Login", "Feature not implemented yet.")}
                className="p-2 bg-white rounded-full shadow"
              >
                <Image source={{ uri: "https://www.google.com/favicon.ico" }} className="w-8 h-8" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => Alert.alert("Facebook Login", "Feature not implemented yet.")}
                className="p-2 bg-white rounded-full shadow"
              >
                <Image source={{ uri: "https://facebook.com/favicon.ico" }} className="w-8 h-8" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Password Reset Modal */}
        <Modal
          visible={resetModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setResetModalVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 justify-center items-center px-6"
          >
            <View className="w-full max-w-md bg-white rounded-xl p-6 shadow-lg">
              <Text className="text-xl font-semibold mb-3">Reset Password</Text>
              <Text className="text-gray-600 mb-4">
                Enter your email and we'll send a password reset link.
              </Text>

              <View className="mb-4">
                <View className="flex-row items-center bg-gray-100 rounded-lg px-4 py-3">
                  <Feather name="mail" size={20} color="#6B7280" />
                  <TextInput
                    placeholder="Email Address"
                    value={resetEmail}
                    onChangeText={setResetEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="flex-1 ml-2 text-gray-800"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              <View className="flex-row justify-between">
                <TouchableOpacity
                  onPress={() => {
                    setResetModalVisible(false);
                    setResetEmail("");
                  }}
                  className="px-4 py-2 rounded-lg bg-gray-200"
                >
                  <Text>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handlePasswordReset}
                  disabled={isResetLoading}
                  className="px-4 py-2 rounded-lg bg-[#6B7280]"
                >
                  {isResetLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-white">Send Reset Email</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default AuthScreen;

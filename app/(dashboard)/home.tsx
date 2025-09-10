import { router } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";

export default function HomeScreen() {
  const handleLogout = () => {
    router.push("/(auth)/authScreen");
    Alert.alert("Logged Out", "You have been logged out successfully!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Home</Text>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Go to Chat</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonOutline}>
        <Text style={styles.buttonOutlineText}>Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 30 },
  button: { width: "100%", padding: 15, borderRadius: 8, backgroundColor: "#0b74ff", marginBottom: 15, alignItems: "center" },
  buttonText: { color: "white", fontSize: 16, fontWeight: "600" },
  buttonOutline: { width: "100%", padding: 15, borderRadius: 8, borderWidth: 1, borderColor: "#0b74ff", marginBottom: 15, alignItems: "center" },
  buttonOutlineText: { color: "#0b74ff", fontSize: 16, fontWeight: "600" },
  logoutButton: { width: "100%", padding: 15, borderRadius: 8, backgroundColor: "#ff3b30", alignItems: "center" },
  logoutButtonText: { color: "white", fontSize: 16, fontWeight: "700" }
});

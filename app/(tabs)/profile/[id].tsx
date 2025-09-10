// app/profile/[id].tsx
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator } from "react-native";
import { getUser } from "@/services/userService";
import { UserProfile } from "@/types/user";
import React from "react";

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getUser(id);
      setUser(data as UserProfile);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return <ActivityIndicator size="large" />;

  if (!user) return <Text>No user found</Text>;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {user.photoURL && (
        <Image
          source={{ uri: user.photoURL }}
          style={{ width: 120, height: 120, borderRadius: 60 }}
        />
      )}
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>
        {user.displayName || "No Name"}
      </Text>
      <Text>{user.email}</Text>
    </View>
  );
}

import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import "../global.css";

export default function StartPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.replace("/(app)/home");
      } else {
        router.replace("/signin");
      }
    }
  }, [loading, isAuthenticated, router]);

  return (
    <View className="flex-1 items-center justify-center bg-black">
      <ActivityIndicator color="red" size="large" />
    </View>
  );
}
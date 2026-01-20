import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import "../global.css";

export default function SignIn() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await login(email, password);
      router.replace("/(app)/home");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />
      
      <View className="flex-1 items-center justify-center px-6">
        {/* Title */}
        <Text className="mb-12 text-3xl font-bold text-white">Welcome Back</Text>

        {/* Email Input */}
        <TextInput
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          className="mb-4 w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 text-white"
          keyboardType="email-address"
        />

        {/* Password Input */}
        <TextInput
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="mb-8 w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 text-white"
        />

        {/* Error Message */}
        {error ? (
          <Text className="mb-4 text-center text-red-500">{error}</Text>
        ) : null}

        {/* Sign In Button */}
        <TouchableOpacity
          onPress={handleSignIn}
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 py-3"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-center text-lg font-bold text-white">Sign In</Text>
          )}
        </TouchableOpacity>

        {/* Sign Up Link */}
        <View className="mt-6 flex-row justify-center">
          <Text className="text-gray-400">{`Don't`} have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text className="font-bold text-blue-400">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

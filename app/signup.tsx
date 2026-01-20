import { useAuth } from "@/context/authContext";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import "../global.css";

export default function SignUp() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await register(email, password, name);
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
        <Text className="mb-8 text-2xl font-bold text-white">Create Account</Text>
        <TextInput
          placeholder="Full Name"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
          className="mb-4 w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 text-white"
        />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          className="mb-4 w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 text-white"
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          className="mb-4 w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 text-white"
        />
        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor="#999"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          className="mb-8 w-full rounded-lg border border-gray-600 bg-gray-800 px-4 py-3 text-white"
        />

        {/* Error Message */}
        {error ? (
          <Text className="mb-4 text-center text-red-500">{error}</Text>
        ) : null}

        <TouchableOpacity
          onPress={handleSignUp}
          disabled={loading}
          className="w-full rounded-lg bg-green-600 py-3"
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-center text-lg font-bold text-white">Sign Up</Text>
          )}
        </TouchableOpacity>

        {/* Back to Sign In */}
        <View className="mt-6 flex-row justify-center">
          <Text className="text-gray-400">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="font-bold text-blue-400">Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

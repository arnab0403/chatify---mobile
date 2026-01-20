import { useAuth } from "@/context/authContext";
import { User, useUsers } from "@/hooks/useUsers";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import "../../global.css";

export default function Home() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { users, loading, error } = useUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  useEffect(() => {
    setFilteredUsers(users.filter((u: any) => u.uid !== user?.uid)); // Exclude current user
  }, [users, user?.uid]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim()) {
      const filtered = users.filter(
        (u: any) =>
          u.uid !== user?.uid &&
          u.displayName.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users.filter((u: any) => u.uid !== user?.uid));
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.replace("/signin");
    } catch (error: any) {
      console.error("Logout error:", error);
    }
  };

  const handleUserPress = (userData: any) => {
    router.push({
      pathname: "/(app)/chat",
      params: {
        id: userData.uid,
        name: userData.displayName,
      },
    });
  };

  const renderUserItem = ({ item }: any) => (
    <TouchableOpacity
      className="border-b border-gray-700"
      onPress={() => handleUserPress(item)}
    >
      <View className="flex-row items-center gap-3 px-4 py-3">
        <View className="h-12 w-12 items-center justify-center rounded-full bg-blue-600">
          <Text className="text-sm font-bold text-white">
            {item.displayName.charAt(0).toUpperCase()}
          </Text>
        </View>

        <View className="flex-1">
          <View className="flex-row justify-between">
            <Text className="text-base font-semibold text-white">
              {item.displayName}
            </Text>
            <View className={`h-2 w-2 rounded-full ${item.status === "online" ? "bg-green-500" : "bg-gray-500"}`} />
          </View>
          <Text className="mt-1 text-sm text-gray-400" numberOfLines={1}>
            {item.email}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />

      {/* Header with Notch Padding */}
      <View style={{ paddingTop: insets.top }} className="bg-gray-900 px-4 py-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-xl font-bold text-white">Chats</Text>
          </View>
          <View className="flex-row gap-3">
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-gray-800">
              <MaterialIcons name="add" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleLogout}
              className="h-10 w-10 items-center justify-center rounded-full bg-gray-800"
            >
              <MaterialIcons name="logout" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View className="mt-4 flex-row items-center gap-2 rounded-lg bg-gray-800 px-3 py-2">
          <MaterialIcons name="search" size={20} color="#999" />
          <TextInput
            placeholder="Search chats..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearch}
            className="flex-1 text-white"
          />
        </View>

        {/* User Info */}
        <View className="mt-4 flex-row items-center gap-2">
          <View className="h-8 w-8 items-center justify-center rounded-full bg-blue-500">
            <Text className="text-sm font-bold text-white">
              {user?.displayName?.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text className="text-sm text-gray-300">
            {user?.displayName || "User"}
          </Text>
        </View>
      </View>

      {/* Users List */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="mt-4 text-gray-400">Loading users...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center">
          <MaterialIcons name="error-outline" size={48} color="#ef4444" />
          <Text className="mt-4 text-center text-red-400">{error}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.uid}
          scrollEnabled={true}
          className="flex-1"
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center">
              <MaterialIcons name="people-outline" size={48} color="#666" />
              <Text className="mt-4 text-center text-gray-400">
                {searchQuery ? "No users found" : "No users available"}
              </Text>
            </View>
          }
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-blue-500 shadow-lg">
        <MaterialIcons name="edit" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}
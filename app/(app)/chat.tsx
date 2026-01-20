import { useAuth } from "@/context/authContext";
import { useMessages } from "@/hooks/useMessages";
import { generateConversationId } from "@/services/messageService";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import "../../global.css";

export default function Chat() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const params = useLocalSearchParams();
  
  const otherUserId = (Array.isArray(params.id) ? params.id[0] : params.id) || "";
  const otherUserName = (Array.isArray(params.name) ? params.name[0] : params.name) || "User";
  const conversationId = generateConversationId(user?.uid || "", otherUserId);

  const { messages, loading, error, sendMessage } = useMessages({
    conversationId,
    senderId: user?.uid,
    senderName: user?.displayName || user?.email || "Anonymous",
  });

  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendMessage = async () => {
    if (!messageText.trim() || sending) return;

    setSending(true);
    const success = await sendMessage(messageText);
    if (success) {
      setMessageText("");
    }
    setSending(false);
  };

  const renderMessage = ({ item }: any) => {
    const isOwnMessage = item.senderId === user?.uid;
    const timestamp = new Date(item.timestamp || 0);
    const timeString = timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <View
        className={`mb-3 flex-row ${
          isOwnMessage ? "justify-end" : "justify-start"
        } px-4`}
      >
        <View
          className={`max-w-xs rounded-lg px-4 py-2 ${
            isOwnMessage ? "bg-blue-600" : "bg-gray-700"
          }`}
        >
          {!isOwnMessage && (
            <Text className="mb-1 text-xs font-semibold text-gray-300">
              {item.senderName}
            </Text>
          )}
          <Text className={`text-sm ${isOwnMessage ? "text-white" : "text-gray-200"}`}>
            {item.text}
          </Text>
          <Text className={`mt-1 text-xs ${isOwnMessage ? "text-blue-200" : "text-gray-400"}`}>
            {timeString}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />

      {/* Header */}
      <View
        style={{ paddingTop: insets.top }}
        className="border-b border-gray-800 bg-gray-900 px-4 py-3"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity onPress={() => router.back()}>
              <MaterialIcons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-600">
              <Text className="text-sm font-bold text-white">
                {otherUserName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View>
              <Text className="text-base font-semibold text-white">
                {otherUserName}
              </Text>
              <Text className="text-xs text-gray-400">Active now</Text>
            </View>
          </View>
          <TouchableOpacity>
            <MaterialIcons name="call" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <View className="flex-1">
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="mt-2 text-gray-400">Loading messages...</Text>
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center">
            <MaterialIcons name="error-outline" size={48} color="#ef4444" />
            <Text className="mt-2 text-center text-gray-400">{error}</Text>
          </View>
        ) : (
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingVertical: 12 }}
            inverted={false}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center pt-20">
                <MaterialIcons name="chat-bubble-outline" size={48} color="#666" />
                <Text className="mt-4 text-center text-gray-400">
                  Start a conversation!
                </Text>
              </View>
            }
          />
        )}
      </View>

      {/* Message Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View className="border-t border-gray-800 bg-gray-900 px-4 py-3">
          <View className="flex-row items-center gap-2">
            <TextInput
              placeholder="Type a message..."
              placeholderTextColor="#999"
              value={messageText}
              onChangeText={setMessageText}
              className="flex-1 rounded-lg bg-gray-800 px-4 py-3 text-white"
              multiline
              maxLength={500}
              editable={!sending}
            />
            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={!messageText.trim() || sending}
              className="h-10 w-10 items-center justify-center rounded-full bg-blue-600"
            >
              {sending ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <MaterialIcons
                  name="send"
                  size={20}
                  color={messageText.trim() ? "white" : "#999"}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

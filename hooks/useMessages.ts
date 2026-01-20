import { sendMessage, subscribeToMessages } from "@/services/messageService";
import { Message } from "@/types/index";
import { useEffect, useState } from "react";

interface UseMessagesOptions {
  conversationId: string;
  senderId?: string;
  senderName?: string;
}

export const useMessages = ({
  conversationId,
  senderId,
  senderName,
}: UseMessagesOptions) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Subscribe to real-time messages
  useEffect(() => {
    if (!conversationId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToMessages(
      conversationId,
      (newMessages) => {
        setMessages(newMessages);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [conversationId]);

  // Send a message
  const handleSendMessage = async (text: string): Promise<boolean> => {
    if (!text.trim() || !senderId || !senderName) {
      return false;
    }

    try {
      await sendMessage(conversationId, senderId, senderName, text);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
      return false;
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage: handleSendMessage,
  };
};

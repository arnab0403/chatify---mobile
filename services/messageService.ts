import { db } from "@/firebaseConfig";
import { Conversation, Message } from "@/types/index";
import { addDoc, collection, onSnapshot, query, serverTimestamp, where } from "firebase/firestore";

// Get or create conversation ID from two user IDs
export const generateConversationId = (userId1: string, userId2: string): string => {
  return [userId1, userId2].sort().join("_");
};

// Subscribe to real-time messages for a conversation
export const subscribeToMessages = (
  conversationId: string,
  callback: (messages: Message[]) => void,
  onError?: (error: Error) => void
): (() => void) => {
  const messagesRef = collection(db, "messages");
  const q = query(
    messagesRef,
    where("conversationId", "==", conversationId)
  );

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const messages: Message[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        messages.push({
          id: doc.id,
          conversationId: data.conversationId,
          senderId: data.senderId,
          senderName: data.senderName,
          text: data.text,
          timestamp: data.timestamp?.toMillis?.() || data.timestamp || 0,
          createdAt: data.createdAt?.toDate?.() || new Date(),
        });
      });
      // Sort by timestamp in ascending order
      messages.sort((a, b) => a.timestamp - b.timestamp);
      callback(messages);
    },
    (error) => {
      console.error("Error subscribing to messages:", error);
      if (onError) onError(error);
    }
  );

  return unsubscribe;
};

// Send a new message
export const sendMessage = async (
  conversationId: string,
  senderId: string,
  senderName: string,
  text: string
): Promise<string> => {
  try {
    const messagesRef = collection(db, "messages");
    const docRef = await addDoc(messagesRef, {
      conversationId,
      senderId,
      senderName,
      text,
      timestamp: serverTimestamp(),
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

// Subscribe to conversation updates
export const subscribeToConversation = (
  conversationId: string,
  callback: (conversation: Conversation | null) => void
): (() => void) => {
  const conversationsRef = collection(db, "conversations");
  const q = query(conversationsRef, where("id", "==", conversationId));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    if (snapshot.empty) {
      callback(null);
    } else {
      const doc = snapshot.docs[0];
      const data = doc.data() as Conversation;
      callback(data);
    }
  });

  return unsubscribe;
};

/**
 * Sample Firestore Database Structure
 * 
 * This shows the expected structure of collections and documents
 * in your Firestore database for the chat functionality to work.
 */

// ============================================
// MESSAGES COLLECTION
// ============================================
// Path: /messages/{messageId}
{
  conversationId: "user1_user2",  // Sorted user IDs joined with underscore
  senderId: "user1_uid",           // Firebase Auth UID of sender
  senderName: "John Doe",          // Display name of sender
  text: "Hello! How are you?",     // Message content
  timestamp: Timestamp(1705779600, 0),  // Server-generated timestamp
  createdAt: Timestamp(1705779600, 0)   // Creation timestamp
}

// Example Multiple Messages:
// /messages/msg_001
{
  conversationId: "fP21oVwQX6cXOOQVolMdukRhwDY2_5S36eKbKjFeNDu6uwhHcweW0zz93",
  senderId: "fP21oVwQX6cXOOQVolMdukRhwDY2",
  senderName: "Alice",
  text: "Hi there!",
  timestamp: Timestamp,
  createdAt: Timestamp
}

// /messages/msg_002
{
  conversationId: "fP21oVwQX6cXOOQVolMdukRhwDY2_5S36eKbKjFeNDu6uwhHcweW0zz93",
  senderId: "5S36eKbKjFeNDu6uwhHcweW0zz93",
  senderName: "Bob",
  text: "Hey Alice! What's up?",
  timestamp: Timestamp,
  createdAt: Timestamp
}

// ============================================
// CONVERSATIONS COLLECTION (Optional)
// ============================================
// Path: /conversations/{conversationId}
{
  id: "user1_user2",                    // Unique conversation ID
  participants: ["user1_uid", "user2_uid"],  // Array of participant UIDs
  participantNames: {
    "user1_uid": "John Doe",
    "user2_uid": "Jane Smith"
  },
  lastMessage: "See you tomorrow!",      // Last message preview
  lastMessageTimestamp: 1705779700,      // Last message time
  createdAt: 1705779600,                 // Conversation creation time
  updatedAt: 1705779700                  // Last update time
}

// ============================================
// USERS COLLECTION (Optional but recommended)
// ============================================
// Path: /users/{userId}
{
  uid: "user1_uid",
  email: "john@example.com",
  displayName: "John Doe",
  photoURL: "https://...",
  status: "online",  // "online" | "offline"
  lastSeen: Timestamp,
  createdAt: Timestamp,
  updatedAt: Timestamp
}

// ============================================
// QUERIES USED IN THE APP
// ============================================

// Get all messages for a conversation (sorted by timestamp)
db.collection("messages")
  .where("conversationId", "==", "user1_user2")
  .orderBy("timestamp", "asc")
  .onSnapshot(callback)

// Get single conversation
db.collection("conversations")
  .where("id", "==", "user1_user2")
  .onSnapshot(callback)

// Get user's conversations
db.collection("conversations")
  .where("participants", "array-contains", "user1_uid")
  .orderBy("updatedAt", "desc")
  .onSnapshot(callback)

// ============================================
// FIRESTORE INDEXES NEEDED
// ============================================

// Index 1: Messages by Conversation
Collection: messages
Fields: conversationId (Ascending), timestamp (Ascending)

// Index 2: Conversations by Participant
Collection: conversations
Fields: participants (Arrays), updatedAt (Descending)

// Note: Firestore usually creates these automatically when you run queries
// If you get index errors, click the link in the error to create them

// ============================================
// FIRESTORE RULES
// ============================================

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Messages collection
    match /messages/{messageId} {
      // Users can read messages in their conversations
      allow read: if request.auth != null && 
        request.auth.uid in resource.data.participantIds;
      
      // Users can only create their own messages
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.senderId;
      
      // Messages cannot be edited
      allow update: if false;
      
      // Users can only delete their own messages
      allow delete: if request.auth.uid == resource.data.senderId;
    }

    // Conversations collection
    match /conversations/{conversationId} {
      // Users can read conversations they're part of
      allow read: if request.auth != null && 
        request.auth.uid in resource.data.participants;
      
      // Users can create conversations
      allow create: if request.auth != null;
      
      // Users can update conversations they're part of
      allow update: if request.auth != null && 
        request.auth.uid in resource.data.participants;
      
      // Conversations cannot be deleted
      allow delete: if false;
    }

    // Users collection
    match /users/{userId} {
      // Anyone authenticated can read users
      allow read: if request.auth != null;
      
      // Users can only edit their own profile
      allow write: if request.auth.uid == userId;
    }
  }
}

// ============================================
// TYPESCRIPT TYPES
// ============================================

interface Message {
  id: string;                    // Document ID
  conversationId: string;        // Conversation ID
  senderId: string;              // Sender's UID
  senderName: string;            // Sender's display name
  text: string;                  // Message content
  timestamp: number;             // Milliseconds since epoch
  createdAt?: Date;              // JavaScript Date object
}

interface Conversation {
  id: string;                         // Conversation ID
  participants: string[];             // Array of user UIDs
  participantNames: { [key: string]: string }; // Map of UID to names
  lastMessage: string;                // Last message text
  lastMessageTimestamp: number;       // Timestamp of last message
  createdAt: number;                  // Creation timestamp
  updatedAt: number;                  // Last update timestamp
}

// ============================================
// EXAMPLE: SENDING A MESSAGE
// ============================================

// This is what happens when you call sendMessage()
await db.collection("messages").add({
  conversationId: "user1_user2",
  senderId: "user1_uid",
  senderName: "John Doe",
  text: "Hello, world!",
  timestamp: FieldValue.serverTimestamp(),  // Firestore sets this
  createdAt: FieldValue.serverTimestamp()
});

// The onSnapshot listener will immediately receive this new document
// and update the messages array in the component state

// ============================================
// EXAMPLE: FIREBASE CONSOLE STRUCTURE
// ============================================
/*
Firestore
├── messages (collection)
│   ├── msg_001 (document)
│   ├── msg_002 (document)
│   └── msg_003 (document)
├── conversations (collection)
│   ├── user1_user2 (document)
│   └── user1_user3 (document)
└── users (collection)
    ├── user1_uid (document)
    └── user2_uid (document)
*/

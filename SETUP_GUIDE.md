// Quick Start Guide for Real-Time Chat

## What Was Created?

### 1. Types (`types/index.ts`)
- `Message` - Individual chat message structure
- `Conversation` - Conversation metadata structure

### 2. Message Service (`services/messageService.ts`)
- `generateConversationId()` - Creates consistent conversation IDs
- `subscribeToMessages()` - Real-time message listener (Firebase onSnapshot)
- `sendMessage()` - Send a new message to Firestore
- `subscribeToConversation()` - Listen to conversation updates

### 3. Custom Hook (`hooks/useMessages.ts`)
- `useMessages()` - React hook that manages:
  - Real-time message subscription
  - Sending messages
  - Loading and error states
  - Automatic cleanup on unmount

### 4. Updated Chat Screen (`app/(app)/chat.tsx`)
- Integrated real-time messaging
- Loading states with ActivityIndicator
- Error handling
- Sender information displayed
- Optimistic UI updates

## How It Works

1. **User sends message**
   - `handleSendMessage()` validates input
   - Calls `sendMessage()` from the hook
   - Message is sent to Firestore with server timestamp

2. **Firebase Firestore receives message**
   - Document is created in `messages` collection
   - Firestore triggers all active listeners

3. **Real-time update**
   - `onSnapshot` listener receives the update
   - Messages state is updated
   - Component re-renders with new message

## Configuration Steps

### 1. Update Firestore Rules
Go to Firebase Console → Firestore → Rules and add:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /messages/{messageId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.senderId;
      allow delete: if request.auth.uid == resource.data.senderId;
    }
  }
}
```

### 2. Create Messages Collection
- Go to Firestore → Create Collection
- Collection name: `messages`
- Let Firestore auto-create documents

### 3. Test the Chat
1. Open the app
2. Navigate to a user profile
3. Open chat
4. Send a message
5. You should see it appear in real-time

## Key Features Implemented

✅ **Real-time Updates** - Messages sync across devices instantly
✅ **Firebase Snapshots** - Uses onSnapshot for live data
✅ **Error Handling** - Graceful error messages to user
✅ **Loading States** - Shows loading indicator while fetching
✅ **Sender Info** - Displays who sent each message
✅ **Timestamps** - Shows when each message was sent
✅ **Auto Cleanup** - Unsubscribes from listeners when unmounting
✅ **Optimistic Updates** - Disabled input while sending

## Testing Checklist

- [ ] Send message successfully
- [ ] Message appears in real-time
- [ ] Load chat with existing messages
- [ ] Error handling (disconnect from WiFi to test)
- [ ] Multiple users receiving messages
- [ ] Timestamps display correctly
- [ ] Sender names show for other users
- [ ] UI is responsive while loading

## Performance Tips

1. **Add Message Pagination** - Load only last 50 messages initially
2. **Index Queries** - Firestore suggests indexes automatically
3. **Debounce Searches** - If adding search functionality
4. **Optimize Re-renders** - Use React.memo for message list items

## Debugging

Enable Firestore logging:
```typescript
import { enableLogging } from 'firebase/firestore';
enableLogging(true);
```

Check browser console for:
- Network requests to Firestore
- Error messages
- Subscription updates

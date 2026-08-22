import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { addToast } from './uiSlice';

// 1. Fetch all conversations
export const fetchConversations = createAsyncThunk(
  'chat/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/chat/conversations');
      return response.data?.conversations || [];
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch conversations');
    }
  }
);

// 2. Get or Create conversation for an item
export const getOrCreateConversation = createAsyncThunk(
  'chat/getOrCreateConversation',
  async ({ itemId, receiverId }, { rejectWithValue }) => {
    try {
      const response = await api.post('/chat/conversations', { itemId, receiverId });
      return response.data?.conversation;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to open conversation');
    }
  }
);

// 3. Fetch message history of a conversation
export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (conversationId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/chat/messages/${conversationId}`);
      return { conversationId, messages: response.data?.messages || [] };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch messages');
    }
  }
);

// 4. Send a message
export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ conversationId, text }, { rejectWithValue }) => {
    try {
      const response = await api.post('/chat/messages', { conversationId, text });
      return response.data?.message;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to send message');
    }
  }
);

// 5. Fetch total unread count
export const fetchUnreadCount = createAsyncThunk(
  'chat/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/chat/unread-count');
      return response.data?.unreadCount || 0;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  conversations: [],
  activeConversation: null,
  messages: [],
  onlineUsers: [],
  unreadCount: 0,
  isTyping: false,
  isLoading: false,
  isSending: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
    },
    clearActiveConversation: (state) => {
      state.activeConversation = null;
      state.messages = [];
    },
    receiveMessage: (state, action) => {
      const message = action.payload;
      const convId = message.conversation?._id || message.conversation;

      // Append message if looking at this active conversation
      if (state.activeConversation && (state.activeConversation._id === convId || state.activeConversation.id === convId)) {
        state.messages.push(message);
      }

      // Update last message in conversations list
      const index = state.conversations.findIndex((c) => c._id === convId || c.id === convId);
      if (index !== -1) {
        state.conversations[index].lastMessage = {
          text: message.text,
          sender: message.sender,
          createdAt: message.createdAt,
        };
        if (!state.activeConversation || state.activeConversation._id !== convId) {
          state.conversations[index].unreadCount = (state.conversations[index].unreadCount || 0) + 1;
        }
      }
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    setIsTyping: (state, action) => {
      state.isTyping = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchConversations
      .addCase(fetchConversations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // getOrCreateConversation
      .addCase(getOrCreateConversation.fulfilled, (state, action) => {
        state.activeConversation = action.payload;
      })
      // fetchMessages
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload.messages;
        // Decrement unread count for this conversation in list
        const index = state.conversations.findIndex((c) => c._id === action.payload.conversationId);
        if (index !== -1) {
          state.conversations[index].unreadCount = 0;
        }
      })
      // sendMessage
      .addCase(sendMessage.pending, (state) => {
        state.isSending = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isSending = false;
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state) => {
        state.isSending = false;
      })
      // fetchUnreadCount
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload;
      });
  },
});

export const {
  setActiveConversation,
  clearActiveConversation,
  receiveMessage,
  setOnlineUsers,
  setIsTyping,
} = chatSlice.actions;

export default chatSlice.reducer;

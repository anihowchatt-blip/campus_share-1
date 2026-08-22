import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';

let socket = null;

export const initiateSocketConnection = (userId) => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      if (userId) {
        socket.emit('setup', userId);
      }
    });
  } else if (userId) {
    socket.emit('setup', userId);
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const subscribeToMessages = (callback) => {
  if (!socket) return;
  socket.on('message_received', (message) => {
    callback(message);
  });
};

export const subscribeToNotifications = (callback) => {
  if (!socket) return;
  socket.on('message_notification', (message) => {
    callback(message);
  });
};

export const subscribeToOnlineUsers = (callback) => {
  if (!socket) return;
  socket.on('online_users', (users) => {
    callback(users);
  });
};

export const subscribeToTyping = (callback) => {
  if (!socket) return;
  socket.on('typing', (data) => {
    callback(data);
  });
};

export const subscribeToStopTyping = (callback) => {
  if (!socket) return;
  socket.on('stop_typing', (data) => {
    callback(data);
  });
};

export const joinConversationRoom = (conversationId) => {
  if (socket && conversationId) {
    socket.emit('join_conversation', conversationId);
  }
};

export const leaveConversationRoom = (conversationId) => {
  if (socket && conversationId) {
    socket.emit('leave_conversation', conversationId);
  }
};

export const emitTyping = (conversationId, userId) => {
  if (socket && conversationId) {
    socket.emit('typing', { conversationId, userId });
  }
};

export const emitStopTyping = (conversationId, userId) => {
  if (socket && conversationId) {
    socket.emit('stop_typing', { conversationId, userId });
  }
};

export const getSocket = () => socket;

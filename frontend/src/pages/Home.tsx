import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import axios from "axios";

import { UserList } from "../components/sidebar/UserList";
import { ChatHeader } from "../components/chat/ChatHeader";
import { MessageList } from "../components/chat/MessageList";
import { MessageInput } from "../components/chat/MessageInput";
import { Navigation } from "../components/common/Navigation";

const BACKEND_URL = "http://localhost:3000/api/v1";
const SOCKET_URL = "http://localhost:3000";

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  image?: string;
  createdAt: string;
}

interface ChatUser {
  _id: string;
  fullName: string;
  email: string;
  profilePic?: string;
}

export const Home = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  // Initialize socket connection only once
  useEffect(() => {
    const socketInstance = initializeSocket();
    if (socketInstance) {
      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
      };
    }
  }, []);

  const initializeSocket = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const newSocket = io(SOCKET_URL, {
        extraHeaders: {
          Authorization: token,
        },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      newSocket.on("connect", () => {
        console.log("Socket connected successfully");
        const userId = localStorage.getItem("userId");
        if (userId) newSocket.emit("addUser", userId);
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      return newSocket;
    } catch (error) {
      console.error("Socket initialization error:", error);
      return null;
    }
  };


  const addMessageWithoutDuplicates = useCallback((newMsg: Message) => {
    setMessages((prevMessages) => {
      const exists = prevMessages.some((msg) => msg._id === newMsg._id);
      if (exists) {
        return prevMessages;
      }
      return [...prevMessages, newMsg];
    });
  }, []);

  // Set up socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Handle incoming messages
    const handleGetMessage = (message: Message) => {
      console.log("Received message via socket:", message);
      if (
        selectedUser &&
        (selectedUser._id === message.senderId ||
          selectedUser._id === message.receiverId)
      ) {
        addMessageWithoutDuplicates(message);
      }
    };

    // Handle online users update
    const handleGetOnlineUsers = (users: string[]) => {
      setOnlineUsers(users);
    };

    // Register event listeners
    socket.on("getMessage", handleGetMessage);
    socket.on("getOnlineUsers", handleGetOnlineUsers);

    // Add user to online users list
    const userId = localStorage.getItem("userId");
    if (userId) socket.emit("addUser", userId);

    // Cleanup event listeners when component unmounts or dependencies change
    return () => {
      socket.off("getMessage", handleGetMessage);
      socket.off("getOnlineUsers", handleGetOnlineUsers);
    };
  }, [socket, selectedUser, addMessageWithoutDuplicates]);

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/getusers`, {
          headers: { Authorization: localStorage.getItem("token") },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const fetchMessages = async (userId: string) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/getmessages/${userId}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleUserSelect = (user: ChatUser) => {
    setSelectedUser(user);
    fetchMessages(user._id);
  };

  const sendMessage = async () => {
    if (!selectedUser || !newMessage.trim()) return;

    try {
      const response = await axios.post(
        `${BACKEND_URL}/send/${selectedUser._id}`,
        { text: newMessage },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201 && response.data) {
        // Add message to local state
        addMessageWithoutDuplicates(response.data);
        setNewMessage("");

        // Emit the message through socket.io if connected
        if (socket && socket.connected) {
          socket.emit("sendMessage", {
            senderId: localStorage.getItem("userId"),
            receiverId: selectedUser._id,
            text: newMessage,
            _id: response.data._id,
            createdAt: response.data.createdAt,
          });
        } else {
          console.warn("Socket not connected, attempting reconnection...");
          const newSocket = initializeSocket();
          if (newSocket) setSocket(newSocket);
        }
      }
    } catch (error: any) {
      console.error("Error sending message:", error);
      if (error.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        window.location.href = "/login";
      } else {
        alert(
          `Failed to send message: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    }
  };

  const MessageTime = ({ timestamp }: { timestamp: string }) => {
    const formatTime = (date: Date) => {
      return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }).format(date);
    };

    return (
      <span className="text-xs text-gray-400 ml-2">
        {formatTime(new Date(timestamp))}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      <Navigation />
      <div className="flex flex-1">
        <UserList
          users={users}
          selectedUser={selectedUser}
          onlineUsers={onlineUsers}
          onUserSelect={handleUserSelect}
        />

        <div className="h-screen flex-1 flex flex-col">
          {selectedUser ? (
            <>
              <ChatHeader
                selectedUser={selectedUser}
                onlineUsers={onlineUsers}
              />
              <MessageList messages={messages} MessageTime={MessageTime} />
              <MessageInput
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                sendMessage={sendMessage}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-400 text-lg">
                Select a chat to start messaging
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

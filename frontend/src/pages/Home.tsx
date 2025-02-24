import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

import { UserList } from '../components/sidebar/UserList';
import { ChatHeader } from '../components/chat/ChatHeader';
import { MessageList } from '../components/chat/MessageList';
import { MessageInput } from '../components/chat/MessageInput';
import { Navigation } from '../components/common/Navigation';

const BACKEND_URL = "http://localhost:3000/api/v1";

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
    const [newMessage, setNewMessage] = useState('');
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

    useEffect(() => {
        const socket = initializeSocket();
        
        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('receiveMessage', (message) => {
                setMessages(prev => [...prev, message]);
            });

            socket.on('reconnect', (attemptNumber) => {
                console.log('Socket reconnected after', attemptNumber, 'attempts');
            });
        }
    }, [socket]);

    useEffect(() => {

        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/getusers`, {
                    headers: { Authorization: localStorage.getItem('token') }
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();

    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on('getMessage', (message: Message) => {
            if (selectedUser?._id === message.senderId) {
                setMessages(prev => [...prev, message]);
            }
        });

        socket.on('getOnlineUsers', (users: string[]) => {
            setOnlineUsers(users);
        });


        const userId = localStorage.getItem('userId');
        if (userId) socket.emit('addUser', userId);
    }, [socket, selectedUser]);

    const fetchMessages = async (userId: string) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/getmessages/${userId}`, {
                headers: { Authorization: localStorage.getItem('token') }
            });
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleUserSelect = (user: ChatUser) => {
        setSelectedUser(user);
        fetchMessages(user._id);
    };

    const sendMessage = async () => {
        if (!selectedUser || !newMessage.trim()) return;

        try {
            console.log('Sending message:', {
                to: selectedUser._id,
                text: newMessage,
                token: localStorage.getItem('token')
            });

            const response = await axios.post(
                `${BACKEND_URL}/send/${selectedUser._id}`,
                { text: newMessage },
                { 
                    headers: { 
                        'Authorization': localStorage.getItem('token'),
                        'Content-Type': 'application/json'
                    } 
                }
            );

            console.log('Response from backend:', response);

            if (response.status === 201 && response.data) {
                setMessages(prev => [...prev, response.data]);
                setNewMessage('');

                if (socket && socket.connected) {
                    try {
                        socket.emit('sendMessage', {
                            senderId: localStorage.getItem('userId'),
                            receiverId: selectedUser._id,
                            text: newMessage,
                            timestamp: new Date().toISOString()
                        });
                    } catch (socketError) {
                        console.error('Socket emission error:', socketError);
                    }
                } else {
                    console.warn('Socket not connected, attempting reconnection...');

                    initializeSocket();
                }
            }
        } catch (error: any) {
            console.error('Detailed error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            
            if (error.response?.status === 401) {
                alert('Session expired. Please login again.');

            } else {
                alert(`Failed to send message: ${error.response?.data?.message || error.message}`);
            }
        }
    };

    const initializeSocket = () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        const newSocket = io(BACKEND_URL, {
            auth: {
                token: `${token}`
            },
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });

        newSocket.on('connect', () => {
            console.log('Socket connected successfully');
            setSocket(newSocket);
        });

        newSocket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
        });

        return newSocket;
    };

    const MessageTime = ({ timestamp }: { timestamp: string }) => {
        const formatTime = (date: Date) => {
            return new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true
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

                <div className="flex-1 flex flex-col">
                    {selectedUser ? (
                        <>
                            <ChatHeader 
                                selectedUser={selectedUser}
                                onlineUsers={onlineUsers}
                            />
                            <MessageList 
                                messages={messages}
                                MessageTime={MessageTime}
                            />
                            <MessageInput 
                                newMessage={newMessage}
                                setNewMessage={setNewMessage}
                                sendMessage={sendMessage}
                            />
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <p className="text-gray-400 text-lg">Select a chat to start messaging</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
import { User } from 'lucide-react';

interface ChatUser {
    _id: string;
    fullName: string;
    email: string;
    profilePic?: string;
}

interface UserListProps {
    users: ChatUser[];
    selectedUser: ChatUser | null;
    onlineUsers: string[];
    onUserSelect: (user: ChatUser) => void;
}

export const UserList = ({ users, selectedUser, onlineUsers, onUserSelect }: UserListProps) => {
    return (
        <div className="w-1/4 bg-gray-800 border-r border-gray-700">
            <div className="p-4">
                <h2 className="text-xl font-bold text-white mb-4">Chats</h2>
                <div className="space-y-2">
                    {users.map(user => (
                        <div
                            key={user._id}
                            onClick={() => onUserSelect(user)}
                            className={`flex items-center p-3 rounded-lg cursor-pointer ${
                                selectedUser?._id === user._id ? 'bg-gray-700' : 'hover:bg-gray-700'
                            }`}
                        >
                            <div className="relative">
                                {user.profilePic ? (
                                    <img
                                        src={user.profilePic}
                                        alt={user.fullName}
                                        className="w-10 h-10 rounded-full"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                                        <User className="w-6 h-6 text-gray-300" />
                                    </div>
                                )}
                                {onlineUsers.includes(user._id) && (
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full"></div>
                                )}
                            </div>
                            <div className="ml-3">
                                <p className="text-white">{user.fullName}</p>
                                <p className="text-gray-400 text-sm">{user.email}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}; 
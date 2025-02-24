import { User } from 'lucide-react';

interface ChatHeaderProps {
    selectedUser: {
        _id: string;
        fullName: string;
        profilePic?: string;
    };
    onlineUsers: string[];
}

export const ChatHeader = ({ selectedUser, onlineUsers }: ChatHeaderProps) => {
    return (
        <div className="p-4 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center">
                {selectedUser.profilePic ? (
                    <img
                        src={selectedUser.profilePic}
                        alt={selectedUser.fullName}
                        className="w-10 h-10 rounded-full"
                    />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-300" />
                    </div>
                )}
                <div className="ml-3">
                    <p className="text-white font-semibold">{selectedUser.fullName}</p>
                    <p className="text-gray-400 text-sm">
                        {onlineUsers.includes(selectedUser._id) ? 'Online' : 'Offline'}
                    </p>
                </div>
            </div>
        </div>
    );
};

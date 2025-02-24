import { Send } from 'lucide-react';

interface MessageInputProps {
    newMessage: string;
    setNewMessage: (message: string) => void;
    sendMessage: () => void;
}

export const MessageInput = ({ newMessage, setNewMessage, sendMessage }: MessageInputProps) => {
    return (
        <div className="p-4 bg-gray-800 border-t border-gray-700">
            <div className="flex space-x-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={sendMessage}
                    className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <Send className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}; 
interface Message {
    _id: string;
    senderId: string;
    text: string;
    image?: string;
    createdAt: string;
}

interface MessageListProps {
    messages: Message[];
    MessageTime: React.FC<{ timestamp: string }>;
}

export const MessageList = ({ messages, MessageTime }: MessageListProps) => {
    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(message => (
                <div
                    key={message._id}
                    className={`flex ${
                        message.senderId === localStorage.getItem('userId')
                            ? 'justify-end'
                            : 'justify-start'
                    }`}
                >
                    <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                            message.senderId === localStorage.getItem('userId')
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 text-white'
                        } relative group`}
                    >
                        <div className="flex flex-col">
                            <div className="break-words">{message.text}</div>
                            {message.image && (
                                <img
                                    src={message.image}
                                    alt="message"
                                    className="mt-2 rounded-lg max-w-sm cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={() => window.open(message.image, '_blank')}
                                />
                            )}
                            <MessageTime timestamp={message.createdAt} />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}; 
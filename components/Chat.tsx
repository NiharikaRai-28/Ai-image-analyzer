import React, { useState, useEffect, useRef } from 'react';
import { User, ChatMessage } from '../types';
import { getCurrentUser } from '../services/authService';
import { 
    getChatPartners, 
    getMessages, 
    sendMessage, 
    blockUser, 
    unblockUser, 
    isUserBlockedBy,
    clearChatHistory,
    deleteMessageForMe,
    deleteMessageForEveryone
} from '../services/chatService';

interface ChatProps {
    onBack: () => void;
}

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const Chat: React.FC<ChatProps> = ({ onBack }) => {
    const [currentUser] = useState<User | null>(getCurrentUser());
    const [chatPartners, setChatPartners] = useState<User[]>([]);
    const [selectedPartner, setSelectedPartner] = useState<User | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    const [partnerIsBlocked, setPartnerIsBlocked] = useState(false);
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, message: ChatMessage } | null>(null);
    const [headerMenuOpen, setHeaderMenuOpen] = useState(false);
    
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const refreshMessages = () => {
        if (selectedPartner && currentUser) {
            setMessages(getMessages(currentUser.id, selectedPartner.id));
        }
    };

    useEffect(() => {
        if (currentUser) {
            setChatPartners(getChatPartners(currentUser.id));
        }
    }, [currentUser]);
    
    useEffect(() => {
        if (selectedPartner && currentUser) {
            refreshMessages();
            setIsBlocked(isUserBlockedBy(currentUser.id, selectedPartner.id));
            setPartnerIsBlocked(isUserBlockedBy(selectedPartner.id, currentUser.id));
        } else {
            setMessages([]);
        }
    }, [selectedPartner, currentUser]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    
    useEffect(() => {
        const handleClickOutside = () => setContextMenu(null);
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, []);

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (newMessage.trim() && currentUser && selectedPartner) {
            sendMessage(currentUser.id, selectedPartner.id, { type: 'text', text: newMessage.trim() });
            refreshMessages();
            setNewMessage('');
        }
    };

    const handleStartRecording = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                setIsRecording(true);
                mediaRecorderRef.current = new MediaRecorder(stream);
                mediaRecorderRef.current.ondataavailable = (event) => {
                    audioChunksRef.current.push(event.data);
                };
                mediaRecorderRef.current.onstop = async () => {
                    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                    const audioData = await blobToBase64(audioBlob);
                    if (currentUser && selectedPartner) {
                        sendMessage(currentUser.id, selectedPartner.id, { type: 'audio', audioData });
                        refreshMessages();
                    }
                    audioChunksRef.current = [];
                    stream.getTracks().forEach(track => track.stop()); // Stop microphone
                };
                mediaRecorderRef.current.start();
            } catch (err) {
                console.error('Error accessing microphone:', err);
                alert("Could not access microphone. Please check permissions.");
            }
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };
    
    const handleBlockToggle = () => {
        if (!currentUser || !selectedPartner) return;
        if (isBlocked) {
            unblockUser(currentUser.id, selectedPartner.id);
        } else {
            blockUser(currentUser.id, selectedPartner.id);
        }
        setIsBlocked(!isBlocked);
        setHeaderMenuOpen(false);
    };

    const handleClearHistory = () => {
        if (currentUser && selectedPartner && window.confirm("Are you sure you want to clear your chat history with this user? This cannot be undone.")) {
            clearChatHistory(currentUser.id, selectedPartner.id);
            refreshMessages();
        }
        setHeaderMenuOpen(false);
    };
    
    const handleDelete = (type: 'me' | 'everyone') => {
        if(contextMenu && currentUser) {
            if(type === 'me') {
                deleteMessageForMe(contextMenu.message.id, currentUser.id);
            } else {
                deleteMessageForEveryone(contextMenu.message.id);
            }
            refreshMessages();
            setContextMenu(null);
        }
    };

    if (!currentUser) return null;

    const chatDisabled = isBlocked || partnerIsBlocked;

    return (
        <div>
            {contextMenu && (
                <div style={{ top: contextMenu.y, left: contextMenu.x }} className="absolute z-10 bg-gray-600 rounded-md shadow-lg py-1">
                    <button onClick={() => handleDelete('me')} className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700">Delete for me</button>
                    {contextMenu.message.from === currentUser.id && (
                        <button onClick={() => handleDelete('everyone')} className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700">Delete for everyone</button>
                    )}
                </div>
            )}
            <button onClick={onBack} className="mb-6 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                &larr; Back to Dashboard
            </button>
            <div className="flex flex-col md:flex-row h-[calc(100vh-200px)] bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
                {/* User List */}
                <div className="w-full md:w-1/3 border-r border-gray-700 bg-gray-800 flex flex-col">
                    <div className="p-4 border-b border-gray-700">
                        <h2 className="text-xl font-bold text-teal-300">Contacts</h2>
                    </div>
                    <ul className="overflow-y-auto flex-grow">
                        {chatPartners.map(partner => (
                            <li key={partner.id} onClick={() => { setSelectedPartner(partner); setHeaderMenuOpen(false); }} className={`p-4 cursor-pointer hover:bg-gray-700 transition-colors ${selectedPartner?.id === partner.id ? 'bg-teal-900/50' : ''}`}>
                                <p className="font-semibold">{partner.email}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Chat Window */}
                <div className="w-full md:w-2/3 flex flex-col">
                    {selectedPartner ? (
                        <>
                            <div className="relative p-4 border-b border-gray-700 bg-gray-800 flex justify-between items-center">
                                <h3 className="font-bold text-lg">{selectedPartner.email}</h3>
                                <button onClick={() => setHeaderMenuOpen(o => !o)} className="p-1 rounded-full hover:bg-gray-700">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                                </button>
                                {headerMenuOpen && (
                                    <div className="absolute top-14 right-4 z-10 bg-gray-600 rounded-md shadow-lg py-1 w-48">
                                        <button onClick={handleBlockToggle} className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700">{isBlocked ? 'Unblock User' : 'Block User'}</button>
                                        <button onClick={handleClearHistory} className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700">Clear Chat History</button>
                                    </div>
                                )}
                            </div>
                            <div className="flex-grow p-4 overflow-y-auto bg-gray-900/50">
                                {messages.map(msg => (
                                    <div key={msg.id} className={`flex ${msg.from === currentUser.id ? 'justify-end' : 'justify-start'} mb-4`}>
                                        <div 
                                            onContextMenu={(e) => { e.preventDefault(); setContextMenu({x: e.pageX, y: e.pageY, message: msg}) }}
                                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl cursor-pointer ${msg.from === currentUser.id ? 'bg-teal-600 text-white' : 'bg-gray-600 text-white'}`}
                                        >
                                            {msg.deletedForEveryone ? (
                                                <p className="italic text-gray-300">This message was deleted</p>
                                            ) : msg.type === 'audio' ? (
                                                <audio controls src={msg.audioData} className="w-64 h-12"></audio>
                                            ) : (
                                                <p>{msg.text}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                            <div className="p-4 bg-gray-800">
                                {chatDisabled ? (
                                    <div className="text-center text-yellow-400 bg-yellow-900/50 p-3 rounded-full">
                                        {isBlocked ? "You have blocked this user." : "You cannot reply to this conversation."}
                                    </div>
                                ) : (
                                    <form onSubmit={handleSendMessage} className="flex items-center">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={e => setNewMessage(e.target.value)}
                                            placeholder="Type a message..."
                                            className="flex-grow px-4 py-2 text-white bg-gray-700 border border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        />
                                        {isRecording ? (
                                            <button type="button" onClick={handleStopRecording} className="ml-2 p-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-full transition-colors flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 animate-pulse" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm0 4a1 1 0 112 0v2a1 1 0 11-2 0v-2z" clipRule="evenodd" /></svg>
                                            </button>
                                        ) : (
                                            <button type="button" onClick={handleStartRecording} className="ml-2 p-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-full transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                                            </button>
                                        )}
                                        <button type="submit" className="ml-2 px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-full transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                                        </button>
                                    </form>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            <p className="text-xl">Select a contact to start chatting</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;
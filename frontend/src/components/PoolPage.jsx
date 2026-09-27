import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { userContext } from '../context';
import Navbar from './Navbar';
import { IoSend } from 'react-icons/io5';

const PoolPage = () => {
    const { poolId } = useParams();
    const { userData } = useContext(userContext);
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);

    // 1. Stable ID extraction to prevent infinite re-renders
    const myId = String(userData?._id || userData?.id_ || "");

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (!myId) return;

        // 2. Forced WebSocket transport to bypass HTTP polling and Vite's HMR
        const newSocket = io("http://localhost:5000", {
            transports: ['websocket']
        });
        
        setSocket(newSocket);

        newSocket.emit("join_pool", poolId);

        newSocket.on("receive_message", (data) => {
            if (String(data.senderId) === myId) return;
            setMessages((prev) => [...prev, data]);
        });

        newSocket.on("chat_history", (history) => {
            setMessages(history);
        });

        return () => {
            newSocket.disconnect();
        };
        // 3. Dependency array locked to primitives, not the whole user object
    }, [poolId, myId]); 

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() === "" || !socket) return;

        const messageData = {
            poolId,
            sender: userData.name,
            senderId: myId,
            message: newMessage,
            timestamp: new Date().toISOString()
        };

        setMessages((prev) => [...prev, messageData]);
        socket.emit("send_message", messageData);
        setNewMessage("");
    };

    if (!userData) return null;

    return (
        <div className='flex flex-col bg-black h-screen text-white overflow-hidden font-sans select-none'>
            <Navbar userData={userData} />
            <main className="flex-1 p-6 md:p-8 bg-zinc-950 overflow-hidden flex justify-center">
                <div className="w-full max-w-4xl h-full flex flex-col bg-[#121212] border border-zinc-900 rounded-2xl overflow-hidden shadow-2xl">

                    <div className="border-b border-zinc-900 p-5 bg-[#181818]">
                        <h2 className="text-xl font-extrabold text-white tracking-tight">Pool Chat</h2>
                        <p className="text-xs text-zinc-500">Live chat for pool ID: {poolId}</p>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
                        {messages.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
                                No messages yet. Start the conversation!
                            </div>
                        ) : (
                            messages.map((msg, idx) => {
                                // 4. Strict string matching for right-left message alignment
                                const isMe = String(msg.senderId) === myId;
                                
                                return (
                                    <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                        <span className="text-[10px] text-zinc-500 mb-1 px-1">{msg.sender}</span>
                                        <div className={`px-4 py-2 rounded-2xl max-w-[70%] ${isMe
                                            ? 'bg-amber-500 text-black rounded-tr-none font-medium' 
                                            : 'bg-zinc-800 text-white rounded-tl-none' 
                                            }`}>
                                            <p className="text-sm">{msg.message}</p>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 bg-[#181818] border-t border-zinc-900">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 bg-zinc-900 text-white text-sm rounded-full px-5 py-3 focus:outline-none focus:ring-1 focus:ring-amber-500 border border-zinc-800"
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim()}
                                className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black p-3 rounded-full transition-colors flex items-center justify-center"
                            >
                                <IoSend className="text-lg ml-1" />
                            </button>
                        </form>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default PoolPage;
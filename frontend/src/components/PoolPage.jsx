import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { userContext } from '../context';
import Navbar from './Navbar';
import { IoSend, IoWallet } from 'react-icons/io5';

const PoolPage = () => {
    // 1. Grab params from URL, and pool data from router state!
    const { poolId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const pool = location.state?.pool || null; 
    
    const { userData, refreshUser } = useContext(userContext);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);

    const myId = String(userData?._id || userData?.id_ || "");

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Socket Initialization
    useEffect(() => {
        if (!myId || !poolId) return;

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

    const handleLeavePool = async () => {
        const confirmLeave = window.confirm(`Are you sure you want to leave this pool?`);
        if (!confirmLeave) return;

        try {
            const response = await fetch(`http://localhost:5000/api/pools/${poolId}/leave`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                alert("You have left the pool successfully.");
                refreshUser(); // Re-fetch user data to update dashboard
                navigate('/'); // Send them back home
            } else {
                const err = await response.json();
                alert(err.message);
            }
        } catch (error) {
            console.error("Failed to leave pool:", error);
        }
    };

    if (!userData) return null;

    // Safety fallback if someone navigates directly via URL without going through the UI
    // In a real app, you'd fetch the pool by ID here if `pool` is null.
    const displayTitle = pool?.subscription?.name || pool?.name || `Pool ${poolId}`;
    const monthlyCost = pool?.subscription?.monthly_cost || 0;
    const maxMembers = pool?.maxMembers || 1;
    const isAuthor = pool?.author === myId || pool?.author?._id === myId;

    return (
        <div className='flex flex-col bg-black h-screen text-white overflow-hidden font-sans select-none relative'>
            <Navbar userData={userData} />
            <main className="flex-1 p-6 md:p-8 bg-zinc-950 overflow-hidden flex justify-center">
                
                {/* Re-using your brilliant split layout but as a full page */}
                <div className="w-full max-w-6xl h-full flex flex-col bg-[#121212] border border-zinc-900 rounded-2xl overflow-hidden shadow-2xl">
                    
                    {/* Header */}
                    <div className="p-6 border-b border-zinc-900 flex justify-between items-center bg-[#181818]/40">
                        <div>
                            <div className="flex items-center gap-3">
                                <button onClick={() => navigate(-1)} className="text-zinc-500 hover:text-white transition-colors mr-2">← Back</button>
                                <h2 className="text-2xl font-bold">{displayTitle}</h2>
                            </div>
                            <p className="text-sm text-zinc-500 mt-1 ml-10">Next billing date: Day {pool?.renewalDay ? new Date(pool.renewalDay).getDate() : '?'}</p>
                        </div>
                        <div className="flex items-center gap-3 bg-zinc-900/80 px-4 py-2 rounded-xl border border-zinc-800">
                            <div className="bg-amber-500/20 p-2 rounded-lg">
                                <IoWallet className="text-amber-500 text-xl" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Pool Wallet</span>
                                <span className="text-lg font-bold text-white">
                                    ${(pool?.walletBalance || 0).toFixed(2)} 
                                    <span className="text-xs text-zinc-500 font-normal ml-1">/ ${(monthlyCost || 0).toFixed(2)} needed</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Split Layout Body */}
                    <div className="flex-1 flex overflow-hidden">
                        
                        {/* LEFT PANEL: Ledger */}
                        <div className="w-2/3 p-8 overflow-y-auto custom-scrollbar flex flex-col gap-6">
                            <div className="bg-zinc-900/50 p-5 rounded-xl border border-zinc-800 flex justify-between items-center">
                                <div>
                                    <h3 className="text-sm font-semibold text-zinc-400 mb-2">Your Status</h3>
                                    <p className="text-base text-zinc-300">Your Share: <span className="font-bold text-white">${(monthlyCost / maxMembers).toFixed(2)} /mo</span></p>
                                </div>
                                
                                {isAuthor ? (
                                    <span className="text-xs text-zinc-500 bg-zinc-800 px-4 py-2 rounded-md border border-zinc-700">
                                        👑 You are the Owner
                                    </span>
                                ) : (
                                    <button 
                                        onClick={handleLeavePool}
                                        className="text-sm font-bold text-red-400 border border-red-900/50 bg-red-950/20 px-4 py-2 rounded-md hover:bg-red-500 hover:text-black transition-all"
                                    >
                                        Leave Pool
                                    </button>
                                )}
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-zinc-400 mb-2">Expense History</h3>
                                <p className="text-sm text-zinc-600">No recent expenses logged.</p>
                            </div>
                        </div>

                        {/* RIGHT PANEL: Chat */}
                        <div className="w-1/3 border-l border-zinc-900 bg-[#161616]/30 flex flex-col h-full">
                            <div className="p-4 border-b border-zinc-900 bg-zinc-900/20">
                                <span className="text-[10px] font-bold tracking-widest text-amber-500 uppercase">Live Pool Discussion</span>
                            </div>
                            
                            <div className="flex-1 p-5 overflow-y-auto custom-scrollbar space-y-4">
                                {messages.length === 0 ? (
                                    <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
                                        No messages yet. Say hi!
                                    </div>
                                ) : (
                                    messages.map((msg, idx) => {
                                        const isMe = String(msg.senderId) === myId;
                                        
                                        return (
                                            <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                                <span className="text-[10px] text-zinc-500 mb-1 px-1">{msg.sender}</span>
                                                <div className={`px-4 py-2 rounded-2xl max-w-[85%] ${isMe
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

                            <div className="p-4 border-t border-zinc-900 bg-[#121212]">
                                <form onSubmit={handleSendMessage} className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Discuss expenses..." 
                                        className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500" 
                                    />
                                    <button 
                                        type="submit"
                                        disabled={!newMessage.trim()}
                                        className="bg-amber-500 text-black px-4 py-3 rounded-lg text-sm font-bold hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                    >
                                        <IoSend className="text-lg" />
                                    </button>
                                </form>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default PoolPage;
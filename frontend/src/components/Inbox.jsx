import React, { useState,useContext } from 'react';
import MessageModal from './MessageModal'; // Import the new component
import { userContext } from '../context';

const Inbox = () => {
    const userData = useContext(userContext);
    const myInbox = userData?.myInbox || [];
    const [inboxData, setInboxData] = useState(myInbox);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const handleClick = (message) => {
        setInboxData((prevInbox) =>
            prevInbox.map((msg) =>
                msg.id === message.id ? { ...msg, unread: false } : msg
            )
        );
        setSelectedMessage({ ...message, unread: false });
    };

    return (
        <div className="messages flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar relative">
            {inboxData && inboxData.length > 0 ? (
                inboxData.map((msg) => (
                    <div
                        onClick={() => handleClick(msg)}
                        key={msg.id}
                        className={`flex flex-col p-3.5 rounded-xl cursor-pointer transition-all duration-200 border
                            ${msg.unread 
                                ? 'bg-[#282828] hover:bg-[#333333] border-zinc-700/50 shadow-md shadow-black/40 translate-x-0.5' 
                                : 'bg-[#181818]/60 hover:bg-[#1C1C1C] border-transparent'}`}
                    >
                        <div className="flex justify-between items-baseline mb-1.5">
                            <span className={`text-sm tracking-tight ${msg.unread ? 'font-bold text-white' : 'font-medium text-zinc-400'}`}>
                                {msg.sender}
                            </span>
                            <span className={`text-[11px] font-medium ${msg.unread ? 'text-red-400' : 'text-zinc-600'}`}>
                                {msg.time}
                            </span>
                        </div>
                        <p className={`text-xs leading-relaxed truncate ${msg.unread ? 'text-zinc-200' : 'text-zinc-500'}`}>
                            {msg.preview}
                        </p>
                    </div>
                ))
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-600">
                    <p className="text-sm font-semibold text-zinc-500">Your inbox is clear</p>
                </div>
            )}

            {/* Render the extracted Modal Component here cleanly */}
            <MessageModal 
                isOpen={selectedMessage} 
                onClose={() => setSelectedMessage(null)} 
            />
        </div>
    );
};

export default Inbox;
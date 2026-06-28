import React from 'react';

const MessageModal = ({ isOpen, onClose }) => {
    // If there is no message active, don't render anything at all
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
            {/* The Popup Box */}
            <div className="w-full max-w-lg bg-[#121212] border border-zinc-800 rounded-2xl p-6 shadow-2xl relative flex flex-col">
                
                {/* Header Details */}
                <div className="border-b border-zinc-900 pb-4 mb-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-[10px] font-mono tracking-widest text-red-500 uppercase">System Notification</span>
                            <h3 className="text-lg font-bold text-white mt-1 leading-tight">{isOpen.title}</h3>
                        </div>
                        
                        {/* Close Button */}
                        <button 
                            onClick={onClose}
                            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Meta row */}
                    <div className="flex justify-between items-center text-xs text-zinc-500 mt-4">
                        <p>Sender: <span className="text-zinc-300 font-medium">{isOpen.sender}</span></p>
                        <p className="font-mono text-[11px]">{isOpen.date} • {isOpen.time}</p>
                    </div>
                </div>

                {/* Read-Only Message Body Content */}
                <div className="text-sm text-zinc-300 leading-relaxed bg-zinc-950/50 border border-zinc-900 p-4 rounded-xl min-h-[120px]">
                    {isOpen.preview}
                </div>

                {/* Footer Status Badge */}
                <div className="mt-5 pt-3 border-t border-zinc-900 flex justify-end">
                    <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900/60 px-2 py-1 rounded border border-zinc-800/50">
                        LOG_STATUS: VERIFIED_READ
                    </span>
                </div>
            </div>
        </div>
    );
};

export default MessageModal;
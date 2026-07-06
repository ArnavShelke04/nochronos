import React from 'react';

export const PoolsModals = ({ pool, onClose, onLeavePool, currentUserId }) => {
    if (!pool) return null;

    const handleLeaveClick = () => {
        const confirmLeave = window.confirm(`Are you sure you want to leave the ${pool.subscription?.name} pool?`);
        if (confirmLeave) {
            onLeavePool(pool._id);
        }
    };

    // Check if the current user logged in is the original creator
    const isAuthor = pool.author === currentUserId || pool.author?._id === currentUserId;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            {/* Modal Box */}
            <div className="w-11/12 max-w-5xl h-[85vh] bg-[#121212] border border-zinc-900 rounded-2xl flex flex-col overflow-hidden shadow-2xl text-white">
                
                {/* MODAL HEADER */}
                <div className="p-6 border-b border-zinc-900 flex justify-between items-center bg-[#181818]/40">
                    <div>
                        <h2 className="text-xl font-bold">{pool.subscription?.name}</h2>
                        <p className="text-xs text-zinc-500">Next billing date: Day {pool.payment?.dueDate}</p>
                    </div>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">✕</button>
                </div>

                {/* MODAL BODY (SPLIT LAYOUT) */}
                <div className="flex-1 flex overflow-hidden">
                    
                    {/* LEFT PANEL: Financial Ledger & History */}
                    <div className="w-2/3 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6">
                        
                        {/* Status Box & Actions */}
                        <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 flex justify-between items-center">
                            <div>
                                <h3 className="text-sm font-semibold text-zinc-400 mb-2">Your Status</h3>
                                <p className="text-sm text-zinc-300">Your Share: ${pool.payment?.amount?.toFixed(2)} /mo</p>
                            </div>
                            
                            {/* Leave Pool Action */}
                            {isAuthor ? (
                                <span className="text-xs text-zinc-500 bg-zinc-800 px-3 py-1.5 rounded-md border border-zinc-700">
                                    👑 You are the Owner
                                </span>
                            ) : (
                                <button 
                                    onClick={handleLeaveClick}
                                    className="text-xs font-bold text-red-400 border border-red-900/50 bg-red-950/20 px-3 py-1.5 rounded-md hover:bg-red-500 hover:text-black transition-all"
                                >
                                    Leave Pool
                                </button>
                            )}
                        </div>

                        {/* Transaction List */}
                        <div>
                            <h3 className="text-sm font-semibold text-zinc-400 mb-2">Expense History</h3>
                            {/* Map through pool.expenses */}
                        </div>
                    </div>

                    {/* RIGHT PANEL: Integrated Live Chat */}
                    <div className="w-1/3 border-l border-zinc-900 bg-[#161616]/30 flex flex-col h-full">
                        <div className="p-3 border-b border-zinc-900 bg-zinc-900/20">
                            <span className="text-[10px] font-bold tracking-widest text-amber-500 uppercase">Pool Discussion</span>
                        </div>
                        
                        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar space-y-3">
                            {/* Message bubbles go here */}
                        </div>

                        <div className="p-4 border-t border-zinc-900 bg-[#121212]">
                            <div className="flex gap-2">
                                <input type="text" placeholder="Discuss expenses..." className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500" />
                                <button className="bg-amber-500 text-black px-3 py-2 rounded-lg text-sm font-bold hover:bg-amber-400 transition-colors">Send</button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PoolsModals;
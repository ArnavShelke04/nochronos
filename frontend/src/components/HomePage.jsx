import React from 'react';
import nochronosLogo from '../assets/nochronosLogo.png';
import Navbar from './Navbar';
const HomePage = ({ userData }) => {
    return (
        /* Screen height locked to 100vh with no global overflow to create an "App Desktop" environment */
        <div className='flex flex-col bg-black h-screen text-white overflow-hidden font-sans select-none'>
            
            <Navbar userData = {userData}/>
            <main className="flex-1 p-6 md:p-8 bg-zinc-950 overflow-hidden">
                <div className="w-full h-full flex justify-center items-stretch bg-[#121212] border border-zinc-900 rounded-2xl overflow-hidden shadow-2xl">
                    
                    {/* LEFT CONTAINER (INBOX) */}
                    <div className="left w-1/4 flex flex-col p-5 bg-[#121212] h-full border-r border-zinc-900/80">
                        <div className="flex justify-between items-center mb-4 px-1">
                            <h1 className='text-xs font-bold tracking-widest text-zinc-400 uppercase'>Inbox</h1>
                            {userData?.myInbox?.length > 0 && (
                                <span className="bg-red-600/10 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-500/20 animate-pulse">
                                    {userData.myInbox.filter(m => m.unread).length} New
                                </span>
                            )}
                        </div>
                        
                        {/* Dynamic Container using flex-1 and overflow-y-auto to handle custom-scrolling perfectly */}
                        <div className="messages flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
                            {userData?.myInbox && userData.myInbox.length > 0 ? (
                                userData.myInbox.map((msg) => (
                                    <div
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
                                /* Empty state centers itself precisely inside the container bounds */
                                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2 text-zinc-700">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                    </svg>
                                    <p className="text-sm font-semibold text-zinc-500">Your inbox is clear</p>
                                    <p className="text-[11px] text-zinc-600 mt-1 max-w-[180px] leading-normal">System logs and payment requests will appear here.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT CONTAINER (POOLS DESKTOP CONTENT) */}
                    <div className="right w-2/3 p-8 bg-[#181818]/40 h-full overflow-y-auto custom-scrollbar flex flex-col justify-between">
                        <div>
                            <div className="border-b border-zinc-900 pb-5 mb-6">
                                <span className="text-[10px] font-bold tracking-widest text-red-500 uppercase">Active Activity</span>
                                <h2 className="text-2xl font-extrabold text-white tracking-tight mt-1">Pools Content</h2>
                            </div>
                            
                            {/* Content wrapper ensuring layout readability */}
                            <div className="max-w-xl text-sm text-zinc-400 leading-relaxed space-y-4">
                                <p>Select an active invoice item or system notification on the left to review ledger details, update payment thresholds, or coordinate splits with group members.</p>
                            </div>
                        </div>
                        
                        {/* Footer branding element to ground the UI layout */}
                        <div className="pt-6 border-t border-zinc-900 text-right">
                            <p className="text-[11px] text-zinc-600 font-medium">nochronos Engine v1.0.4 • Secured via Ledger Protocols</p>
                        </div>
                    </div>
                    
                </div>
            </main>
        </div>
    );
}

export default HomePage;
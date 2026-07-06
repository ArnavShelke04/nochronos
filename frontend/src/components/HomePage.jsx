import React from 'react';
import nochronosLogo from '../assets/nochronosLogo.png';
import Navbar from './Navbar';
import Inbox from './Inbox';
import CreatePool from './CreatePool';
import Pools from './Pools';
import { IoAdd } from "react-icons/io5";
import { userContext } from '../context';
import { useContext, useState } from 'react';

const HomePage = () => {
    const userData = useContext(userContext);
    const [create, setcreate] = useState(false);

    return (
        <div className='flex flex-col bg-black h-screen text-white overflow-hidden font-sans select-none'>
            <Navbar userData={userData} />
            <main className="flex-1 p-6 md:p-8 bg-zinc-950 overflow-hidden">
                
                {/* Main Dashboard Container */}
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
                        <Inbox myInbox={userData.myInbox} />
                    </div>

                    {/* RIGHT WRAPPER CONTAINER */}
                    <div className="right-wrapper w-2/3 h-full relative flex flex-col">
                        
                        {/* THE SCROLLING CONTAINER */}
                        <div className="right-scroll-area w-full h-full p-8 bg-[#181818]/40 overflow-y-auto custom-scrollbar">
                            <div className='flex flex-col pb-24'> 
                                <div className="border-b border-zinc-900 pb-5 mb-6">
                                    <span className="text-[10px] font-bold tracking-widest text-red-500 uppercase">Activity</span>
                                    <h2 className="text-2xl font-extrabold text-white tracking-tight mt-1">My Pools</h2>
                                </div>
                                <Pools myPools={userData.myPools} />
                            </div>
                        </div>

                        {/* FIXED BUG: Wrapped setcreate(true) inside an arrow function */}
                        <button 
                            onClick={() => setcreate(true)} 
                            className="absolute bottom-6 right-6 z-50 flex items-center gap-2 text-black text-sm font-bold bg-amber-500 hover:bg-amber-400 p-4 rounded-full shadow-2xl transition-all cursor-pointer"
                        >
                            <IoAdd className="text-xl" />
                            <span className="uppercase tracking-wider">Create</span>
                        </button>

                        
                        <CreatePool isOpen={create} onClose={() => setcreate(false)} />
                    </div>

                </div>
            </main>
        </div>
    );
}

export default HomePage;
import React from 'react'
import nochronosLogo from '../assets/nochronosLogo.png';
const HomePage = ({ userData }) => {
    return (
        <div className='flex flex-col bg-black min-h-screen text-white p-6'>
            <div className="nav flex w-full justify-around items-center">
                <div className="left">
                    <h1 className="font-sans text-3xl font-bold tracking-tight text-white lowercase">
                        nochronos
                    </h1>
                </div>
                <div className="right flex gap-4">
                    <input type="text" placeholder='Search for more' className='rounded-4xl p-5 m-3 border-gray-600 border-2' />
                    <button className=" flex items-center justify-center account border-2 rounded-full py-5 px-7 m-3 bg-red-800 font-bold border-none cursor">{userData.accountName[0].toUpperCase()}</button>
                </div>
            </div>
            <div className="body w-full flex justify-center items-stretch bg-gray-500 rounded-xl p-6 min-h-[75vh]">
                <div className="left w-1/4 flex-col p-4 ">
                    <h1 className='font-bold'>INBOX</h1>
                    <div className="messages bg-red-500">
                        {userData.map((msg) => (
                        <div 
                            key={msg.id} 
                            className={`flex flex-col p-3 rounded-md cursor-pointer transition-colors duration-200 
                                ${msg.unread ? 'bg-zinc-700/50 border-l-4 border-red-500' : 'bg-zinc-800 hover:bg-zinc-700/30'}`}
                        >
                            <div className="flex justify-between items-baseline mb-1">
                                <span className={`text-sm ${msg.unread ? 'font-bold text-white' : 'font-semibold text-zinc-300'}`}>
                                    {msg.sender}
                                </span>
                                <span className="text-xs text-zinc-500">{msg.time}</span>
                            </div>
                            <p className="text-xs text-zinc-400 truncate">
                                {msg.preview}
                            </p>
                        </div>
                    ))}
                    </div>
                </div>
                <div className="line bg-white w-1 self-stretch my-2"></div>
                <div className="right w-2/3  p-4 ">
                    Pools Content
                </div>

            </div>
        </div>
    );
}

export default HomePage

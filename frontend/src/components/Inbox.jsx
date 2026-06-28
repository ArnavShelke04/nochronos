import React from 'react'

const Inbox = ({myInbox}) => {
  return (
    <div className="messages flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
        { myInbox.length > 0 ? (myInbox.map((msg) => (
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
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2 text-zinc-700">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                <p className="text-sm font-semibold text-zinc-500">Your inbox is clear</p>
                <p className="text-[11px] text-zinc-600 mt-1 max-w-[180px] leading-normal">System logs and payment requests will appear here.</p>
            </div>
        )}
    </div>
  )
}

export default Inbox

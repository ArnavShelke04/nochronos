import React from 'react'

const Navbar = ({ userData }) => {
    return (
        <nav className="sticky top-0 z-50 flex w-full justify-between items-center px-8 py-4 bg-black/80 backdrop-blur-md border-b border-zinc-900">
            <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black tracking-tighter text-white lowercase bg-gradient-to-r from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
                    nochronos
                </h1>
            </div>
            <div className="flex items-center gap-6">
                <div className="relative">
                    <input
                        type="text"
                        placeholder='Search for pools'
                        className='bg-zinc-900 placeholder-zinc-500 text-sm text-white rounded-full py-2.5 pl-5 pr-12 w-64 border border-zinc-800 focus:outline-none focus:border-zinc-700 focus:w-80 transition-all duration-300'
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-500 font-mono pointer-events-none">⌘K</span>
                </div>

                {/* Cleaned up Avatar profile badge */}
                <button className="flex items-center justify-center w-10 h-10 rounded-full bg-red-700 hover:bg-red-600 font-bold text-sm tracking-wide text-white border border-red-800/50 shadow-lg shadow-red-900/20 active:scale-95 transition-transform duration-100">
                    {userData?.accountName ? userData.accountName[0].toUpperCase() : 'A'}
                </button>
            </div>
        </nav>

    )
}

export default Navbar

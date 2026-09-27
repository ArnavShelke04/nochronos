import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoSettingsOutline, IoLogOutOutline } from "react-icons/io5";

const Navbar = ({ userData }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const searchRef = useRef(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            if (!searchQuery.trim()) {
                setSearchResults([]);
                return;
            }
            setIsSearching(true);
            try {
                const token = localStorage.getItem('jwt_token');
                const res = await fetch(`http://localhost:5000/api/pools/search?query=${encodeURIComponent(searchQuery)}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    setSearchResults(data.data);
                }
            } catch (err) {
                console.error("Search error:", err);
            } finally {
                setIsSearching(false);
            }
        };

        const timer = setTimeout(fetchResults, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) setShowResults(false);
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setDropdownOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            const token = localStorage.getItem('jwt_token');
            await fetch('http://localhost:5000/api/users/logout', { 
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem('jwt_token');
            navigate('/'); 
        }
    };

    return (
        <nav className="sticky top-0 z-50 flex w-full justify-between items-center px-8 py-4 bg-black/80 backdrop-blur-md border-b border-zinc-900">
            <div className="flex items-center gap-3">
                <h1 onClick={() => navigate('/')} className="text-2xl font-black tracking-tighter text-white lowercase cursor-pointer">
                    nochronos
                </h1>
            </div>
            
            <div className="flex items-center gap-6">
                <div className="relative" ref={searchRef}>
                    <input
                        type="text"
                        placeholder='Search for pools'
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowResults(true);
                        }}
                        onFocus={() => setShowResults(true)}
                        className='bg-zinc-900 placeholder-zinc-500 text-sm text-white rounded-full py-2.5 pl-5 pr-12 w-64 border border-zinc-800 focus:outline-none focus:border-zinc-700 focus:w-80 transition-all duration-300'
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-500 font-mono pointer-events-none">⌘K</span>
                    
                    {showResults && searchQuery.trim() && (
                        <div className="absolute top-full mt-2 w-full bg-[#181818] border border-zinc-800 rounded-xl shadow-2xl py-2 max-h-80 overflow-y-auto animate-fade-in z-50">
                            {isSearching ? (
                                <div className="px-4 py-3 text-sm text-zinc-400">Searching...</div>
                            ) : searchResults.length > 0 ? (
                                searchResults.map((pool) => (
                                    <div 
                                        key={pool._id} 
                                        className="px-4 py-3 hover:bg-zinc-800/50 cursor-pointer border-b border-zinc-800/50 last:border-0 transition-colors"
                                        onClick={() => {
                                            // NAVIGATE TO THE PAGE & PASS POOL DATA IN STATE
                                            navigate(`/pool/${pool._id}`, { state: { pool } });
                                            setShowResults(false);
                                            setSearchQuery('');
                                        }}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="text-sm font-bold text-white truncate pr-2">{pool.name}</p>
                                            <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full">{pool.currency}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-zinc-500">
                                            <span>{pool.subscription?.name}</span>
                                            <span>•</span>
                                            <span>{pool.members?.length || 1}/{pool.maxMembers} Members</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 py-3 text-sm text-zinc-400">No pools found</div>
                            )}
                        </div>
                    )}
                </div>

                <div className="relative" ref={dropdownRef}>
                    <button 
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-red-700 hover:bg-red-600 font-bold text-sm tracking-wide text-white border border-red-800/50 shadow-lg shadow-red-900/20 active:scale-95 transition-transform duration-100"
                    >
                        {userData?.name ? userData.name[0].toUpperCase() : 'A'}
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-3 w-56 bg-[#181818] border border-zinc-800 rounded-xl shadow-2xl py-2 animate-fade-in origin-top-right">
                            <div className="px-4 py-3 border-b border-zinc-800 mb-1">
                                <p className="text-sm font-bold text-white truncate">{userData?.name || "User Account"}</p>
                                <p className="text-xs text-zinc-500 truncate">{userData?.email || "No email provided"}</p>
                            </div>
                            <button 
                                onClick={() => { setDropdownOpen(false); navigate('/settings'); }}
                                className="w-full px-4 py-2.5 text-left text-sm text-zinc-300 hover:bg-zinc-800/50 hover:text-white flex items-center gap-3 transition-colors"
                            >
                                <IoSettingsOutline className="text-lg text-zinc-400" /> Account Settings
                            </button>
                            <button 
                                onClick={handleLogout}
                                className="w-full px-4 py-2.5 text-left text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-3 transition-colors mt-1"
                            >
                                <IoLogOutOutline className="text-lg" /> Sign Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    )
}
export default Navbar;
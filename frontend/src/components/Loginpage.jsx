import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <--- Import this to change paths!

const Loginpage = ({ setData }) => { // <--- Destructure 'setData' correctly
    const [username, setUsername] = useState('');
    const navigate = useNavigate(); // <--- Initialize the redirect tool

    const handleLogin = (e) => {
        e.preventDefault();
        if (!username.trim()) return;

        const mockLoggedUser = {
            id_ : 34584,
            accountName: username,
            avatarUrl: username.charAt(0).toUpperCase(),
            myInbox: [
                { id: "m1", title: "Welcome!", sender: "System", preview: "Glad to have you back.", time: "Just Now", unread: true }
            ],
            myPools: []
        };

        // 1. Save it to localStorage
        localStorage.setItem('nochronos_user', JSON.stringify(mockLoggedUser));
        
        // 2. Pass it back up to App.jsx state
        setData(mockLoggedUser);

        // 3. FORCE the URL bar to change locations!
        navigate(`/homepage/${mockLoggedUser.id_}`);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white p-4">
            <div className="w-full max-w-sm bg-[#121212] border border-zinc-900 rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-6">
                    <span className="text-[10px] font-bold tracking-widest text-amber-500 uppercase">Welcome back</span>
                    <h2 className="text-2xl font-extrabold mt-1">Sign in to Nochronos</h2>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="text-xs text-zinc-400 font-semibold block mb-2">Username</label>
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your name..." 
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                        />
                    </div>
                    <button type="submit" className="w-full bg-amber-500 text-black py-2.5 rounded-lg text-sm font-bold hover:bg-amber-400 transition-colors mt-2 cursor-pointer">
                        Let's Go
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Loginpage;
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userContext } from '../context';
import { IoPersonOutline, IoNotificationsOutline, IoShieldCheckmarkOutline, IoLogOutOutline } from "react-icons/io5";
import Navbar from './Navbar';

const AccountSettings = () => {
    const { userData } = useContext(userContext); // Assuming your context gives us user data
    const navigate = useNavigate();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            const token = localStorage.getItem('jwt_token');
            // Call your Express logout route that we fixed earlier
            await fetch('http://localhost:5000/api/auth/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            // ALWAYS run this, even if the server fails, so the user isn't trapped
            localStorage.removeItem('jwt_token');
            navigate('/login'); // Redirect them to your login page
        }
    };

    return (
        <div className='flex flex-col bg-black h-screen text-white overflow-hidden font-sans select-none'>
            <Navbar userData={userData} />
            <main className="flex-1 p-6 md:p-8 bg-zinc-950 overflow-y-auto custom-scrollbar">
                <div className="w-full max-w-3xl mx-auto mt-8 animate-fade-in bg-[#121212] p-8 rounded-2xl border border-zinc-900 shadow-2xl">
                    
                    {/* Header */}
                    <div className="border-b border-zinc-900 pb-5 mb-8">
                        <span className="text-[10px] font-bold tracking-widest text-zinc-500 uppercase">Preferences</span>
                        <h2 className="text-2xl font-extrabold text-white tracking-tight mt-1">Account Settings</h2>
                    </div>

                    <div className="space-y-6">
                        
                        {/* Profile Section */}
                        <div className="bg-[#181818] border border-zinc-800/80 rounded-2xl p-6 shadow-xl flex items-center justify-between">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700">
                                    <IoPersonOutline className="text-2xl text-zinc-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">{userData?.name || "No Name Set"}</h3>
                                    <p className="text-sm text-zinc-500">{userData?.email || "email@example.com"}</p>
                                </div>
                            </div>
                            <button className="px-4 py-2 bg-[#121212] hover:bg-zinc-800 border border-zinc-800 rounded-lg text-sm font-semibold text-white transition-colors">
                                Edit Profile
                            </button>
                        </div>

                        {/* Settings Options List */}
                        <div className="bg-[#181818] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
                            
                            {/* Placeholder Setting 1 */}
                            <div className="p-5 flex items-center justify-between border-b border-zinc-900 hover:bg-zinc-900/30 transition-colors cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-zinc-900 rounded-lg text-zinc-400">
                                        <IoNotificationsOutline className="text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">Notifications</p>
                                        <p className="text-xs text-zinc-500">Manage your email and app alerts</p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Manage &rarr;</span>
                            </div>

                            {/* Placeholder Setting 2 */}
                            <div className="p-5 flex items-center justify-between border-b border-zinc-900 hover:bg-zinc-900/30 transition-colors cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-zinc-900 rounded-lg text-zinc-400">
                                        <IoShieldCheckmarkOutline className="text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">Security & Password</p>
                                        <p className="text-xs text-zinc-500">Update your password and secure your account</p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Manage &rarr;</span>
                            </div>

                            {/* LOGOUT BUTTON - The Danger Zone */}
                            <div className="p-5 flex items-center justify-between bg-red-950/10 hover:bg-red-950/20 transition-colors cursor-pointer group" onClick={handleLogout}>
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-red-500/10 rounded-lg text-red-500 group-hover:bg-red-500/20 transition-colors">
                                        <IoLogOutOutline className="text-xl" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-red-500">Sign Out</p>
                                        <p className="text-xs text-red-500/60">Log out of this device</p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold text-red-600 uppercase tracking-widest">
                                    {isLoggingOut ? "Logging out..." : "Logout"}
                                </span>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AccountSettings;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Loginpage = ({ setData }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState(''); // Added email state
    const [password, setPassword] = useState(''); 
    const [error, setError] = useState(''); 
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        // Validation check to make sure email isn't blank either
        if (!username.trim() || !email.trim() || !password.trim()) {
            setError('Please fill in all fields.');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: username.trim(),
                    email: email.trim().toLowerCase(), // Added email to server payload
                    password: password
                })
            });

            const result = await response.json();

            if (response.ok) {
                localStorage.setItem('nochronos_token', result.token);
                localStorage.setItem('nochronos_user', JSON.stringify(result.user));
                setData(result.user);
                navigate(`/homepage/${result.user.id_}`);
            } else {
                setError(result.message || 'Authentication failed.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Could not connect to the authentication server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white p-4">
            <div className="w-full max-w-sm bg-[#121212] border border-zinc-900 rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-6">
                    <span className="text-[10px] font-bold tracking-widest text-amber-500 uppercase">Welcome back</span>
                    <h2 className="text-2xl font-extrabold mt-1">Sign in to Nochronos</h2>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-2.5 rounded-lg font-medium">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="text-xs text-zinc-400 font-semibold block mb-2">Username</label>
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your name..." 
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                            disabled={loading}
                        />
                    </div>

                    {/* --- Email Input Section Added Below --- */}
                    <div>
                        <label className="text-xs text-zinc-400 font-semibold block mb-2">Email Address</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com" 
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="text-xs text-zinc-400 font-semibold block mb-2">Password</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••" 
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                            disabled={loading}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-amber-500 text-black py-2.5 rounded-lg text-sm font-bold hover:bg-amber-400 transition-colors mt-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...' : "Let's Go"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Loginpage;
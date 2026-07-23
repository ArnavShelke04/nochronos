import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Loginpage = ({ setData }) => {
    const [isRegistering, setIsRegistering] = useState(false); // Controls current form view
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [error, setError] = useState(''); 
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Toggle view and wipe out old errors/inputs
    const toggleView = () => {
        setIsRegistering(!isRegistering);
        setError('');
        setUsername('');
        setEmail('');
        setPassword('');
    };

    const handleAuthSubmit = async (e) => {
        e.preventDefault();
        
        if (!email.trim() || !password.trim() || (isRegistering && !username.trim())) {
            setError('Please fill in all required fields.');
            return;
        }

        setError('');
        setLoading(true);

        // Determine target backend route dynamically
        const endpoint = isRegistering 
            ? 'http://localhost:5000/api/auth/register' 
            : 'http://localhost:5000/api/auth/login';

        const payload = isRegistering 
            ? { name: username.trim(), email: email.trim().toLowerCase(), password }
            : { email: email.trim().toLowerCase(), password };

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok) {
                // Aligned to match the 'jwt_token' read expectation inside App.jsx
                localStorage.setItem('jwt_token', result.token); 
                setData(result.user);
                
                const targetId = result.user.id_ || result.user._id;
                navigate(`/homepage/${targetId}`);
            } else {
                setError(result.message || 'Authentication failed.');
            }
        } catch (err) {
            console.error('Authentication error:', err);
            setError('Could not connect to the authentication server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white p-4">
            <div className="w-full max-w-sm bg-[#121212] border border-zinc-900 rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-6">
                    <span className="text-[10px] font-bold tracking-widest text-amber-500 uppercase">
                        {isRegistering ? 'Get Started' : 'Welcome back'}
                    </span>
                    <h2 className="text-2xl font-extrabold mt-1">
                        {isRegistering ? 'Create your account' : 'Sign in to Nochronos'}
                    </h2>
                </div>
                
                <form onSubmit={handleAuthSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-2.5 rounded-lg font-medium">
                            {error}
                        </div>
                    )}

                    {isRegistering && (
                        <div>
                            <label className="text-xs text-zinc-400 font-semibold block mb-2">Username</label>
                            <input 
                                type="text" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Choose a public display name..." 
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                                disabled={loading}
                            />
                        </div>
                    )}

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
                        {loading ? 'Processing...' : isRegistering ? 'Register Account' : "Let's Go"}
                    </button>
                </form>

                <div className="mt-6 text-center text-xs text-zinc-500">
                    {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
                    <button 
                        onClick={toggleView}
                        className="text-amber-500 font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer focus:outline-none"
                        disabled={loading}
                    >
                        {isRegistering ? 'Sign In' : 'Sign Up'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Loginpage;
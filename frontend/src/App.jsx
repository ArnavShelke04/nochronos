import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { userContext } from './context';
import './App.css';
import HomePage from './components/HomePage';
import Loginpage from './components/Loginpage';
import AccountSettings from './components/AccountSettings';
import PoolPage from './components/PoolPage'; // <-- Brought this back!

function App() {
  const [Data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const verifyUserSession = async () => {
    const accessToken = localStorage.getItem('jwt_token');
    if (!accessToken) {
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/auth/me', {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        const freshUser = result.data || result;
        setData(freshUser); 
      } else {
        localStorage.removeItem('jwt_token'); 
      }
    } catch (err) {
      console.error("Authentication sync failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    verifyUserSession();
  }, []);

  const messageRead = async (messageId) => {
    if (!Data) return;
    const token = localStorage.getItem('jwt_token');
    const userId = Data.id_ || Data._id;

    try {
      await fetch(`http://localhost:5000/homepage/${userId}/inbox/${messageId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ unread: false })
      });
    } catch (err) {
      console.error("Failed to update message path:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-amber-500 font-semibold">
        Loading Nochronos...
      </div>
    );
  }

  return (
    <BrowserRouter>
      <userContext.Provider value={{ userData: Data, func: messageRead, refreshUser: verifyUserSession }}>
        <Routes>
          <Route path="/" element={Data ? <Navigate to={`/homepage/${Data.id_ || Data._id}`} replace /> : <Loginpage setData={setData} />} />
          <Route path="/homepage/:userId" element={Data ? <HomePage /> : <Navigate to="/" replace />} />
          <Route path="/settings" element={<AccountSettings />} />
          
          {/* THE RESTORED POOL ROUTE */}
          <Route path="/pool/:poolId" element={Data ? <PoolPage /> : <Navigate to="/" replace />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </userContext.Provider>
    </BrowserRouter>
  );
}

export default App;
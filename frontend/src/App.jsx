import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { userContext } from './context';
import './App.css';
import HomePage from './components/HomePage';
import Loginpage from './components/Loginpage';

function App() {
  const [Data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Synchronize dynamic active user validation via server on app mounting
  useEffect(() => {
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
          const freshUser = await response.json();
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

    verifyUserSession();
  }, []);

  // RESTful PATCH call targeting a specific message endpoint URL
  const messageRead = async (messageId) => {
    if (!Data) return;
    const token = localStorage.getItem('jwt_token');
    const userId = Data.id_ || Data._id;

    try {
      const response = await fetch(`http://localhost:5000/homepage/${userId}/inbox/${messageId}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ unread: false })
      });
      
      const result = await response.json();
      console.log("Message marked as read:", result);
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
      <userContext.Provider value={{ userData: Data, func: messageRead }}>
        <Routes>
          {/* Root authentication gateway route */}
          <Route 
            path="/" 
            element={Data ? <Navigate to={`/homepage/${Data.id_ || Data._id}`} replace /> : <Loginpage setData={setData} />} 
          />
          
          {/* Main User Dashboard Route */}
          <Route 
            path="/homepage/:userId" 
            element={Data ? <HomePage /> : <Navigate to="/" replace />} 
          />

          {/* Clean catch-all fallback fallback routing block */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </userContext.Provider>
    </BrowserRouter>
  );
}

export default App;
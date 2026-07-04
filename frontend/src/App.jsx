import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { userContext } from './context';
import './App.css';
import HomePage from './components/HomePage';
import Loginpage from './components/Loginpage';

function App() {
  // Initialize state directly from localStorage so it persists instantly on page refresh!
  const [Data, setData] = useState(() => {
    const savedUser = localStorage.getItem('nochronos_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Hardcoded fallback data structure for rendering context (Alex)
  const defaultUserData = {
    accountName: Data ? Data.accountName : "Alex",
    avatarUrl: Data ? Data.avatarUrl : "A", 
    myInbox: Data ? Data.myInbox : [],
    myPools: [
      {
        id: "pool-01",
        subscription: { name: "Spotify Premium Family", category: "Music", totalMonthlyCost: 16.99 },
        creator: { name: "Jordan", id: "user-883", avatarUrl: "J" },
        payment: { amount: 3.50, currency: "USD", dueDate: "05" },
        members: { currentCount: 5, maxCap: 6, memberIds: ["user-123", "user-883"] },
        status: "active"
      }
    ]
  };

  return (
    <BrowserRouter>
      {/* We pass the active Data (or defaults) down into the context context */}
      <userContext.Provider value={defaultUserData}>
        <Routes>
          {/* If logged in, redirect root "/" straight to their homepage ID. If not, show Login. */}
          <Route 
            path="/" 
            element={Data ? <Navigate to={`/homepage/${Data.id_}`} replace /> : <Loginpage setData={setData} />} 
          />
          
          {/* The Dynamic Route */}
          <Route path="/homepage/:userId" element={<HomePage />} />
        </Routes>
      </userContext.Provider>
    </BrowserRouter>
  );
}

export default App;
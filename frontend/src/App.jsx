import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { userContext } from './context';
import './App.css';
import HomePage from './components/HomePage';
import Loginpage from './components/Loginpage';

function App() {
  const [isConnected, setisConnected] = useState("disconnected");
  const [Data, setData] = useState(() => {
    const savedUser = localStorage.getItem('nochronos_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  
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
  const messageRead = async (message) =>{
    try {
      let msg = await fetch(`http://localhost:3000/homepage/${Data.id_}/inbox`,
        {method: 'PATCH', // or 'PUT'
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            unread: false
          })
        })
        let res = msg.text();
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    }
    const conn = async () => {
      // 1. Guard clause: Don't fetch if Data or Data.id_ isn't there yet
      if (!Data || !Data.id_) return;
      
      try {
        let x = await fetch(`http://localhost:3000/homepage/${Data.id_}`);
        let res = await x.text();
        console.log(res);
      } catch (err) {
        console.log("error", err);
      }
    };
    
    const contextValue = {
      userData : defaultUserData,
      func :messageRead
    }
  useEffect(() => {
    // 2. Add Data to the dependency array so this runs whenever Data updates (like after logging in)
    conn();
  }, [Data]); 
  
  return (
    <BrowserRouter>
      <userContext.Provider value={contextValue}>
        <Routes>
          <Route 
            path="/" 
            element={Data ? <Navigate to={`/homepage/${Data.id_}`} replace /> : <Loginpage setData={setData} />} 
          />
          <Route path="/homepage/:userId" element={<HomePage />} />
        </Routes>
      </userContext.Provider>
    </BrowserRouter>
  );
}

export default App;
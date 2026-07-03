import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import HomePage from './components/HomePage'
import { userContext } from './context'
function App() {
  
  const userData = {
  accountName: "Alex",
  avatarUrl: "A", 
  
  myInbox: [
    { 
      id: "m1", 
      title: "Welcome to nochronos", 
      sender: "nochronos Team",
      preview: "Thanks for joining us! Here is a quick guide to getting started with your split pools.",
      time: "10:30 AM",
      date: "2026-06-23", 
      unread: false 
    },
    { 
      id: "m2", 
      title: "Payment is due", 
      sender: "nochronos Team",
      preview: "Hey Alex, here is the request for this month's premium family plan split.",
      time: "Yesterday",
      date: "2026-06-22", 
      unread: true 
    },
    { 
      id: "m3", 
      title: "Netflix Pool: Monthly bill processed", 
      sender: "nochronos Team",
      preview: "Your automated payment of $5.25 for the Premium Ultra HD pool went through successfully.",
      time: "4 days ago",
      date: "2026-06-20", 
      unread: true 
    }
  ],
  
  // Here is your new Pools data structure
  myPools: [
    {
      id: "pool-01",
      subscription: {
        name: "Spotify Premium Family",
        category: "Music",
        totalMonthlyCost: 16.99 // Good to have for ledger breakdowns
      },
      creator: {
        name: "Jordan",
        id: "user-883",
        avatarUrl: "J"
      },
      payment: {
        amount: 3.50,         // Keep as a float/number for math operations
        currency: "USD",       // Keeps it scalable if you handle multi-currencies
        dueDate: "05"          // Day of the month the bill cycles
      },
      members: {
        currentCount: 5,       // Quickly readable for the front-end UI badge
        maxCap: 6,
        memberIds: ["user-123", "user-883", "user-441", "user-092", "user-111"] // Helpful for access logic
      },
      status: "active"         // active, paused, or pending-split
    },
    {
      id: "pool-02",
      subscription: {
        name: "Netflix Ultra HD",
        category: "Streaming",
        totalMonthlyCost: 22.99
      },
      creator: {
        name: "Alex",          // You are the creator of this one!
        id: "user-123",
        avatarUrl: "A"
      },
      payment: {
        amount: 5.25,
        currency: "USD",
        dueDate: "20"
      },
      members: {
        currentCount: 4,
        maxCap: 4,
        memberIds: ["user-123", "user-772", "user-590", "user-312"]
      },
      status: "active"
    }
    
  ]
};
  return (
    <>
      <userContext.Provider value={userData}>
      <HomePage />
      </userContext.Provider>
    </>
  )
}

export default App

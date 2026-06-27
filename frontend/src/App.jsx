import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import HomePage from './components/HomePage'

function App() {
  const [count, setCount] = useState(0)
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
      title: "Spotify Pool: Jordan requested $3.50", 
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
  
  myPools: []
};
  return (
    <>
      <HomePage userData={userData}/>
    </>
  )
}

export default App

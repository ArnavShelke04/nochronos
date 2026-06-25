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
    { id: "m1", title: "Welcome to nochronos", unread: false, date: "2026-06-23" },
    { id: "m2", title: "Spotify Pool: Jordan requested $3.50", unread: true, date: "2026-06-22" },
    { id: "m3", title: "Netflix Pool: Monthly bill processed", unread: true, date: "2026-06-20" }
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

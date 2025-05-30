import React, { useState } from 'react'
import WelcomeScreen from './components/WelcomeScreen'
import ChatInterface from './components/ChatInterface'

export default function Home({ onStart }) {
  const [started, setStarted] = useState(false)
  const handleStart = () => setStarted(true)

  return (
    <div className="md:min-h-screen md:h-screen flex h-[100svh] flex-col items-center justify-end  md:justify-center  text-center  md:p-5  bg-blue-600  max-w-[100rem] mx-auto">
      {!started ? <WelcomeScreen onStart={handleStart} /> : <ChatInterface />}
    </div>
  )
}

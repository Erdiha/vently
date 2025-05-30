import React from 'react'

export default function WelcomeScreen({ onStart }) {
  return (
    <div className="max-h-screen flex flex-col items-center justify-evenly md:h-[100vh]  h-[90svh] text-center md:p-6 bg-transparent animate-fade-in">
      <div className="flex flex-col items-center mb-8">
        <h1 className="md:text-5xl text-4xl text-white font-bold mb-10">
          Welcome to Vently
        </h1>
        <p className="md:text-xl  text-xl text-slate-100 mb-6 max-w-md px-10">
          Talk freely. No judgment. No tracking. 100% anonymous support from our
          AI.
        </p>
      </div>
      <div className="mt-10 text-xl px-10 md:text-xl text-center text-slate-200 ring-[1px] ring-button p-2">
        <p>
          No signup. No storage. <br /> Just a safe space to vent.
        </p>
      </div>
      <button
        onClick={onStart}
        className="bg-button hover:bg-button-hover text-black font-bold px-6 py-3 rounded-lg shadow transition"
      >
        Start Chat
      </button>
    </div>
  )
}

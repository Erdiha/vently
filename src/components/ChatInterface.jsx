// src/components/ChatInterface.jsx
import React, { useState, useRef, useEffect } from 'react'
import { encrypt, decrypt } from '../utils/encryptMessage'
import { MdOutlinePhotoCamera } from 'react-icons/md'
import { FaMicrophoneLines } from 'react-icons/fa6'
import { generateAiResponse } from '../utils/generateAiResponse'
import analyzeSentiment from '../utils/analyzeSentiment'

const ChatInterface = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const chatEndRef = useRef(null)
  const chatContainerRef = useRef(null)
  const inputRef = useRef(null)
  const [keyboardActive, setKeyboardActive] = useState(false)

  const handleSend = () => {
    if (!input.trim()) return
    const { mood, keywords } = analyzeSentiment(input)

    const newMessage = {
      sender: 'user',
      text: input,
      keywords,
      time: new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }
    setMessages((prev) => [...prev, newMessage])
    setIsTyping(true)
    generateAiResponse(`${mood} — keywords: ${keywords.join(', ')}`).then(
      (text) => {
        const botReply = {
          sender: 'bot',
          text,
          time: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        }
        setMessages((prev) => [...prev, botReply])
        setIsTyping(false)
      },
    )

    setInput('')
  }

  const handleVoiceInput = async () => {
    try {
      const recognition = new (window.SpeechRecognition ||
        window.webkitSpeechRecognition)()
      recognition.lang = 'en-US'
      recognition.interimResults = false
      recognition.maxAlternatives = 1

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
      }

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
      }

      recognition.start()
    } catch (error) {
      console.error('Voice input not supported:', error)
    }
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    if (chatContainerRef.current) {
      chatContainerRef.current.style.scrollBehavior = 'smooth'
    }
  }, [messages, isTyping])

  useEffect(() => {
    const handleViewportChange = () => {
      const height = window.visualViewport?.height
      const isKeyboardVisible = height && height < window.innerHeight - 100
      setKeyboardActive(isKeyboardVisible)

      if (isKeyboardVisible) {
        setTimeout(() => {
          chatEndRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          })
        }, 250)
      }
    }

    window.visualViewport?.addEventListener('resize', handleViewportChange)
    return () => {
      window.visualViewport?.removeEventListener('resize', handleViewportChange)
    }
  }, [])

  useEffect(() => {
    const raw = localStorage.getItem('vently-chat')
    if (raw) {
      const loaded = decrypt(raw)
      if (loaded) setMessages(loaded)
    }
  }, [])

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem('vently-chat')
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <div className="flex flex-col md:min-h-screen h-[100svh] w-full justify-between md:px-4 md:py-6 px-2 py-3 md:pb-6 overflow-hidden 3xl:w-[50%] max-w-[55rem]">
      <div className="text-center mb-4 md:mb-6 flex flex-col items-center gap-2">
        <h2 className="md:text-4xl text-3xl font-extrabold text-start text-slate-100">
          Vently
        </h2>
        <p
          className={`text-sm md:text-base text-slate-200 max-w-[600px] text-start italic ${
            window.innerWidth < 600 ? 'hidden' : 'block'
          }`}
        >
          Your private space to vent, think, and feel.
        </p>
      </div>

      <div
        ref={chatContainerRef}
        className={`flex-1 overflow-y-auto bg-white shadow-inner px-2 py-6 ${
          keyboardActive ? 'pt-28' : ''
        }`}
        style={{ minHeight: 0 }}
      >
        <div className="flex flex-col justify-end gap-4 min-h-full">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[70%] px-4 py-3 rounded-xl text-sm leading-relaxed animate-fade-in ${
                msg.sender === 'user'
                  ? 'bg-slate-100 text-black self-end text-right'
                  : 'bg-slate-600 text-slate-50 self-start text-left'
              }`}
            >
              {msg.text}
              {msg.sender === 'user' && msg.keywords?.length > 0 && (
                <div className="text-xs text-slate-900 mt-1 italic border">
                  keywords: {msg.keywords.join(', ')}
                  mood: {msg.mood}
                </div>
              )}
              <div className="text-[10px] mt-1 opacity-60">{msg.time}</div>
            </div>
          ))}
          {isTyping && (
            <div className="text-xs italic text-slate-500 px-4 self-start animate-pulse">
              Vently is typing...
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      <div className="mt-3 md:mt-6 md:gap-2 gap-1 flex">
        <div className="w-full h-full flex flex-row items-center bg-white rounded-full border border-gray-300 shadow-sm focus-within:ring-1 focus-within:ring-indigo-900 transition">
          <input
            ref={inputRef}
            type="text"
            className="flex-1 px-4 py-3 rounded-full focus:outline-none"
            placeholder="Type something…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            onFocus={() => {
              setKeyboardActive(true)
              setTimeout(() => {
                chatEndRef.current?.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center',
                })
              }, 300)
            }}
            onBlur={() => {
              setKeyboardActive(false)
            }}
          />
          <MdOutlinePhotoCamera
            size={24}
            className="text-black mr-2 font-normal cursor-pointer"
          />
        </div>

        <button
          onClick={handleSend}
          className="bg-white text-black md:px-6 md:py-3 text-sm md:text-lg rounded-xl md:font-semibold px-2 py-2 hover:bg-indigo-700 shadow-md transition hidden md:inline-block"
        >
          Send
        </button>
        <button
          onClick={handleVoiceInput}
          className="bg-white md:px-4 md:py-3 p-3 aspect-square rounded-full font-semibold hover:bg-indigo-50 shadow-md transition"
        >
          <FaMicrophoneLines size={24} className="font-bold text-black" />
        </button>
      </div>
    </div>
  )
}

export default ChatInterface

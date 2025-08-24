import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, MessageCircle, X, Bot, User, Sparkles, BookOpen, Brain, TrendingUp, Settings } from 'lucide-react'

export default function HelpdeskChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your AI assistant for the BookRec system. How can I help you today? 🤖✨',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const quickActions = [
    { icon: BookOpen, label: 'Data Processing', description: 'Learn about data preprocessing' },
    { icon: Brain, label: 'Genre Classification', description: 'Understand ML classification' },
    { icon: TrendingUp, label: 'Popularity Analysis', description: 'Explore analytics features' },
    { icon: Settings, label: 'System Help', description: 'Get technical support' }
  ]

  const handleQuickAction = (action) => {
    const responses = {
      'Data Processing': 'Data preprocessing is the first step in Information Retrieval! It involves cleaning, standardizing, and preparing your book dataset for analysis. Upload a CSV file and our system will automatically clean duplicates, standardize genres, and validate data quality. 📊✨',
      'Genre Classification': 'Our genre classification uses advanced NLP techniques! We combine TF-IDF vectorization, machine learning models, and rule-based fallbacks to accurately categorize books. The system learns from your data and provides confidence scores for each prediction. 🏷️🤖',
      'Popularity Analysis': 'Popularity analysis combines web analytics concepts with book data! We use Bayesian scoring algorithms, time-series analysis, and trend detection to understand what makes books popular. Get insights into genre trends, year-over-year patterns, and user behavior. 📈📚',
      'System Help': 'Need technical help? Our system is built with Python FastAPI backend and React frontend. It supports multiple themes, real-time processing, and integrates with various ML models. Check the API status and system information in the dashboard! 🛠️💻'
    }

    const response = responses[action.label] || 'I\'m here to help! What would you like to know?'
    
    // Add user message
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'user',
      content: action.label,
      timestamp: new Date()
    }])

    // Simulate typing
    setIsTyping(true)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        content: response,
        timestamp: new Date()
      }])
      setIsTyping(false)
    }, 1000)
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue)
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'bot',
        content: aiResponse,
        timestamp: new Date()
      }])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (input) => {
    const lowerInput = input.toLowerCase()
    
    if (lowerInput.includes('hello') || lowerInput.includes('hi')) {
      return 'Hello there! 👋 How can I assist you with the BookRec system today?'
    } else if (lowerInput.includes('feature') || lowerInput.includes('function')) {
      return 'The BookRec system has 4 main features: 1) Data Preprocessing, 2) Genre Classification, 3) Popularity Analysis, and 4) Recommendation Engine. Each uses advanced AI and IR techniques! 🚀'
    } else if (lowerInput.includes('model') || lowerInput.includes('ai')) {
      return 'We use multiple AI models: custom data quality assessment, BERT-based genre classification, time-series popularity prediction, and sentence transformers for recommendations. It\'s a hybrid approach! 🤖✨'
    } else if (lowerInput.includes('irwa') || lowerInput.includes('information retrieval')) {
      return 'IRWA (Information Retrieval & Web Analytics) concepts are core to our system! We implement TF-IDF, document classification, popularity scoring, and recommendation algorithms. Perfect for academic projects! 📚🎓'
    } else {
      return 'That\'s an interesting question! The BookRec system combines Information Retrieval, NLP, and Web Analytics to create intelligent book recommendations. Feel free to ask about specific features! 💡'
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Chatbot Toggle Button */}
      <motion.button
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 2 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: 0 }}
              animate={{ rotate: 180 }}
              exit={{ rotate: 0 }}
              transition={{ duration: 0.3 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 0 }}
              animate={{ rotate: 0 }}
              exit={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <MessageCircle size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chatbot Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-container"
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 100 }}
            transition={{ duration: 0.3, type: 'spring', damping: 25 }}
          >
            {/* Header */}
            <motion.div 
              className="chatbot-header"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="chatbot-title">
                <Bot className="chatbot-icon" />
                <div>
                  <h3>AI Assistant</h3>
                  <p>BookRec System Help</p>
                </div>
              </div>
              <motion.button
                className="close-button"
                onClick={() => setIsOpen(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} />
              </motion.button>
            </motion.div>

            {/* Quick Actions */}
            <motion.div 
              className="quick-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h4>Quick Help</h4>
              <div className="action-grid">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.label}
                    className="action-button"
                    onClick={() => handleQuickAction(action)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <action.icon size={20} />
                    <span className="action-label">{action.label}</span>
                    <span className="action-description">{action.description}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Messages */}
            <motion.div 
              className="messages-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="messages">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`message ${message.type}`}
                    initial={{ opacity: 0, x: message.type === 'user' ? 50 : -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="message-avatar">
                      {message.type === 'bot' ? <Bot size={16} /> : <User size={16} />}
                    </div>
                    <div className="message-content">
                      <p>{message.content}</p>
                      <span className="message-time">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div
                    className="message bot typing"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="message-avatar">
                      <Bot size={16} />
                    </div>
                    <div className="message-content">
                      <div className="typing-indicator">
                        <motion.span
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.4, repeat: Infinity }}
                        >●</motion.span>
                        <motion.span
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.4, repeat: Infinity, delay: 0.2 }}
                        >●</motion.span>
                        <motion.span
                          animate={{ opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.4, repeat: Infinity, delay: 0.4 }}
                        >●</motion.span>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </motion.div>

            {/* Input */}
            <motion.div 
              className="chatbot-input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="input-container">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about BookRec..."
                  rows={1}
                  className="chatbot-textarea"
                />
                <motion.button
                  className="send-button"
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send size={18} />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

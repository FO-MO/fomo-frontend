"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

// Simple chatbot responses
const getAIResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();

  // Project ideas
  if (
    lowerMessage.includes("project idea") ||
    lowerMessage.includes("project suggestion")
  ) {
    return "I'd be happy to help you with project ideas! Here are some popular ones:\n\n1. **Mobile App Development** - Build a cross-platform app\n2. **AI/ML Project** - Create a machine learning model\n3. **Web Application** - Develop a full-stack web app\n4. **E-commerce Platform** - Build an online store\n5. **Social Network** - Create a community platform\n\nWhat type of project interests you most?";
  }

  // Skills
  if (lowerMessage.includes("skill") || lowerMessage.includes("learn")) {
    return "Great question! Here are some in-demand skills you should consider learning:\n\n🎯 **Technical Skills:**\n- React/Next.js for frontend\n- Node.js for backend\n- Python for AI/ML\n- Docker & Kubernetes\n\n💡 **Soft Skills:**\n- Project management\n- Team collaboration\n- Communication\n\nWhat area would you like to focus on?";
  }

  // Team building
  if (lowerMessage.includes("team") || lowerMessage.includes("collaborate")) {
    return "Building a great team is crucial! Here's how to find team members:\n\n1. **Use the Search feature** to find students with complementary skills\n2. **Join relevant clubs** to meet like-minded people\n3. **Post your project** in the Projects section\n4. **Attend hackathons** and networking events\n\nWould you like tips on managing a team effectively?";
  }

  // Internships
  if (lowerMessage.includes("internship") || lowerMessage.includes("job")) {
    return "Looking for internships? Here are some tips:\n\n✅ **Preparation:**\n- Build a strong portfolio with 2-3 projects\n- Keep your resume updated\n- Practice coding interviews\n\n🔍 **Where to look:**\n- Company career pages\n- LinkedIn\n- Handshake\n- Our Jobs section\n\nNeed help with interview preparation?";
  }

  // Getting started
  if (
    lowerMessage.includes("start") ||
    lowerMessage.includes("begin") ||
    lowerMessage.includes("how")
  ) {
    return "Let's get you started! Here's what you can do:\n\n1. **Explore Projects** - Browse ongoing projects or create your own\n2. **Connect with Peers** - Use the Search feature to find collaborators\n3. **Join Clubs** - Find communities that match your interests\n4. **Build Your Profile** - Showcase your skills and projects\n\nWhat would you like to explore first?";
  }

  // Greetings
  if (
    lowerMessage.includes("hello") ||
    lowerMessage.includes("hi") ||
    lowerMessage.includes("hey")
  ) {
    return "Hello! 👋 I'm your AI assistant here to help you with:\n\n• Project ideas and guidance\n• Finding team members\n• Career advice\n• Learning resources\n• Skill development\n\nWhat can I help you with today?";
  }

  // Default response
  return "That's an interesting question! I can help you with:\n\n• **Project ideas** - Get suggestions for your next project\n• **Team building** - Find the right collaborators\n• **Skills** - Learn what to focus on\n• **Internships** - Tips for landing your dream role\n• **Getting started** - Navigate the platform\n\nCould you tell me more about what you'd like to know?";
};

export default function AIAssistantPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello! 👋 I'm your AI assistant. I can help you with project ideas, team building, career guidance, and more. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(userMessage.content),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    "Give me project ideas",
    "How do I find team members?",
    "What skills should I learn?",
    "Help me get started",
  ];

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <main className="w-full h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col">
      <div className="max-w-5xl w-full mx-auto flex flex-col h-full">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">AI Assistant</h1>
              <p className="text-xs text-gray-600">Always here to help</p>
            </div>
          </div>
          <div className="w-20"></div> {/* Spacer for centering */}
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === "user"
                    ? "bg-gradient-to-br from-blue-400 to-blue-600"
                    : "bg-gradient-to-br from-teal-400 to-teal-600"
                }`}
              >
                {message.role === "user" ? (
                  <User className="w-5 h-5 text-white" />
                ) : (
                  <Bot className="w-5 h-5 text-white" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`flex-1 max-w-2xl ${
                  message.role === "user" ? "items-end" : "items-start"
                } flex flex-col`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    message.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-sm"
                      : "bg-white border border-gray-200 text-gray-900 rounded-tl-sm"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {message.content}
                  </p>
                </div>
                <span className="text-xs text-gray-500 mt-1 px-2">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        {messages.length === 1 && (
          <div className="px-6 pb-4">
            <p className="text-sm text-gray-600 mb-3">Quick prompts:</p>
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickPrompt(prompt)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-teal-500 hover:text-teal-700 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="px-6 py-4 border-t border-gray-200 bg-white">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                rows={1}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-teal-500 resize-none text-sm"
                style={{ maxHeight: "120px" }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isTyping}
              className="px-5 py-3 bg-teal-600 text-white rounded-2xl hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

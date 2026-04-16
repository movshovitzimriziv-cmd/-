/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Info, 
  Scale, 
  FileSearch,
  MessageSquare,
  RefreshCw,
  AlertCircle,
  Trees
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { FileUpload } from './components/FileUpload';
import { analyzeRights } from './services/aiService';
import { cn } from './lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await analyzeRights(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      setError('אירעה שגיאה בעיבוד הבקשה. אנא וודא שמפתח ה-API מוגדר כראוי.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg font-sans selection:bg-blue-100">
      {/* Decorative Top Border */}
      <div className="h-1.5 bg-brand-accent w-full" />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-brand-border sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border border-brand-border overflow-hidden">
              <img 
                src="https://i.imgur.com/PnXBqeA.jpeg" 
                alt="חרובוט" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Haruv&backgroundColor=b6e3f4';
                }}
              />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-semibold text-brand-ink tracking-tight">חרובוט</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-[11px] uppercase tracking-widest font-bold text-brand-muted">המדריך המלא לזכויות הילד בשבילכם</span>
              </div>
            </div>
          </div>
          <button 
            onClick={clearChat}
            className="group flex items-center gap-2 px-4 py-2 text-brand-muted hover:text-brand-ink hover:bg-slate-100 rounded-full transition-all duration-300"
          >
            <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-xs font-semibold uppercase tracking-wider">נקה שיחה</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-8 flex flex-col gap-10">
        {/* Hero / Info Section */}
        <section className="relative overflow-hidden bg-white rounded-[32px] p-8 md:p-10 border border-brand-border shadow-sm">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl font-serif font-medium text-brand-ink mb-4 leading-tight">
              מרכז מידע לזכויות ילדים <span className="italic">נפגעי עבירה</span>
            </h2>
            <p className="text-brand-muted text-lg leading-relaxed mb-6 font-light">
              מערכת זו מספקת מענה מקצועי ומדויק המבוסס אך ורק על בסיס הידע המשפטי המוגדר. 
              הבוט אינו משתמש במקורות חיצוניים כדי להבטיח את אמינות המידע ופרטיות המשתמש.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-brand-border text-xs font-bold text-brand-ink uppercase tracking-wider">
                <Shield size={14} className="text-brand-accent" />
                פרטיות מלאה
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-brand-border text-xs font-bold text-brand-ink uppercase tracking-wider">
                <Info size={14} className="text-brand-accent" />
                מידע מבוסס חוק
              </div>
            </div>
          </div>
          {/* Decorative Background Element */}
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-50" />
        </section>

        {/* Chat Interface */}
        <section className="flex-1 flex flex-col bg-white rounded-[32px] border border-brand-border shadow-xl shadow-slate-200/50 overflow-hidden min-h-[600px]">
          {/* Chat Header */}
          <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-brand-border shadow-sm">
                <img 
                  src="https://i.imgur.com/PnXBqeA.jpeg" 
                  alt="חרובוט" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Haruv&backgroundColor=b6e3f4';
                  }}
                />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-muted">צ'אט בירור זכויות</span>
            </div>
            <div className="text-[10px] font-bold text-brand-accent bg-blue-50 px-2 py-1 rounded uppercase tracking-widest">
              Live Analysis
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-8 py-8 space-y-10">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center overflow-hidden shadow-inner border border-brand-border">
                  <img 
                    src="https://i.imgur.com/PnXBqeA.jpeg" 
                    alt="חרובוט" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Haruv&backgroundColor=b6e3f4';
                    }}
                  />
                </div>
                <h3 className="text-2xl font-serif font-medium text-brand-ink mb-2">כיצד אוכל לסייע היום?</h3>
                <p className="text-brand-muted max-w-sm mx-auto font-light">
                  שאל אותי על זכויות הילד, חקירות ילדים או תהליכי העדה בבית המשפט.
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-6 max-w-[90%]",
                    msg.role === 'user' ? "mr-auto flex-row-reverse" : "ml-auto"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-md transition-transform hover:scale-110",
                    msg.role === 'user' ? "bg-brand-ink text-white" : "bg-white border border-brand-border text-brand-accent"
                  )}>
                    {msg.role === 'user' ? (
                      <User size={20} />
                    ) : (
                      <div className="w-full h-full rounded-full overflow-hidden bg-white">
                        <img 
                          src="https://i.imgur.com/PnXBqeA.jpeg" 
                          alt="חרובוט" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.currentTarget.src = 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Haruv&backgroundColor=b6e3f4';
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div className={cn(
                    "relative p-6 rounded-[24px] text-base leading-relaxed shadow-sm",
                    msg.role === 'user' 
                      ? "bg-white text-brand-ink border border-brand-border rounded-tr-none" 
                      : "bg-slate-50 text-brand-ink border border-brand-border rounded-tl-none"
                  )}>
                    <div className={cn(
                      "prose max-w-none",
                      "text-brand-ink"
                    )}>
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                    <div className={cn(
                      "text-[10px] mt-4 font-bold uppercase tracking-widest opacity-40",
                      msg.role === 'user' ? "text-left" : "text-right"
                    )}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-6 ml-auto"
              >
                <div className="w-10 h-10 rounded-full bg-white border border-brand-border overflow-hidden shadow-sm">
                  <img 
                    src="https://i.imgur.com/PnXBqeA.jpeg" 
                    alt="חרובוט" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.src = 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Haruv&backgroundColor=b6e3f4';
                    }}
                  />
                </div>
                <div className="bg-slate-50 border border-brand-border p-6 rounded-[24px] rounded-tl-none flex items-center gap-3">
                  <Loader2 size={20} className="animate-spin text-brand-accent" />
                  <span className="text-sm font-medium text-brand-muted uppercase tracking-widest">מעבד מידע משפטי...</span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-8 py-3 bg-red-50 border-t border-red-100 flex items-center gap-3 text-red-700 text-xs font-bold uppercase tracking-wider"
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Area */}
          <div className="p-8 bg-white border-t border-slate-100">
            <form onSubmit={handleSend} className="relative group">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="הקלד את שאלתך כאן..."
                disabled={isLoading}
                className="w-full bg-slate-50 border border-brand-border rounded-2xl px-6 py-5 text-base focus:ring-2 focus:ring-brand-accent/20 focus:border-brand-accent focus:bg-white outline-none transition-all disabled:opacity-50 pr-16"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-3 bg-brand-ink text-white rounded-xl hover:bg-brand-accent disabled:bg-slate-200 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-brand-ink/10"
              >
                <Send size={20} strokeWidth={2} />
              </button>
            </form>
            <div className="mt-4 flex items-center justify-center gap-6 text-[10px] font-bold text-brand-muted uppercase tracking-[0.2em]">
              <span className="flex items-center gap-1.5">
                <div className="w-1 h-1 bg-brand-accent rounded-full" />
                מבוסס ידע סגור
              </span>
              <span className="flex items-center gap-1.5">
                <div className="w-1 h-1 bg-brand-accent rounded-full" />
                ללא מידע חיצוני
              </span>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-12 border-t border-brand-border bg-white mt-10">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-brand-border shadow-sm overflow-hidden">
              <img 
                src="https://i.imgur.com/PnXBqeA.jpeg" 
                alt="חרובוט" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.src = 'https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Haruv&backgroundColor=b6e3f4';
                }}
              />
            </div>
            <span className="text-xs font-bold text-brand-ink uppercase tracking-widest">חרובוט – המדריך המלא לזכויות הילד בשבילכם</span>
          </div>
          <p className="text-[11px] text-brand-muted font-medium uppercase tracking-wider">
            © 2026 כל הזכויות שמורות • המידע אינו מהווה ייעוץ משפטי
          </p>
          <div className="flex gap-6">
            <Shield size={18} className="text-brand-muted opacity-50" />
            <Info size={18} className="text-brand-muted opacity-50" />
          </div>
        </div>
      </footer>
    </div>
  );
}



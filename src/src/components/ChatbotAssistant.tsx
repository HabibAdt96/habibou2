import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bot, User, Loader2, ShoppingCart, TrendingDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GoogleGenAI } from "@google/genai";

interface ProductSuggestion {
  id: string;
  titre: string;
  prix: number;
  image: string;
}

interface Message {
  id: string;
  text: string;
  user: boolean;
  suggestions?: ProductSuggestion[];
}

export default function ChatbotAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: "1", 
      text: "Salut ! Je suis l'assistant Habibou. Que cherches-tu aujourd'hui ?", 
      user: false 
    }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const ai = new GoogleGenAI(import.meta.env.VITE_GEMINI_API_KEY || { apiKey: import.meta.env.VITE_GEMINI_API_KEY! });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), text: input, user: true };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const model = "gemini-3-flash-preview";
      const systemPrompt = "Tu es l'assistant intelligent de Habibou, le premier comparateur de prix en Algérie. Tu aides les utilisateurs à trouver les meilleures offres (téléphones, PC, électroménager). Les prix sont en Dinars Algériens (DZD). Sois concis (3 phrases max). Réponds de manière conviviale et utilise des expressions algériennes si approprié.";

      const response = await ai.models.generateContent({
        model: model,
        contents: [
          { role: "user", parts: [{ text: systemPrompt }] },
          ...messages.map(m => ({
            role: m.user ? "user" : "model",
            parts: [{ text: m.text }]
          })),
          { role: "user", parts: [{ text: currentInput }] }
        ]
      });

      const responseText = response.text || "Désolé, je n'ai pas pu générer de réponse.";
      
      // Mock suggestions logic
      let suggestions: ProductSuggestion[] = [];
      if (currentInput.toLowerCase().match(/iphone|téléphone|samsung|prix/)) {
        suggestions = [
          { id: "1", titre: "iPhone 15 Pro", prix: 195000, image: "https://picsum.photos/200/200?random=10" },
          { id: "2", titre: "Galaxy S24 Ultra", prix: 185000, image: "https://picsum.photos/200/200?random=11" }
        ];
      }

      const botMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        text: responseText.trim(), 
        user: false,
        suggestions: suggestions 
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "Désolé, une erreur technique est survenue. Veuillez réessayer plus tard.",
        user: false
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-[60]">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-[350px] sm:w-[400px] h-[550px] bg-white dark:bg-[#111] border border-gray-100 dark:border-white/5 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#00b4d8] p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                  <Bot size={24} />
                </div>
                <div>
                  <h4 className="font-black text-sm uppercase tracking-widest">Assistant AI</h4>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-bold text-white/80">En ligne</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-gray-50/50 dark:bg-black/20"
            >
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.user ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] flex items-start gap-3 ${m.user ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      m.user ? 'bg-gray-200 dark:bg-white/10' : 'bg-[#00b4d8]/10 text-[#00b4d8]'
                    }`}>
                      {m.user ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed ${
                        m.user 
                          ? 'bg-black text-white dark:bg-white dark:text-black rounded-tr-none' 
                          : 'bg-white dark:bg-[#1a1a1a] dark:text-gray-200 shadow-sm border border-gray-100 dark:border-white/5 rounded-tl-none'
                      }`}>
                        {m.text}
                      </div>

                      {/* Product Suggestions */}
                      {m.suggestions && m.suggestions.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 pt-1">
                          {m.suggestions.map((p) => (
                            <div 
                              key={p.id}
                              className="w-40 flex-shrink-0 bg-white dark:bg-[#1a1a1a] p-3 rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm"
                            >
                              <img src={p.image} alt={p.titre} className="w-full h-20 object-contain mb-2 rounded-xl" />
                              <h5 className="text-[10px] font-black truncate mb-1">{p.titre}</h5>
                              <p className="text-[10px] font-black text-[#00b4d8]">
                                {new Intl.NumberFormat('fr-DZ').format(p.prix)} DA
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-[#1a1a1a] p-4 rounded-2xl rounded-tl-none border border-gray-100 dark:border-white/5">
                    <Loader2 size={16} className="animate-spin text-[#00b4d8]" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-white dark:bg-[#111] border-t border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-white/5 rounded-2xl p-2 border border-transparent focus-within:border-[#00b4d8] transition-all">
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Posez votre question..."
                  className="flex-1 bg-transparent py-2 px-3 text-sm font-bold outline-none dark:text-white"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="w-10 h-10 bg-[#00b4d8] text-white rounded-xl flex items-center justify-center hover:bg-[#0096b4] transition-all disabled:opacity-50 disabled:hover:scale-100 active:scale-95"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90 relative ${
          isOpen ? 'bg-black text-white dark:bg-white dark:text-black mt-2' : 'bg-[#00b4d8] text-white'
        }`}
      >
        {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
        {!isOpen && (
          <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white dark:border-[#050505]"></span>
          </span>
        )}
      </button>
    </div>
  );
}

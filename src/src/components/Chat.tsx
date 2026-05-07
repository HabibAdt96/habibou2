import React, { useState, useEffect, useRef } from "react";
import { 
  Send, 
  Search, 
  MoreVertical, 
  User, 
  ArrowLeft,
  CheckCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Conversation {
  user_id: number;
  nom: string;
  dernier_msg: string;
  heure: string;
  non_lu: boolean;
}

interface Message {
  id: number;
  expediteur_id: number;
  destinataire_id: number;
  contenu: string;
  lu: boolean;
  cree_le: string;
}

export default function Chat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentUserId = 1; // Simulation pour la démo

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch("/api/messages/conversations");
        const data = await res.json();
        setConversations(data);
      } catch (err) {
        console.error("Erreur chargement convs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
    const interval = setInterval(fetchConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  // Fetch messages for active conversation
  useEffect(() => {
    if (!activeConv) return;

    const fetchMessages = async () => {
      try {
        const res = await fetch(`/api/messages/conversation/${activeConv.user_id}`);
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Erreur chargement messages:", err);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [activeConv]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConv) return;

    try {
      const res = await fetch("/api/messages/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destinataire_id: activeConv.user_id,
          contenu: newMessage
        })
      });
      if (res.ok) {
        setNewMessage("");
        // Optimistic update ou refetch immédiat
        const updatedMsgs = await (await fetch(`/api/messages/conversation/${activeConv.user_id}`)).json();
        setMessages(updatedMsgs);
      }
    } catch (err) {
      console.error("Erreur envoi:", err);
    }
  };

  const formatHeure = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
      
      {/* SIDEBAR - LISTE DES CONVERSATIONS */}
      <div className={`${mobileView === "chat" ? "hidden" : "flex"} md:flex flex-col w-full md:w-[350px] border-r border-gray-100 dark:border-gray-800`}>
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black">Messages</h2>
            <button className="p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-full transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl py-3 pl-12 pr-4 outline-none text-sm font-medium"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-400 animate-pulse">Chargement...</div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center text-gray-400">Aucune conversation</div>
          ) : (
            conversations.map((conv) => (
              <button 
                key={conv.user_id}
                onClick={() => {
                  setActiveConv(conv);
                  setMobileView("chat");
                }}
                className={`w-full flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-all relative ${activeConv?.user_id === conv.user_id ? 'bg-[#00b4d8]/5 border-r-4 border-[#00b4d8]' : ''}`}
              >
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center shrink-0">
                  <User size={24} className="text-gray-400" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-bold truncate">{conv.nom}</p>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{formatHeure(conv.heure)}</span>
                  </div>
                  <p className={`text-xs truncate ${conv.non_lu ? 'font-black text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                    {conv.dernier_msg}
                  </p>
                </div>
                {conv.non_lu && (
                  <div className="w-2 h-2 rounded-full bg-[#00b4d8] absolute right-4 bottom-6"></div>
                )}
              </button>
            ))
          )}
        </div>
      </div>

      {/* CHAT AREA */}
      <div className={`${mobileView === "list" ? "hidden" : "flex"} md:flex flex-col flex-1 bg-gray-50/30 dark:bg-[#050505]`}>
        {activeConv ? (
          <>
            {/* CHAT HEADER */}
            <div className="p-4 md:p-6 bg-white dark:bg-[#0a0a0a] border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setMobileView("list")}
                  className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="w-10 h-10 rounded-full bg-[#00b4d8]/10 text-[#00b4d8] flex items-center justify-center">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="font-black leading-tight">{activeConv.nom}</h3>
                  <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">En ligne</p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full">
                <MoreVertical size={20} />
              </button>
            </div>

            {/* MESSAGES LIST */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
            >
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex ${msg.expediteur_id === currentUserId ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] md:max-w-[70%] relative group`}>
                      <div className={`px-5 py-3 rounded-2xl shadow-sm ${
                        msg.expediteur_id === currentUserId 
                          ? 'bg-[#00b4d8] text-white rounded-tr-none' 
                          : 'bg-white dark:bg-white/5 text-gray-800 dark:text-gray-100 rounded-tl-none'
                      }`}>
                        <p className="text-sm font-medium leading-relaxed">{msg.contenu}</p>
                        <div className={`flex items-center justify-end gap-1 mt-1 ${msg.expediteur_id === currentUserId ? 'text-white/70' : 'text-gray-400'}`}>
                          <span className="text-[9px] font-bold uppercase">{formatHeure(msg.cree_le)}</span>
                          {msg.expediteur_id === currentUserId && (
                            <CheckCheck size={12} className={msg.lu ? 'text-green-300' : ''} />
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* MESSAGE INPUT */}
            <form 
              onSubmit={handleSendMessage}
              className="p-6 bg-white dark:bg-[#0a0a0a] border-t border-gray-100 dark:border-gray-800 flex items-center gap-4"
            >
              <input 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Écrivez votre message..." 
                className="flex-1 bg-gray-50 dark:bg-white/5 border-none rounded-2xl py-4 px-6 outline-none font-medium text-sm transition-all focus:ring-2 focus:ring-[#00b4d8]/20"
              />
              <button 
                type="submit"
                disabled={!newMessage.trim()}
                className="w-14 h-14 bg-[#00b4d8] hover:bg-[#0096b4] text-white rounded-2xl shadow-xl shadow-[#00b4d8]/20 flex items-center justify-center transition-all active:scale-95 disabled:opacity-50"
              >
                <Send size={24} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-30">
            <div className="w-32 h-32 rounded-full bg-[#00b4d8]/10 flex items-center justify-center mb-8">
              <Send size={64} className="text-[#00b4d8]" />
            </div>
            <h3 className="text-2xl font-black mb-2">Sélectionnez une conversation</h3>
            <p className="max-w-xs font-medium">Commencez à discuter avec les acheteurs et vendeurs pour conclure vos affaires.</p>
          </div>
        )}
      </div>
    </div>
  );
}

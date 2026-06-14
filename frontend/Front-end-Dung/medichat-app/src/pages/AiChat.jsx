import React, { useState, useRef, useEffect } from 'react';

const initialMessages = [
  {
    id: 1,
    role: 'ai',
    text: "Hello! I'm your AI Medical Assistant. How can I help you today? You can ask me about symptoms, medications, or check drug interactions.",
    suggestions: ['Check an interaction', 'Common side effects of Lisinopril', 'What is Hypertension?'],
  },
  {
    id: 2,
    role: 'user',
    text: 'What are the common side effects of Amoxicillin, and should I take it with food?',
  },
  {
    id: 3,
    role: 'ai',
    text: null,
    structured: {
      intro: 'Amoxicillin is a common penicillin antibiotic. Here is the information:',
      sideEffects: ['Nausea or vomiting', 'Diarrhea', 'Mild skin rash', 'Upset stomach'],
      food: 'Yes, it is generally recommended to take Amoxicillin with food or a meal. Taking it with food can help prevent stomach upset and nausea.',
      warning: 'If you develop a severe skin rash, difficulty breathing, or swelling of the face, seek emergency medical attention immediately.',
    },
    sources: ['FDA Label', 'Mayo Clinic'],
  },
];

const chatHistory = [
  { period: 'Today', chats: ['Side effects of Amoxicillin', 'Headache and nausea causes'] },
  { period: 'Previous 7 Days', chats: ['Diet for high blood pressure', 'Vitamin D deficiency symptoms', 'Interaction: Ibuprofen & Aspirin'] },
];

const AiChat = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg = { id: Date.now(), role: 'user', text: input };
    const aiReply = {
      id: Date.now() + 1,
      role: 'ai',
      text: "Thank you for your question. This is a demo — in the real app, I'd connect to the AI backend and provide a detailed answer.",
      sources: [],
    };
    setMessages((prev) => [...prev, newMsg, aiReply]);
    setInput('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-row h-[calc(100vh-4rem)]">
      {/* Main chat area */}
      <div className="flex-1 flex flex-col relative bg-background min-w-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex flex-col gap-6 pb-36">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 max-w-3xl mx-auto w-full ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.role === 'ai' ? (
                <div className="w-8 h-8 rounded-full bg-primary flex-shrink-0 flex items-center justify-center text-primary-foreground">
                  <iconify-icon icon="lucide:bot" class="text-lg"></iconify-icon>
                </div>
              ) : (
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" className="w-8 h-8 rounded-full object-cover border border-border flex-shrink-0" />
              )}

              <div className={`flex-1 ${msg.role === 'user' ? 'flex flex-col items-end' : 'space-y-2'}`}>
                <p className="text-sm font-medium text-foreground mb-1">{msg.role === 'ai' ? 'MediAI Assistant' : 'You'}</p>

                {msg.role === 'user' ? (
                  <div className="bg-primary text-primary-foreground px-5 py-3 rounded-2xl rounded-tr-sm text-base leading-relaxed max-w-[85%]">
                    {msg.text}
                  </div>
                ) : msg.structured ? (
                  <div className="text-base text-foreground leading-relaxed space-y-4">
                    <p>{msg.structured.intro}</p>
                    <p className="font-semibold">Common Side Effects:</p>
                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                      {msg.structured.sideEffects.map((s) => <li key={s}>{s}</li>)}
                    </ul>
                    <p className="font-semibold">Taking with Food:</p>
                    <p>{msg.structured.food}</p>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
                      <iconify-icon icon="lucide:info" class="text-amber-600 text-xl flex-shrink-0 mt-0.5"></iconify-icon>
                      <p className="text-sm text-amber-800"><strong>Important:</strong> {msg.structured.warning}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-base text-foreground leading-relaxed">{msg.text}</div>
                )}

                {msg.suggestions && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {msg.suggestions.map((s) => (
                      <button key={s} onClick={() => setInput(s)} className="px-3 py-1.5 bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 rounded-full text-xs font-medium border border-border transition-colors">
                        {s}
                      </button>
                    ))}
                  </div>
                )}

                {msg.sources && msg.sources.length > 0 && (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                    <span className="text-xs font-medium text-muted-foreground">Sources:</span>
                    {msg.sources.map((src) => (
                      <span key={src} className="px-2 py-1 bg-secondary rounded text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                        <iconify-icon icon="lucide:link"></iconify-icon> {src}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background to-transparent pt-6 pb-6 px-4 md:px-8">
          <div className="max-w-3xl mx-auto w-full relative">
            <div className="bg-card border border-border rounded-3xl p-2 shadow-lg flex items-end gap-2 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
              <button className="p-2.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary transition-colors flex-shrink-0">
                <iconify-icon icon="lucide:paperclip" class="text-xl"></iconify-icon>
              </button>
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask about symptoms, medicines, or interactions..."
                className="w-full max-h-32 bg-transparent border-none focus:ring-0 resize-none py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none"
                style={{ minHeight: '44px' }}
              />
              <button className="p-2.5 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary transition-colors flex-shrink-0 hidden sm:block">
                <iconify-icon icon="lucide:mic" class="text-xl"></iconify-icon>
              </button>
              <button
                onClick={sendMessage}
                className="p-2.5 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors flex-shrink-0 shadow-sm"
              >
                <iconify-icon icon="lucide:send" class="text-xl"></iconify-icon>
              </button>
            </div>
            <div className="text-center mt-3">
              <p className="text-[10px] text-muted-foreground">MediAI can make mistakes. Always verify critical medical information with a healthcare professional.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiChat;

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Download, 
  Printer, 
  BookOpen, 
  User, 
  Palette, 
  Loader2, 
  ChevronRight, 
  ChevronLeft,
  MessageSquare,
  Send,
  RefreshCw,
  AlertCircle,
  Key
} from 'lucide-react';
import { generateColoringPage, startChat } from './lib/gemini';
import { jsPDF } from 'jspdf';

// Extend window for AI Studio API key selection
declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

type Step = 'setup' | 'generating' | 'preview' | 'chat';
type ImageSize = '1K' | '2K' | '4K';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export default function App() {
  const [step, setStep] = useState<Step>('setup');
  const [theme, setTheme] = useState('');
  const [childName, setChildName] = useState('');
  const [imageSize, setImageSize] = useState<ImageSize>('1K');
  const [pages, setPages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasApiKey, setHasApiKey] = useState(false);
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkApiKey();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const checkApiKey = async () => {
    if (window.aistudio) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      setHasApiKey(hasKey);
    }
  };

  const handleOpenKeySelector = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasApiKey(true);
    }
  };

  const handleGenerate = async () => {
    if (!theme || !childName) return;
    
    setIsGenerating(true);
    setStep('generating');
    setError(null);
    setPages([]);

    try {
      const generatedPages: string[] = [];
      for (let i = 0; i < 5; i++) {
        const imageUrl = await generateColoringPage(theme, i, imageSize);
        generatedPages.push(imageUrl);
        setPages([...generatedPages]); // Update progress
      }
      setStep('preview');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate coloring book. Please try again.');
      setStep('setup');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Cover Page
    doc.setFillColor(245, 245, 240); // Warm off-white
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    doc.setTextColor(90, 90, 64); // Olive
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(40);
    doc.text('My Special', pageWidth / 2, 60, { align: 'center' });
    doc.text('Coloring Book', pageWidth / 2, 80, { align: 'center' });
    
    doc.setFontSize(24);
    doc.text(`Created for ${childName}`, pageWidth / 2, 120, { align: 'center' });
    
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(16);
    doc.text(`Theme: ${theme}`, pageWidth / 2, 140, { align: 'center' });

    // Add pages
    pages.forEach((pageData, index) => {
      doc.addPage();
      // Add a border
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
      
      // Add the image
      // We need to strip the data:image/png;base64, part
      const base64Data = pageData.split(',')[1];
      doc.addImage(base64Data, 'PNG', 15, 15, pageWidth - 30, pageWidth - 30);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Page ${index + 1}`, pageWidth / 2, pageHeight - 15, { align: 'center' });
    });

    doc.save(`${childName}_Coloring_Book.pdf`);
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isChatLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: userInput };
    setChatMessages(prev => [...prev, userMsg]);
    setUserInput('');
    setIsChatLoading(true);

    try {
      if (!chatRef.current) {
        chatRef.current = await startChat(
          `You are a friendly, creative assistant for a children's coloring book generator. 
          The current theme is "${theme}" and the child's name is "${childName}". 
          Help the user come up with new ideas for coloring pages or stories related to their theme.`
        );
      }

      const result = await chatRef.current.sendMessage({ message: userInput });
      const modelMsg: ChatMessage = { role: 'model', text: result.text || "I'm not sure what to say." };
      setChatMessages(prev => [...prev, modelMsg]);
    } catch (err) {
      console.error(err);
      setChatMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] text-[#5A5A40] font-serif selection:bg-[#5A5A40] selection:text-white">
      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b border-[#5A5A40]/10 bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#5A5A40] rounded-full flex items-center justify-center text-white">
            <Palette size={24} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Coloring Book AI</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {!hasApiKey && (
            <button 
              onClick={handleOpenKeySelector}
              className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium hover:bg-amber-200 transition-colors"
            >
              <Key size={16} />
              Set API Key
            </button>
          )}
          <button 
            onClick={() => setStep('chat')}
            className="p-2 hover:bg-[#5A5A40]/10 rounded-full transition-colors"
            title="Chat with AI Assistant"
          >
            <MessageSquare size={24} />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <AnimatePresence mode="wait">
          {step === 'setup' && (
            <motion.div 
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 py-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-5xl font-bold leading-tight">Create a magical coloring book for your little one.</h2>
                <p className="text-xl opacity-80 max-w-2xl mx-auto">
                  Enter a theme and a name, and our AI will generate a personalized 5-page coloring book ready to print.
                </p>
              </div>

              <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-[#5A5A40]/5 space-y-6 border border-[#5A5A40]/5">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-widest opacity-60 flex items-center gap-2">
                      <User size={14} /> Child's Name
                    </label>
                    <input 
                      type="text" 
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      placeholder="e.g. Oliver"
                      className="w-full p-4 bg-[#f5f5f0] rounded-2xl border-none focus:ring-2 focus:ring-[#5A5A40] transition-all text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold uppercase tracking-widest opacity-60 flex items-center gap-2">
                      <Sparkles size={14} /> Book Theme
                    </label>
                    <input 
                      type="text" 
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      placeholder="e.g. Space Dinosaurs"
                      className="w-full p-4 bg-[#f5f5f0] rounded-2xl border-none focus:ring-2 focus:ring-[#5A5A40] transition-all text-lg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-widest opacity-60">Image Quality</label>
                  <div className="flex gap-4">
                    {(['1K', '2K', '4K'] as ImageSize[]).map((size) => (
                      <button
                        key={size}
                        onClick={() => setImageSize(size)}
                        className={`flex-1 py-3 rounded-2xl font-bold transition-all ${
                          imageSize === size 
                            ? 'bg-[#5A5A40] text-white shadow-lg' 
                            : 'bg-[#f5f5f0] hover:bg-[#eaea e0]'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleGenerate}
                  disabled={!theme || !childName || !hasApiKey}
                  className="w-full py-6 bg-[#5A5A40] text-white rounded-[24px] text-xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-xl shadow-[#5A5A40]/20"
                >
                  {isGenerating ? <Loader2 className="animate-spin" /> : <BookOpen />}
                  Generate My Book
                </button>
                
                {!hasApiKey && (
                  <p className="text-center text-sm text-amber-700 flex items-center justify-center gap-2">
                    <AlertCircle size={14} /> Please set your Gemini API key to start generating.
                  </p>
                )}
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 flex items-center gap-3">
                  <AlertCircle />
                  <p>{error}</p>
                </div>
              )}
            </motion.div>
          )}

          {step === 'generating' && (
            <motion.div 
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-24 text-center space-y-12"
            >
              <div className="relative inline-block">
                <div className="w-32 h-32 border-4 border-[#5A5A40]/20 border-t-[#5A5A40] rounded-full animate-spin mx-auto"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Palette size={40} className="text-[#5A5A40]" />
                </div>
              </div>
              
              <div className="space-y-4">
                <h2 className="text-4xl font-bold">Creating {childName}'s Adventure...</h2>
                <p className="text-xl opacity-60">Generating 5 unique coloring pages about {theme}.</p>
              </div>

              <div className="flex justify-center gap-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div 
                    key={i}
                    className={`w-4 h-4 rounded-full transition-all duration-500 ${
                      pages.length >= i ? 'bg-[#5A5A40] scale-125' : 'bg-[#5A5A40]/20'
                    }`}
                  />
                ))}
              </div>

              <div className="grid grid-cols-5 gap-4 max-w-2xl mx-auto">
                {pages.map((page, i) => (
                  <motion.div 
                    key={i}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="aspect-square bg-white rounded-xl overflow-hidden border border-[#5A5A40]/10 shadow-lg"
                  >
                    <img src={page} alt={`Page ${i+1}`} className="w-full h-full object-cover grayscale" />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'preview' && (
            <motion.div 
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8 py-12"
            >
              <div className="flex justify-between items-end">
                <div className="space-y-2">
                  <h2 className="text-4xl font-bold">Your Book is Ready!</h2>
                  <p className="text-xl opacity-60">5 pages of {theme} for {childName}.</p>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setStep('setup')}
                    className="px-6 py-3 rounded-2xl font-bold border border-[#5A5A40]/20 hover:bg-[#5A5A40]/5 transition-all"
                  >
                    Start Over
                  </button>
                  <button 
                    onClick={downloadPDF}
                    className="px-8 py-3 bg-[#5A5A40] text-white rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-[#5A5A40]/20"
                  >
                    <Download size={20} /> Download PDF
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Cover Preview */}
                <div className="aspect-[3/4] bg-white rounded-[32px] shadow-xl border border-[#5A5A40]/5 p-8 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-20 h-20 bg-[#f5f5f0] rounded-full flex items-center justify-center">
                    <BookOpen size={40} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold leading-tight">My Special Coloring Book</h3>
                    <p className="text-lg opacity-60">for {childName}</p>
                  </div>
                  <div className="pt-4 border-t border-[#5A5A40]/10 w-full">
                    <p className="text-sm font-bold uppercase tracking-widest opacity-40">Cover Page</p>
                  </div>
                </div>

                {pages.map((page, i) => (
                  <div key={i} className="aspect-[3/4] bg-white rounded-[32px] shadow-xl border border-[#5A5A40]/5 overflow-hidden group relative">
                    <img src={page} alt={`Page ${i+1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={() => window.open(page, '_blank')}
                        className="p-4 bg-white rounded-full text-[#5A5A40] hover:scale-110 transition-transform"
                      >
                        <Printer size={24} />
                      </button>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-2xl text-center">
                      <p className="text-sm font-bold">Page {i + 1}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {step === 'chat' && (
            <motion.div 
              key="chat"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="h-[70vh] flex flex-col bg-white rounded-[32px] shadow-2xl border border-[#5A5A40]/5 overflow-hidden"
            >
              <div className="p-6 border-b border-[#5A5A40]/10 flex justify-between items-center bg-[#f5f5f0]/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#5A5A40] rounded-full flex items-center justify-center text-white">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold">Creative Assistant</h3>
                    <p className="text-xs opacity-60">Ask for new coloring ideas!</p>
                  </div>
                </div>
                <button 
                  onClick={() => setStep(pages.length > 0 ? 'preview' : 'setup')}
                  className="p-2 hover:bg-[#5A5A40]/10 rounded-full transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatMessages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-40 space-y-4">
                    <Sparkles size={48} />
                    <p className="max-w-xs">I'm here to help you dream up more adventures for {childName}!</p>
                  </div>
                )}
                {chatMessages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] p-4 rounded-2xl ${
                      msg.role === 'user' 
                        ? 'bg-[#5A5A40] text-white rounded-tr-none' 
                        : 'bg-[#f5f5f0] text-[#5A5A40] rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-[#f5f5f0] p-4 rounded-2xl rounded-tl-none flex gap-2">
                      <div className="w-2 h-2 bg-[#5A5A40]/40 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[#5A5A40]/40 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 bg-[#5A5A40]/40 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="p-6 border-t border-[#5A5A40]/10 bg-[#f5f5f0]/30">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                  className="flex gap-3"
                >
                  <input 
                    type="text" 
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type your idea..."
                    className="flex-1 p-4 bg-white rounded-2xl border-none focus:ring-2 focus:ring-[#5A5A40] shadow-sm"
                  />
                  <button 
                    type="submit"
                    disabled={!userInput.trim() || isChatLoading}
                    className="p-4 bg-[#5A5A40] text-white rounded-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                  >
                    <Send size={20} />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="p-12 text-center opacity-40 text-sm space-y-2">
        <p>© 2026 Coloring Book AI Generator</p>
        <p>Powered by Gemini 3 Pro Image & Flash</p>
      </footer>
    </div>
  );
}

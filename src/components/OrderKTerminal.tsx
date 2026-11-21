import React, { useState, useRef, useEffect } from 'react';
import {
  Terminal as TerminalIcon,
  Send,
  Sparkles,
  X,
  Maximize2,
  Minimize2,
  Bot,
  User,
  Loader2,
  KeyRound,
  ShieldAlert,
  CheckCircle2,
  Cpu
} from 'lucide-react';
import { playChime } from '../utils/sound';
import { MENU_ITEMS, INITIAL_TABLES } from '../data/mockData';

interface OrderKTerminalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// ─────────────────────────────────────────────────────────────
// Real OpenAI & Live AI Endpoint Configuration
// ─────────────────────────────────────────────────────────────
const OPENAI_API_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const LIVE_AI_GATEWAY = "https://text.pollinations.ai/";

function buildSystemPrompt(isCustomer: boolean): string {
  const menuSummary = MENU_ITEMS.map(
    (m) => `${m.name} (${m.category}) - $${m.price.toFixed(2)}: ${m.description}`
  ).join('\n');

  if (isCustomer) {
    return `You are "OrderK AI Waiter & Culinary Concierge", the smart AI assistant for dining customers at Downtown Bistro.
Tone: Warm, hospitable, polite, enthusiastic about gourmet food. Respond in the same language the customer uses (Arabic or English).

RESTAURANT MENU:
${menuSummary}

STRICT CUSTOMER SECURITY RULES:
1. You are talking to a CUSTOMER / GUEST.
2. YOU ARE STRICTLY FORBIDDEN from disclosing internal restaurant financials, sales figures, today's gross revenue ($8,429.50), profit margins, staff wages, supplier costs, or kitchen SLA delays.
3. If the customer asks about profits, revenue, or business numbers (e.g. "كام الأرباح الليلة؟" or "how much did the restaurant make?"), politely respond:
"عفواً يا فندم، هذه معلومات داخلية خاصة بإدارة وموظفي المطعم فقط 🔒. يسعدني جداً مساعدتك في ترشيح أشهى الأطباق والمشروبات من قائمتنا وتفاصيل مكوناتها! 🍽️✨"
4. Help them choose dishes, recommend pairings, explain ingredients, and handle dietary restrictions (vegetarian, seafood, gluten). Keep answers concise and friendly.`;
  }

  // Staff & Owner System Prompt
  const tablesSummary = INITIAL_TABLES.map(t => `${t.id}: ${t.status}`).join(', ');

  return `You are "OrderK AI Management Co-Pilot", the operational AI intelligence for Downtown Bistro running OrderK POS v2.4.
Audience: Restaurant Owner, General Manager, Shift Supervisors, and Staff.

RESTAURANT MENU:
${menuSummary}

TONIGHT'S OPERATIONAL DATA:
- Gross Revenue: $8,429.50 (80.2% of $10,500 target)
- Total Tickets: 142 orders
- Floor Occupancy: 84% (14/16 tables occupied)
- Kitchen Velocity: 11.4 min avg (SLA target < 14 min)
- Table Status: ${tablesSummary}
- Low Stock 86 Alert: Chilean Sea Bass (1 portion left)
- Top Sellers Tonight: Prime Ribeye 12oz ($1,976), Truffle Tagliolini ($1,196), Smoked Old Fashioned ($1,024)

POS COMMANDS:
- Split Bill: top of cart
- Discount: "% Discount" below cart
- Print Bill: purple button
- Kitchen Note: "Kitchen Note" button
- Send to Kitchen / FIRE NOW: red button at bottom
- Bump Ticket: Spacebar on KDS

Provide direct, executive, actionable answers in Arabic or English matching the user.`;
}

export const OrderKTerminal: React.FC<OrderKTerminalProps> = ({ 
  isOpen, 
  onClose,
  userRole = localStorage.getItem('orderk_user_role') || 'General Manager'
}) => {
  const isCustomer = userRole === 'Customer' || userRole === 'زبون';

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: isCustomer
        ? `أهلاً بك يا فندم في مطعم **Downtown Bistro**! 🍽️✨\n\nأنا مساعدك الذكي لاختيار أشهى الأطباق والمشروبات. اسألني عن أفضل وجبة ستيك، الأطباق النباتية، أو مكونات أي طبق وسأرشدك فوراً!`
        : `مرحباً بك! أنا **OrderK AI Co-Pilot** 🤖 المتصل بنظام الإدارة.\n\nيمكنك سؤالي عن مبيعات الوردية ($8,429)، حالة الطاولات، سرعة المطبخ (KDS)، أو خطوات تنفيذ أي عملية في الـ POS.`,
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('orderk_openai_key') || '');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey);
  const [aiSource, setAiSource] = useState<'openai' | 'live-gateway'>('live-gateway');

  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 150);
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle Save OpenAI Key
  const handleSaveKey = () => {
    localStorage.setItem('orderk_openai_key', tempKey.trim());
    setApiKey(tempKey.trim());
    setShowKeyModal(false);
    playChime('success');
  };

  // Real AI Fetch function connecting to OpenAI API or Live Generative Gateway
  const queryRealAI = async (history: Message[], promptText: string): Promise<string> => {
    const systemPrompt = buildSystemPrompt(isCustomer);

    // Block customer revenue questions early as a safeguard
    if (isCustomer && /(أرباح|ارباح|مبيعات|إيراد|دخل|فلوس|revenue|profit|sales|salary|مرتبات)/i.test(promptText)) {
      return `عفواً يا فندم، هذه بيانات مالية خاصة بإدارة وموظفي المطعم فقط 🔒.\n\nيسعدني جداً مساعدتك في ترشيح أشهى وجباتنا، المكونات، أو أسعار الأطباق من المنيو! 🍽️✨`;
    }

    // 1. If user provided their own OpenAI API Key: Call OpenAI API directly!
    if (apiKey.trim().startsWith('sk-')) {
      try {
        setAiSource('openai');
        const response = await fetch(OPENAI_API_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey.trim()}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemPrompt },
              ...history.slice(-6).map(m => ({ role: m.role, content: m.content })),
              { role: 'user', content: promptText }
            ],
            temperature: 0.7,
            max_tokens: 300
          })
        });

        if (response.ok) {
          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) return reply;
        }
      } catch (err) {
        console.warn('OpenAI Direct failed, switching to live gateway', err);
      }
    }

    // 2. Call the live real AI gateway (Pollinations AI - powered by real GPT models, free & keyless)
    try {
      setAiSource('live-gateway');
      const chatMessages = [
        { role: 'system', content: systemPrompt },
        ...history.slice(-4).map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: promptText }
      ];

      const res = await fetch(LIVE_AI_GATEWAY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatMessages,
          model: 'openai',
          seed: Math.floor(Math.random() * 1000)
        })
      });

      if (res.ok) {
        const text = await res.text();
        if (text && text.trim().length > 0) {
          return text.trim();
        }
      }
    } catch (e) {
      console.warn('Live AI gateway error, using local fallback:', e);
    }

    // 3. Fallback smart direct response if offline
    if (isCustomer) {
      if (/(ستيك|لحم|steak)/i.test(promptText)) {
        return `أنصحك جداً بتجربة **Prime Ribeye 12oz** ($52.00) المطهو على خشب البلوط مع زبدة الأعشاب والثوم، أو **Filet Mignon 8oz** ($58.00) لطراوة استثنائية! 🥩`;
      }
      if (/(باستا|مكرونة|pasta)/i.test(promptText)) {
        return `طبقنا الأكثر طلباً هو **Truffle Tagliolini** ($26.00) بالكمأة الإيطالية السوداء وجبن البارميزان المعتق 24 شهراً! 🍝`;
      }
      if (/(حلو|حلويات|dessert)/i.test(promptText)) {
        return `لا تفوّت تجربة **Tiramisù Tradizionale** ($14.00) بالماسكاربوني الإيطالي أو **Valrhona Chocolate Fondant** ($15.00) بكيك الشوكولاتة الذائبة! 🍰`;
      }
      return `مرحباً بك! يمكنك اختيار أي طبق من القائمة وسيتولى طهاتنا تحضيره بأعلى معايير الجودة. هل ترغب في ترشيح معين؟ 🍽️`;
    }

    // Staff fallback
    return `بصفتك من فريق إدارة المطعم: إجمالي مبيعات اليوم **$8,429.50** (142 طلباً بنسبة إنجاز 80.2%). هل تحتاج مساعدة في تنفيذ إجراء معين بالـ POS؟`;
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = input.trim();
    if (!text || isTyping) return;

    playChime('bell');
    const userMsg: Message = { role: 'user', content: text, timestamp: new Date() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setIsTyping(true);

    const reply = await queryRealAI(updated, text);
    setMessages(prev => [...prev, { role: 'assistant', content: reply, timestamp: new Date() }]);
    setIsTyping(false);
    playChime('bump');
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleSuggestion = (text: string) => {
    setInput(text);
    setTimeout(() => {
      const textTrimmed = text.trim();
      if (!textTrimmed || isTyping) return;
      playChime('bell');
      const userMsg: Message = { role: 'user', content: textTrimmed, timestamp: new Date() };
      const updated = [...messages, userMsg];
      setMessages(updated);
      setInput('');
      setIsTyping(true);
      queryRealAI(updated, textTrimmed).then(reply => {
        setMessages(prev => [...prev, { role: 'assistant', content: reply, timestamp: new Date() }]);
        setIsTyping(false);
        playChime('bump');
      });
    }, 50);
  };

  const renderContent = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, i) => {
      const parts = line.split(/\*\*(.+?)\*\*/g);
      return (
        <span key={i}>
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j} className="text-white font-semibold">{part}</strong> : part
          )}
          {i < lines.length - 1 && <br />}
        </span>
      );
    });
  };

  if (!isOpen) return null;

  const customerSuggestions = [
    'إيه أفضل طبق ستيك عندكم؟',
    'عندكم أطباق نباتية؟',
    'إيه الحلويات المميزة الليلة؟',
    'كم سعر Truffle Tagliolini؟'
  ];

  const staffSuggestions = [
    'أرباح ومبيعات المطعم الليلة كام؟',
    'طريقة عمل خصم (% Discount)؟',
    'حالة الطاولات المشغولة الآن؟',
    'إيه الأصناف اللي قاربت على النفاد (86)؟'
  ];

  return (
    <div
      className={`fixed z-50 transition-all duration-300 shadow-2xl ${
        isExpanded
          ? 'inset-2 sm:inset-4 md:inset-8'
          : 'bottom-2 sm:bottom-6 right-2 sm:right-6 left-2 sm:left-auto w-auto sm:w-[520px] md:w-[600px] h-[78vh] sm:h-[620px]'
      }`}
    >
      <div className="w-full h-full rounded-2xl bg-[#0a0d24] border border-[#ff7b72]/30 flex flex-col overflow-hidden shadow-[0_0_40px_rgba(255,126,112,0.15)] ring-1 ring-white/10">

        {/* ── Title Bar ── */}
        <div className="px-4 py-3 bg-[#0e1335] border-b border-white/[0.07] flex items-center justify-between select-none flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <div className="h-4 w-[1px] bg-white/10 mx-1" />
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-200">
              <TerminalIcon className="w-4 h-4 text-[#ff9e93]" />
              <span>{isCustomer ? 'OrderK Customer AI' : 'OrderK AI Terminal'}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-sans border border-emerald-500/30 flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                <span>OpenAI Live AI</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            {/* OpenAI Key Configuration Button */}
            <button
              onClick={() => setShowKeyModal(true)}
              className="p-1 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] flex items-center gap-1 border border-white/[0.06] transition"
              title="ربط مفتاح OpenAI الخاص بك"
            >
              <KeyRound className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline">{apiKey ? 'OpenAI متصل' : 'OpenAI Key'}</span>
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded hover:bg-white/10 hover:text-white transition"
              title={isExpanded ? 'Restore' : 'Maximize'}
            >
              {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-rose-500/20 hover:text-rose-400 transition"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Chat Messages ── */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#080b1f]">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  msg.role === 'assistant'
                    ? 'bg-gradient-to-br from-[#ff9e93] to-[#ff7b72]'
                    : 'bg-[#1e2558]'
                }`}
              >
                {msg.role === 'assistant' ? (
                  <Bot className="w-4 h-4 text-[#1b0808]" />
                ) : (
                  <User className="w-4 h-4 text-slate-300" />
                )}
              </div>

              <div
                className={`max-w-[84%] rounded-2xl px-3.5 py-2.5 text-xs font-sans leading-relaxed ${
                  msg.role === 'assistant'
                    ? 'bg-[#0f1435] border border-white/[0.06] text-slate-200 rounded-tl-sm shadow-sm'
                    : 'bg-[#ff9e93]/15 border border-[#ff9e93]/20 text-slate-100 rounded-tr-sm'
                }`}
              >
                <div>{renderContent(msg.content)}</div>
                <div className={`text-[9px] mt-1.5 ${msg.role === 'assistant' ? 'text-slate-600' : 'text-slate-500'}`}>
                  {msg.timestamp.toLocaleTimeString('ar', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#ff9e93] to-[#ff7b72] flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-[#1b0808]" />
              </div>
              <div className="bg-[#0f1435] border border-white/[0.06] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2 text-xs text-slate-400">
                <Loader2 className="w-3.5 h-3.5 text-coral-400 animate-spin" />
                <span>جاري التفكير وتوليد الإجابة بالذكاء الاصطناعي...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Quick Suggestions (Based on Role) ── */}
        {messages.length === 1 && !isTyping && (
          <div className="px-4 pb-2 bg-[#080b1f]">
            <p className="text-[10px] text-slate-500 mb-1.5 font-sans">
              {isCustomer ? 'اقتراحات أسئلة للزبائن:' : 'اقتراحات أسئلة للإدارة والمطبخ:'}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {(isCustomer ? customerSuggestions : staffSuggestions).map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestion(s)}
                  className="px-2.5 py-1 rounded-lg bg-[#12173d] hover:bg-[#192154] border border-white/[0.06] text-slate-300 text-[11px] transition font-sans"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Input Bar ── */}
        <div className="px-3 py-3 bg-[#0e1335] border-t border-white/[0.07] flex-shrink-0">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 mr-1 text-[10px] text-emerald-400 font-mono flex-shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-coral-400" />
              <span className="hidden sm:inline">AI</span>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isCustomer ? "اسأل عن أي طبق، لحوم، باستا، أو حلويات..." : "اسأل عن المبيعات، الطاولات، KDS، أو الخصومات..."}
              disabled={isTyping}
              className="flex-1 py-2 px-3 rounded-xl bg-[#12173b] text-white text-xs font-sans border border-white/[0.08] focus:border-[#ff9e93]/60 focus:ring-1 focus:ring-[#ff9e93]/30 outline-none transition placeholder-slate-500 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff9e93] to-[#ff7b72] flex items-center justify-center disabled:opacity-40 hover:brightness-110 active:scale-95 transition shadow-md shadow-[#ff7b72]/20 flex-shrink-0"
              title="إرسال"
            >
              {isTyping ? (
                <Loader2 className="w-4 h-4 text-[#1b0808] animate-spin" />
              ) : (
                <Send className="w-4 h-4 text-[#1b0808]" />
              )}
            </button>
          </form>
        </div>
      </div>

      {/* ── OpenAI Key Modal ── */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#0c102a] border border-white/10 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">إعداد مفتاح OpenAI API</h3>
              </div>
              <button
                onClick={() => setShowKeyModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              يمكنك ربط مفتاحك من <strong>OpenAI</strong> (يبدأ بـ <code>sk-...</code>) للتواصل المباشر مع موديلات GPT-4o الرسمية، أو تركه فارغاً للاعتماد على بوابة الذكاء الاصطناعي المباشرة المجانية المدمجة!
            </p>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">OpenAI API Key (اختياري)</label>
              <input
                type="password"
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                placeholder="sk-proj-xxxxxxxxxxxxxxxxxxxx"
                className="w-full bg-[#111738] text-white font-mono text-xs rounded-xl px-3 py-2.5 border border-white/10 focus:outline-none focus:border-coral-400"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowKeyModal(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleSaveKey}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-coral-500 to-[#ff7b72] text-[#190808] text-xs font-bold shadow-md shadow-coral-500/20"
              >
                حفظ التعديل
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

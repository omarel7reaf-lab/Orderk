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
} from 'lucide-react';
import { playChime } from '../utils/sound';
import { MENU_ITEMS, INITIAL_TABLES, INITIAL_ORDERS } from '../data/mockData';

interface OrderKTerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// ─────────────────────────────────────────────────────────────
// OrderK AI "Brain" — ChatGPT-style conversational engine
// ─────────────────────────────────────────────────────────────
function buildSystemContext(): string {
  const menuSummary = MENU_ITEMS.map(
    (m) => `${m.name} (${m.category}) — $${m.price.toFixed(2)}${m.description ? ' | ' + m.description : ''}`
  ).join('\n');

  const tablesSummary = INITIAL_TABLES
    .map((t) => `${t.id}: ${t.status} (${t.capacity} seats)`)
    .join(', ');

  return `You are OrderK AI, a smart conversational assistant for a fine-dining restaurant called Downtown Bistro running the OrderK POS v2.4 system.

MENU (${MENU_ITEMS.length} items):
${menuSummary}

TABLE STATUS: ${tablesSummary}

SHIFT DATA (tonight):
- Gross Revenue: $8,429.50 (80.2% of $10,500 target)
- Total Tickets: 142 orders
- Floor Occupancy: 84% (14/16 tables)
- Kitchen Velocity: 11.4 min avg
- Top Dish: Prime Ribeye 12oz ($1,976 revenue, 38 sold tonight)
- 86 Alert: Chilean Sea Bass — 1 portion remaining

POS FEATURES:
- Split Bill: button above cart in POS view
- Discount: "% Discount" button below cart
- Print Bill: purple "Print Bill" button below cart
- Kitchen Note: "Kitchen Note" button for chef instructions
- Send to Kitchen / FIRE NOW: red button at bottom of cart
- Transfer Table: in Floor & Tables or Live Orders
- KDS: Kitchen Display System shows active tickets to chefs
- Bump Ticket: press Space or Bump to clear a finished ticket from KDS

PERSONALITY:
- You respond like ChatGPT: conversational, natural, smart, warm
- Keep responses concise but helpful — no bullet-dump unless it's a list
- Remember context from earlier in this conversation
- If asked anything off-topic (not restaurant/POS related), politely redirect
- Use emojis sparingly and naturally
- Respond in the same language the user writes in (Arabic or English)`;
}

const SYSTEM_CONTEXT = buildSystemContext();

// Simulate a ChatGPT-style response based on conversation history
function simulateChatGPT(history: Message[], userMessage: string): string {
  const q = userMessage.toLowerCase().trim();
  const prevMessages = history.slice(-6); // last 6 messages for context

  // Check what was discussed recently
  const recentTopics = prevMessages.map(m => m.content.toLowerCase()).join(' ');
  const isFollowUp = recentTopics.length > 0;

  // ─── Greetings ───
  if (/^(أهلا|أهلاً|مرحبا|مرحباً|سلام|صباح|مساء|هاي|هالو|hello|hi\b|hey\b|howdy)/i.test(q)) {
    const greets = [
      `أهلاً! 👋 أنا OrderK AI، مساعدك في مطعم Downtown Bistro. تقدر تسألني عن أي وجبة في المنيو، أسعار، توصيات، أو كيف تستخدم أي خاصية في النظام — وهرد عليك فوراً.`,
      `هاي! كيف أقدر أساعدك النهارده؟ سواء كان سؤال عن المنيو أو النظام، أنا هنا.`,
    ];
    return greets[Math.floor(Math.random() * greets.length)];
  }

  // ─── Thanks / closing ───
  if (/(شكرا|شكراً|تسلم|تمام|thanks|thank you|great|perfect|awesome|perfect)/i.test(q)) {
    return `العفو! 😊 لو عندك أي سؤال تاني، أنا هنا.`;
  }

  // ─── Who are you ───
  if (/(مين انت|من انت|مين أنت|who are you|what are you)/i.test(q)) {
    return `أنا OrderK AI، المساعد الذكي المدمج في نظام OrderK POS v2.4. بشتغل بالذكاء الاصطناعي وعارف كل تفاصيل المنيو، بيانات الوردية، وكيفية استخدام كل خاصية في النظام. فكرني زي ChatGPT بس متخصص في مطعمكم! 🤖`;
  }

  // ─── Specific dish lookup ───
  const matchedDish = MENU_ITEMS.find(item =>
    q.includes(item.name.toLowerCase()) ||
    item.name.toLowerCase().split(' ').some(word => word.length > 4 && q.includes(word))
  );

  if (matchedDish) {
    const margin = matchedDish.margin || 'N/A';
    const sold = matchedDish.soldTonight ?? 0;
    const revenue = matchedDish.revenueTonight ?? 0;
    return `**${matchedDish.name}** — ${matchedDish.category}

السعر: $${matchedDish.price.toFixed(2)} | هامش الربح: ${margin}

${matchedDish.description}

الليلة: بيع منه ${sold} طلب بإيرادات $${revenue.toFixed(2)}${matchedDish.tag ? ` ✨ ${matchedDish.tag.label}` : ''}.

تحتاج معلومة تانية عنه؟`;
  }

  // ─── Steaks / Mains ───
  if (/(ستيك|لحم|لحوم|مشوي|beef|steak|ribeye|wagyu|tomahawk|mignon)/i.test(q)) {
    const steaks = MENU_ITEMS.filter(m => m.category === 'Steaks & Mains');
    const list = steaks.map(s => `• **${s.name}** — $${s.price.toFixed(2)}`).join('\n');
    return `إليك أطباق اللحوم والمشويات المتاحة عندنا:\n\n${list}\n\nأبرزها الليلة Prime Ribeye 12oz بـ 38 طلب. تبي تعرف تفاصيل أي واحد منهم؟`;
  }

  // ─── Seafood ───
  if (/(سمك|بحري|seafood|سيباس|سلمون|لوبستر|اسكالوب|أخطبوط|تونا|bass|salmon|lobster|scallop)/i.test(q)) {
    const sea = MENU_ITEMS.filter(m =>
      ['Seafood', 'Fish', 'Starters'].includes(m.category) &&
      /(sea bass|salmon|lobster|scallop|octopus|tuna|halibut)/i.test(m.name + m.description)
    );
    if (sea.length > 0) {
      const list = sea.map(s => `• **${s.name}** — $${s.price.toFixed(2)}`).join('\n');
      return `المأكولات البحرية اللي عندنا:\n\n${list}\n\n⚠️ تنبيه: Chilean Sea Bass متبقي منه حصة واحدة بس الليلة!`;
    }
    const fishItems = MENU_ITEMS.filter(m =>
      /(sea bass|salmon|lobster|scallop|octopus|tuna|sole|halibut|calamari|squid)/i.test(m.name + ' ' + m.description)
    );
    const list = fishItems.map(s => `• **${s.name}** — $${s.price.toFixed(2)}`).join('\n');
    return `المأكولات البحرية اللي عندنا:\n\n${list}\n\n⚠️ Chilean Sea Bass متبقي منه حصة واحدة الليلة.`;
  }

  // ─── Pasta / Risotto ───
  if (/(باستا|مكرونة|ريزوتو|pasta|risotto|tagliolini|ravioli|pappardelle|gnocchi|spaghetti)/i.test(q)) {
    const pasta = MENU_ITEMS.filter(m => m.category === 'Pasta & Risotto');
    const list = pasta.map(p => `• **${p.name}** — $${p.price.toFixed(2)}`).join('\n');
    return `أطباق الباستا والريزوتو عندنا:\n\n${list}\n\nالأكثر مبيعاً منهم Truffle Tagliolini. تبي تعرف مكونات طبق معين؟`;
  }

  // ─── Burgers ───
  if (/(برجر|burger|ساندوتش|sandwich)/i.test(q)) {
    const burgers = MENU_ITEMS.filter(m => m.category === 'Burgers & Sandwiches');
    const list = burgers.map(b => `• **${b.name}** — $${b.price.toFixed(2)}`).join('\n');
    return `البرجر والسندويتشات اللي عندنا:\n\n${list}\n\nكلهم بمستوى فاخر. أي واحد منهم يهمك؟`;
  }

  // ─── Desserts ───
  if (/(حلو|حلويات|dessert|تيراميسو|تشيز كيك|فوندان|جيلاتو|كيك|sweet)/i.test(q)) {
    const desserts = MENU_ITEMS.filter(m => m.category === 'Desserts');
    const list = desserts.map(d => `• **${d.name}** — $${d.price.toFixed(2)}`).join('\n');
    return `قائمة الحلويات عندنا:\n\n${list}\n\nأشهرهم الليلة Tiramisù Tradizionale و Valrhona Chocolate Fondant. تبي توصي منهم؟`;
  }

  // ─── Drinks ───
  if (/(مشروب|عصير|كوكتيل|drink|cocktail|قهوة|مياه|نبيذ|wine|bar|بار)/i.test(q)) {
    const drinks = MENU_ITEMS.filter(m => m.category === 'Bar & Cocktails' || m.category === 'Beverages');
    const list = drinks.map(d => `• **${d.name}** — $${d.price.toFixed(2)}`).join('\n');
    return `المشروبات والكوكتيلات المتاحة:\n\n${list}\n\nSmoked Old Fashioned هو الأكثر مبيعاً في الحفلات الليلة.`;
  }

  // ─── Vegetarian ───
  if (/(نباتي|vegetarian|vegan|خضار|مافيش لحم|بدون لحم)/i.test(q)) {
    const veg = MENU_ITEMS.filter(m => m.tag?.type === 'vegetarian');
    const list = veg.map(v => `• **${v.name}** (${v.category}) — $${v.price.toFixed(2)}`).join('\n');
    return `الأطباق النباتية عندنا:\n\n${list}\n\nكلها خالية من اللحوم والدواجن. تبي تعرف مكونات أي واحد منهم؟`;
  }

  // ─── Cheapest ───
  if (/(أرخص|ارخص|اقل سعر|cheap|lowest price)/i.test(q)) {
    const sorted = [...MENU_ITEMS].sort((a, b) => a.price - b.price).slice(0, 5);
    const list = sorted.map(m => `• **${m.name}** — $${m.price.toFixed(2)}`).join('\n');
    return `أرخص 5 أصناف في المنيو:\n\n${list}\n\nكلها خيارات ممتازة حتى بأسعار منخفضة.`;
  }

  // ─── Most expensive ───
  if (/(أغلى|اغلى|اعلى سعر|expensive|highest price|premium)/i.test(q)) {
    const sorted = [...MENU_ITEMS].sort((a, b) => b.price - a.price).slice(0, 5);
    const list = sorted.map(m => `• **${m.name}** — $${m.price.toFixed(2)}`).join('\n');
    return `أغلى 5 أصناف في المنيو:\n\n${list}\n\nTomahawk و Wagyu A5 هم الأعلى تميزاً وسعراً.`;
  }

  // ─── Revenue / Sales ───
  if (/(أرباح|ارباح|مبيعات|revenue|sales|دخل|income|إيراد)/i.test(q)) {
    return `إيرادات الوردية الحالية حتى الآن:

💰 **$8,429.50** من هدف $10,500 (80.2% محقق)
📋 142 تذكرة | متوسط قيمة الطلب: $59.36
🏆 Top dish: Prime Ribeye — $1,976 / 38 طلب
📈 الوتيرة: 18.2 تذكرة/ساعة خلال pique الساعة 7-9 مساءً`;
  }

  // ─── Tables ───
  if (/(طاولة|طاولات|table|حجز|reservation|قاعة|floor)/i.test(q)) {
    return `وضع الطاولات الآن:

🪑 14/16 طاولة مشغولة (84%)
✅ متاحة فوراً: T-03, T-12
🧹 بانتظار التنظيف: T-08
📅 3 حجوزات قادمة خلال 30 دقيقة

تبي تعرف تفاصيل طاولة معينة؟`;
  }

  // ─── KDS ───
  if (/(kds|kitchen display|شاشة المطبخ|مطبخ|kitchen)/i.test(q)) {
    return `شاشة KDS (Kitchen Display System) هي الشاشة الرقمية اللي الشيفات بيشوفوا عليها الطلبات بدل البونات الورقية.

الليلة: 6 تذاكر نشطة | متوسط وقت الطهي 11.4 دقيقة | هدف SLA: 14 دقيقة.

الشيف يضغط "Bump Ticket" (أو Space) لما يخلص من التذكرة وتنتقل لمرحلة التقديم.`;
  }

  // ─── Discount ───
  if (/(خصم|discount|تخفيض)/i.test(q)) {
    return `عشان تعمل خصم على فاتورة:

في شاشة **POS / New Order**، اضغط زر **% Discount** الموجود أسفل قائمة السلة. تقدر تضع خصم نسبة مئوية أو مبلغ ثابت.`;
  }

  // ─── Print Bill ───
  if (/(طباعة|اطبع|فاتورة|print|receipt|bill)/i.test(q)) {
    return `لطباعة الفاتورة:

اضغط على زر **Print Bill** (البنفسجي) أسفل السلة في شاشة POS. هيفتح معاينة الشيك الحراري مع زر طباعة فوري.`;
  }

  // ─── Split Bill ───
  if (/(تقسيم|split|قسم الفاتورة|فصل الحساب)/i.test(q)) {
    return `لتقسيم الفاتورة بين الضيوف:

اضغط زر **Split Bill** الموجود فوق قائمة السلة في الـ POS. تقدر تقسم بالتساوي أو حسب ما طلب كل ضيف.`;
  }

  // ─── Transfer Table ───
  if (/(نقل|تحويل|transfer|تغيير طاولة)/i.test(q)) {
    return `لنقل طاولة (Transfer Table):

من شاشة **Floor & Tables** أو **Live Orders**، اضغط على **Transfer Table** واختار الطاولة الجديدة — التذكرة كلها هتنتقل في ثانية.`;
  }

  // ─── Send to Kitchen ───
  if (/(إرسال|ارسال|fire|send to kitchen|ارسل للمطبخ)/i.test(q)) {
    return `لإرسال الطلب للمطبخ:

بعد إضافة الوجبات للسلة في POS، اضغط **Send to Kitchen / FIRE NOW** (الزر الأحمر الكبير في الأسفل). الطلب هيظهر فوراً على شاشة KDS للشيفات.`;
  }

  // ─── 86 / Stock ───
  if (/(86|نفد|نفاد|مخزون|stock|inventory|متبقي)/i.test(q)) {
    return `86 Item = الصنف قرب ينتهي من المخزن.

الليلة: **Chilean Sea Bass** متبقي منه حصة واحدة بس — لو بيتطلب كتير يُنصح بإبلاغ المضيف لإزالته من الترشيحات الشفهية.`;
  }

  // ─── Recommendation ───
  if (/(توصية|وصيلي|وصيني|recommend|اقترح|اقتراح|أفضل طبق|best dish)/i.test(q)) {
    const topSellers = [...MENU_ITEMS]
      .sort((a, b) => (b.soldTonight ?? 0) - (a.soldTonight ?? 0))
      .slice(0, 3);
    const list = topSellers.map((m, i) => `${i + 1}. **${m.name}** — $${m.price.toFixed(2)} (${m.soldTonight} طلب الليلة)`).join('\n');
    return `أفضل الأطباق مبيعاً الليلة:\n\n${list}\n\nلو بتبحث عن شيء خاص (نباتي، بحري، حلويات...) قول وأوصيلك بالضبط.`;
  }

  // ─── Menu count ───
  if (/(كم وجبة|كمية الوجبات|عدد الوجبات|how many items|menu count)/i.test(q)) {
    return `المنيو عندنا فيه **${MENU_ITEMS.length} صنف** موزعين على ${new Set(MENU_ITEMS.map(m => m.category)).size} أقسام مختلفة. تبي أعدد الأقسام؟`;
  }

  // ─── Follow-up context (references previous topic) ───
  if (isFollowUp && /(وأيه|وإيه|وكمان|وبعدين|وبعد كده|and|also|what about|more|تاني|أكتر)/i.test(q)) {
    return `بناءً على اللي اتكلمنا فيه — هل تبي أعمق في نفس الموضوع أو تسأل عن شيء تاني؟ أنا هنا! 😊`;
  }

  // ─── Fallback ───
  const fallbacks = [
    `سؤال ممتاز! للأسف مش عارف أجاوب عليه بشكل مباشر من البيانات المتاحة عندي. جرب تسأل عن وجبة معينة، سعر، أو خاصية في النظام وهرد عليك بدقة.`,
    `مش متأكد من المقصود بالضبط. ممكن توضح أكتر؟ مثلاً: اسم الطبق، أو الإجراء اللي تبي تعمله في النظام.`,
    `ده سؤال برا تخصصي الأساسي 😅 — أنا متخصص في مطعم Downtown Bistro والنظام. اسألني عن المنيو أو POS وهكون أدق بكتير!`,
  ];
  return fallbacks[Math.floor(Math.random() * fallbacks.length)];
}

// ─────────────────────────────────────────────────────────────
export const OrderKTerminal: React.FC<OrderKTerminalProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `أهلاً! أنا **OrderK AI** 🤖 — مساعدك الذكي في مطعم Downtown Bistro.\n\nاسألني عن أي وجبة في المنيو، سعر، توصية، أو كيفية استخدام أي خاصية في النظام. أنا هنا لأساعدك!`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 150);
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = input.trim();
    if (!text || isTyping) return;

    playChime('bell');
    const userMsg: Message = { role: 'user', content: text, timestamp: new Date() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setIsTyping(true);

    // Simulate thinking delay (like ChatGPT)
    const thinkTime = 400 + Math.random() * 600;
    setTimeout(() => {
      const reply = simulateChatGPT(updated, text);
      setMessages(prev => [...prev, { role: 'assistant', content: reply, timestamp: new Date() }]);
      setIsTyping(false);
      playChime('bump');
      setTimeout(() => inputRef.current?.focus(), 50);
    }, thinkTime);
  };

  const handleSuggestion = (text: string) => {
    setInput(text);
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      const textTrimmed = text.trim();
      if (!textTrimmed || isTyping) return;
      playChime('bell');
      const userMsg: Message = { role: 'user', content: textTrimmed, timestamp: new Date() };
      const updated = [...messages, userMsg];
      setMessages(updated);
      setInput('');
      setIsTyping(true);
      const thinkTime = 400 + Math.random() * 600;
      setTimeout(() => {
        const reply = simulateChatGPT(updated, textTrimmed);
        setMessages(prev => [...prev, { role: 'assistant', content: reply, timestamp: new Date() }]);
        setIsTyping(false);
        playChime('bump');
      }, thinkTime);
    }, 50);
  };

  // Render message content with simple **bold** markdown
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

  const suggestions = [
    'أفضل أطباق الليلة؟',
    'عندكم مأكولات بحرية؟',
    'إيه أرخص وجبة في المنيو؟',
    'إزاي أعمل خصم؟',
    'أرباح المطعم الليلة كام؟',
    'عندكم حاجة نباتية؟',
  ];

  return (
    <div
      className={`fixed z-50 transition-all duration-300 shadow-2xl ${
        isExpanded
          ? 'inset-4 md:inset-10'
          : 'bottom-6 right-6 w-[94vw] md:w-[600px]'
      }`}
      style={{ maxHeight: isExpanded ? undefined : '82vh' }}
    >
      <div className="w-full h-full rounded-2xl bg-[#0a0d24] border border-[#ff7b72]/30 flex flex-col overflow-hidden shadow-[0_0_40px_rgba(255,126,112,0.12)] ring-1 ring-white/10">

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
              <span>OrderK AI Terminal</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-sans border border-emerald-500/30">
                GPT-Style
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
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
              {/* Avatar */}
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

              {/* Bubble */}
              <div
                className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-xs font-sans leading-relaxed ${
                  msg.role === 'assistant'
                    ? 'bg-[#0f1435] border border-white/[0.06] text-slate-200 rounded-tl-sm'
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

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#ff9e93] to-[#ff7b72] flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-[#1b0808]" />
              </div>
              <div className="bg-[#0f1435] border border-white/[0.06] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff9e93] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff9e93] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#ff9e93] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Quick Suggestions (shown only when only welcome message) ── */}
        {messages.length === 1 && !isTyping && (
          <div className="px-4 pb-2 bg-[#080b1f]">
            <p className="text-[10px] text-slate-500 mb-2 font-sans">اقتراحات سريعة:</p>
            <div className="flex flex-wrap gap-1.5">
              {suggestions.map((s, i) => (
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
              <Sparkles className="w-3 h-3" />
              <span>AI</span>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب سؤالك هنا..."
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
    </div>
  );
};

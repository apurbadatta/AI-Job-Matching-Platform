"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { sendChatMessage } from "@/lib/api";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const SUGGESTIONS = [
  "How do I improve my resume?",
  "What jobs match my skills?",
  "Tips for salary negotiation",
  "How to prepare for interviews?",
  "What is JobPilot AI?",
];

const fallbackResponses: Record<string, string[]> = {
  resume: [
    "**Resume Tips:**\n\n1. **Keep it concise** — 1-2 pages max, focus on relevant experience\n2. **Use action verbs** — \"Led\", \"Built\", \"Increased\", \"Reduced\"\n3. **Quantify results** — \"Increased sales by 30%\" instead of \"Improved sales\"\n4. **Tailor to each job** — Match keywords from the job description\n5. **Proofread** — One typo can cost you an interview\n\nWould you like more specific advice?",
    "**Quick Resume Wins:**\n- Use a clean, ATS-friendly format\n- Lead with your strongest achievements\n- Include a skills section with both hard and soft skills\n- Remove outdated or irrelevant experience\n- Add a professional summary at the top\n\nWant me to elaborate on any of these?",
    "**Resume Checklist:**\n\u2713 Contact info at the top (email, phone, LinkedIn)\n\u2713 Strong opening summary tailored to the role\n\u2713 Bullet points start with action verbs\n\u2713 Numbers and metrics wherever possible\n\u2713 No typos or formatting inconsistencies\n\nWhat aspect of your resume would you like to improve?",
  ],
  interview: [
    "**Interview Preparation Tips:**\n\n1. **Research the company** — Know their mission, products, recent news\n2. **Practice STAR method** — Situation, Task, Action, Result for behavioral questions\n3. **Prepare questions** — Ask about team culture, growth opportunities\n4. **Dress appropriately** — Better overdressed than underdressed\n5. **Follow up** — Send a thank-you email within 24 hours\n\nWould you like tips on a specific type of interview?",
    "**Common Interview Questions:**\n- \"Tell me about yourself\" — Focus on your arc, not your life story\n- \"Why this company?\" — Show you've done your research\n- \"What's your greatest weakness?\" — Pick a real weakness and explain how you're improving\n- \"Where do you see yourself in 5 years?\" — Align with the company's trajectory\n\nWant a deep dive on any of these?",
    "**Before the Interview:**\n\u2713 Review the job description again\n\u2713 Prepare 3-5 stories showcasing key skills\n\u2713 Test your tech (camera, mic, internet)\n\u2713 Set up a quiet, well-lit space\n\u2713 Have water and notes nearby\n\nGood luck! You've got this!",
  ],
  salary: [
    "**Salary Negotiation Tips:**\n\n1. **Research market rates** — Use Glassdoor, LinkedIn Salary, Payscale\n2. **Know your worth** — Factor in experience, skills, location\n3. **Let them make the first offer** — Then negotiate from there\n4. **Consider total compensation** — Benefits, bonuses, equity, PTO\n5. **Be professional** — Express enthusiasm while advocating for yourself\n\nRemember: The worst they can say is no!",
    "**Negotiation Script Ideas:**\n- \"I'm really excited about this role. Based on my research and experience, I was hoping for something in the range of $X-$Y.\"\n- \"Is there flexibility on the base salary? I'm also open to discussing sign-on bonus or equity.\"\n- \"What does the full compensation package look like beyond salary?\"\n\nPractice out loud before the conversation!",
    "**Beyond Base Salary:**\n\u2713 Sign-on bonuses\n\u2713 Annual performance bonuses\n\u2713 Stock options / RSUs\n\u2713 Remote work stipend\n\u2713 Professional development budget\n\u2713 Extra vacation time\n\nSometimes these are easier to negotiate than base pay!",
  ],
  jobsearch: [
    "**Job Search Strategies:**\n\n1. **Use JobPilot AI** — Our AI matches your skills with the best jobs!\n2. **Optimize your profile** — Complete your skills and experience for better AI recommendations\n3. **Network actively** — 70% of jobs are filled through networking\n4. **Apply strategically** — Quality over quantity, tailor each application\n5. **Follow up** — A polite follow-up shows genuine interest\n\nTry clicking **\"Generate Recommendations\"** on your dashboard!",
    "**Smart Job Search Tips:**\n- Set up job alerts so you never miss a posting\n- Apply within 48 hours of a job being posted for best odds\n- Customize your resume for each application (focus on matching keywords)\n- Use your network — referrals dramatically increase interview chances\n- Track your applications in a spreadsheet\n\nConsistency beats intensity!",
    "**The Hidden Job Market:**\n70-80% of jobs are never publicly posted. To tap into them:\n- Reach out to your network on LinkedIn\n- Attend industry events and meetups\n- Message recruiters directly\n- Join professional communities and Slack groups\n- Let people know you're looking\n\nWho in your network could you reach out to today?",
  ],
  skills: [
    "**Skill Development Tips:**\n\n1. **In-demand skills** — Check job postings for trending technologies\n2. **Online courses** — Coursera, Udemy, freeCodeCamp\n3. **Build projects** — Hands-on experience beats certificates\n4. **Contribute to open source** — Great for networking and learning\n5. **Stay updated** — Follow industry blogs, podcasts, and leaders\n\nWhat field are you in? I can suggest specific skills!",
    "**High-Impact Skills by Field:**\n- **Tech:** Python, cloud (AWS/Azure), AI/ML, cybersecurity\n- **Marketing:** SEO, content strategy, analytics, CRM tools\n- **Finance:** Financial modeling, data analysis, ERP systems\n- **Design:** Figma, UX research, design systems, prototyping\n\nWhat industry are you targeting?",
    "**Project Ideas to Build Skills:**\n- Build a portfolio website showcasing your work\n- Create a data dashboard with real datasets\n- Write blog posts or make tutorials about what you learn\n- Solve real problems with small automation scripts\n- Volunteer your skills for a nonprofit\n\nProjects stick better than courses!",
  ],
  platform: [
    "**JobPilot AI Features:**\n\n\uD83D\uDD39 **AI Job Recommendations** — Personalized matches on your dashboard\n\uD83D\uDD39 **AI Cover Letters** — Generate tailored cover letters for any job\n\uD83D\uDD39 **AI Job Descriptions** — Employers can generate descriptions from bullet points\n\uD83D\uDD39 **Smart Search** — Filter jobs by category, location, type, salary\n\uD83D\uDD39 **Application Tracking** — Track all your applications in one place\n\uD83D\uDD39 **AI Career Chat** — That's me! Ask me anything!\n\nWhich feature interests you?",
    "**JobPilot AI for Candidates:**\n\u2713 Personalized job recommendations powered by AI\n\u2713 One-click cover letter generation\n\u2713 Track applications from one dashboard\n\u2713 Get matched based on your skills and preferences\n\u2713 Career advice available 24/7\n\nReady to find your next role? Start by updating your profile!",
    "**JobPilot AI for Employers:**\n\u2713 Post jobs and reach qualified candidates\n\u2713 AI-powered job description generator\n\u2713 Review and manage applications\n\u2713 Company profile and branding\n\u2713 Analytics on your job postings\n\nLooking to hire? Check out the employer dashboard!",
  ],
  greeting: [
    "Hello! I'm here to help you with:\n\n\u2022 **Resume writing** and optimization\n\u2022 **Interview preparation** tips\n\u2022 **Salary negotiation** strategies\n\u2022 **Job search** advice\n\u2022 **Career development** guidance\n\u2022 **Platform features** of JobPilot AI\n\nWhat would you like to know?",
    "Hi there! I'm your JobPilot AI Career Assistant. I can help with:\n\n\u2022 Crafting a standout resume\n\u2022 Acing your interviews\n\u2022 Negotiating your salary\n\u2022 Finding the right job\n\u2022 Growing your career\n\nWhat's on your mind today?",
    "Hey! Welcome to JobPilot AI. I'm here to support your career journey. Ask me about:\n\n\u2022 Resume tips & templates\n\u2022 Interview strategies\n\u2022 Salary negotiations\n\u2022 Job search hacks\n\u2022 Platform features\n\nHow can I help you today?",
  ],
};

function pickRandom(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getLocalFallback(question: string): string {
  const q = question.toLowerCase();
  if (q.includes("resume") || q.includes("cv")) return pickRandom(fallbackResponses.resume);
  if (q.includes("interview")) return pickRandom(fallbackResponses.interview);
  if (q.includes("salary") || q.includes("negotiate")) return pickRandom(fallbackResponses.salary);
  if (q.includes("job") && (q.includes("search") || q.includes("find") || q.includes("match"))) return pickRandom(fallbackResponses.jobsearch);
  if (q.includes("skill") || q.includes("learn") || q.includes("improve")) return pickRandom(fallbackResponses.skills);
  if (q.includes("platform") || q.includes("jobpilot") || q.includes("feature")) return pickRandom(fallbackResponses.platform);
  if (q.includes("hello") || q.includes("hi") || q.includes("hey") || q.includes("help")) return pickRandom(fallbackResponses.greeting);
  return pickRandom([
    "That's a great question! Here's what I can help with:\n\n\u2022 **Resume tips** — Ask about writing or improving your resume\n\u2022 **Interview prep** — Get ready for your next interview\n\u2022 **Salary negotiation** — Learn to negotiate with confidence\n\u2022 **Job search** — Strategies to find your dream job\n\u2022 **Platform help** — Learn about JobPilot AI features\n\nWhat interests you?",
    "I'd love to help with that! Here are the topics I know best:\n\n\u2022 **Resumes & CVs** — Optimization tips\n\u2022 **Interviews** — Prep and practice\n\u2022 **Salary** — Negotiation strategies\n\u2022 **Job searching** — Effective techniques\n\u2022 **JobPilot AI** — Platform features\n\nWhich one should we dive into?",
  ]);
}

export default function AIChatbot() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const isLoggedIn = !!session;

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hi! I'm your AI Career Assistant. I can help you with resume tips, interview prep, job search advice, and more. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleSend = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    const userMessage: Message = { role: "user", text: msg };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const allMessages = [...messages, userMessage]
        .filter((_, i) => !(i === 0 && messages[0]?.role === "assistant"))
        .map((m) => ({
          role: m.role,
          text: m.text,
        }));

      const result = await sendChatMessage(allMessages);
      setMessages((prev) => [...prev, { role: "assistant", text: result.reply }]);
    } catch {
      const localReply = getLocalFallback(msg);
      setMessages((prev) => [...prev, { role: "assistant", text: localReply }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isLoggedIn) return null;

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? "bg-gray-600 hover:bg-gray-700 rotate-0"
            : "bg-blue-600 hover:bg-blue-700 hover:scale-110"
        }`}
      >
        {isOpen ? (
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden" style={{ height: "500px" }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-sm">JobPilot AI Assistant</h3>
              <p className="text-blue-100 text-xs">Career advice & job tips</p>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-blue-100 text-xs">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-md"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-md"
                }`}>
                  {msg.text.split("\n").map((line, j) => (
                    <span key={j}>
                      {line.split("**").map((part, k) =>
                        k % 2 === 1 ? <strong key={k}>{part}</strong> : part
                      )}
                      {j < msg.text.split("\n").length - 1 && <br />}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            {/* Suggestions */}
            {messages.length === 1 && !loading && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(s)}
                    className="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about careers, resumes, interviews..."
                disabled={loading}
                className="flex-1 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

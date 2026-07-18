"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

function AnimatedCounter({ end, duration = 2000, suffix = "" }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else { setCount(Math.floor(start)); }
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, end, duration]);

  return <div ref={ref}>{count.toLocaleString()}{suffix}</div>;
}

const categories = [
  { name: "Development", icon: "💻", count: 2450, color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" },
  { name: "Design", icon: "🎨", count: 1230, color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" },
  { name: "Marketing", icon: "📢", count: 980, color: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400" },
  { name: "Sales", icon: "💼", count: 870, color: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400" },
  { name: "Data Science", icon: "📊", count: 650, color: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400" },
  { name: "Finance", icon: "💰", count: 540, color: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400" },
];

const companies = [
  { name: "Google", logo: "G", color: "bg-blue-500" },
  { name: "Microsoft", logo: "M", color: "bg-green-500" },
  { name: "Apple", logo: "A", color: "bg-gray-800" },
  { name: "Amazon", logo: "A", color: "bg-orange-500" },
  { name: "Meta", logo: "M", color: "bg-blue-600" },
  { name: "Netflix", logo: "N", color: "bg-red-600" },
];

const testimonials = [
  { quote: "JobPilot AI matched me with my dream job in just 2 days. The AI recommendations were spot-on!", name: "Sarah Chen", role: "Software Engineer", type: "candidate" },
  { quote: "We found 3 perfect candidates in a week. The AI matching saves us hundreds of hours.", name: "Mike Rodriguez", role: "HR Director, TechCorp", type: "employer" },
  { quote: "The platform understood my skills better than I did. Landed a role at a top startup.", name: "Priya Patel", role: "Product Designer", type: "candidate" },
];

const faqs = [
  { q: "How does the AI matching work?", a: "Our AI analyzes your skills, experience, preferences, and career goals to match you with the most relevant opportunities. It learns from your interactions to improve recommendations over time." },
  { q: "Is JobPilot AI free for job seekers?", a: "Yes! Job seekers can create a profile, browse jobs, and receive AI recommendations for free. Premium features like priority matching and resume review are available with our Pro plan." },
  { q: "How do employers post jobs?", a: "Employers can sign up, choose a pricing plan, and post jobs in minutes. Our AI helps optimize job descriptions to attract the right candidates." },
  { q: "What makes JobPilot AI different?", a: "Unlike traditional job boards, we use advanced AI to actively match candidates with jobs, rather than relying on manual searches. Our success rate is 3x higher than industry average." },
  { q: "Can I use JobPilot AI on mobile?", a: "Yes! JobPilot AI is fully responsive and works beautifully on all devices - smartphones, tablets, and desktops." },
];

export default function LandingPage() {
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 dark:bg-blue-900/30 rounded-full blur-3xl opacity-50" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 dark:bg-purple-900/30 rounded-full blur-3xl opacity-50" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block px-4 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium mb-6 animate-fade-in">
              AI-Powered Job Matching
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-slide-up">
              Find Your Dream Job with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                AI Precision
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto animate-slide-up-delay">
              JobPilot AI uses advanced machine learning to connect you with opportunities
              that perfectly match your skills and aspirations.
            </p>

            {/* Search Bar */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-2 max-w-3xl mx-auto animate-slide-up-delay-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex items-center px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Job title or keyword"
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500"
                  />
                </div>
                <div className="flex-1 flex items-center px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Location"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500"
                  />
                </div>
                <Link
                  href={`/jobs?title=${searchTitle}&location=${searchLocation}`}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors text-center"
                >
                  Search Jobs
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              {[
                { value: 10000, suffix: "+", label: "Jobs Posted" },
                { value: 500, suffix: "+", label: "Companies" },
                { value: 50000, suffix: "+", label: "Candidates" },
                { value: 94, suffix: "%", label: "Match Rate" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Job Categories */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Explore Job Categories
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              From tech to finance, find opportunities across industries that match your expertise.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={`/jobs?category=${cat.name.toLowerCase()}`}
                className={`p-6 rounded-2xl ${cat.color} hover:scale-105 transition-transform text-center`}
              >
                <div className="text-3xl mb-3">{cat.icon}</div>
                <div className="font-semibold text-gray-900 dark:text-white">{cat.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{cat.count} jobs</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How JobPilot AI Works
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Three simple steps to your next career move.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-24 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 dark:from-blue-800 dark:via-blue-600 dark:to-blue-800" />
            {[
              { step: "1", title: "Create Your Profile", desc: "Sign up and tell us about your skills, experience, and career goals. Our AI learns what makes you unique." },
              { step: "2", title: "Get AI Matches", desc: "Our algorithms analyze thousands of opportunities to find the ones that perfectly fit your profile." },
              { step: "3", title: "Apply & Get Hired", desc: "Apply with one click, track your applications, and land your dream job faster than ever." },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 relative z-10">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Feature Highlight */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Let AI Find Your Perfect Job
              </h2>
              <p className="text-blue-100 text-lg mb-8">
                Our recommendation engine goes beyond keywords. It understands your career trajectory,
                learning style, and workplace preferences to surface opportunities you&apos;ll actually love.
              </p>
              <ul className="space-y-4">
                {[
                  "Skill-based matching with 94% accuracy",
                  "Personalized career path suggestions",
                  "Real-time market demand insights",
                  "Salary benchmarking for your role",
                ].map((feature) => (
                  <li key={feature} className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-green-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="space-y-4">
                {[
                  { label: "Frontend Developer", match: 96 },
                  { label: "React Engineer", match: 92 },
                  { label: "UI/UX Designer", match: 87 },
                ].map((job) => (
                  <div key={job.label} className="bg-white/10 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{job.label}</span>
                      <span className="text-green-300 font-semibold">{job.match}% Match</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div className="bg-green-400 h-2 rounded-full" style={{ width: `${job.match}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Statistics */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Platform Statistics
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Real numbers that show our impact.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: 10000, suffix: "+", label: "Jobs Posted", icon: "💼" },
              { value: 500, suffix: "+", label: "Companies", icon: "🏢" },
              { value: 50000, suffix: "+", label: "Candidates", icon: "👥" },
              { value: 94, suffix: "%", label: "Success Rate", icon: "🎯" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-sm">
                <div className="text-3xl mb-3">{stat.icon}</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Companies */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Top Companies Hiring
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Join thousands of companies finding talent through JobPilot AI.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {companies.map((company) => (
              <Link
                key={company.name}
                href="/jobs"
                className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 flex flex-col items-center justify-center hover:shadow-lg transition-shadow"
              >
                <div className={`w-16 h-16 ${company.color} rounded-xl flex items-center justify-center text-white text-2xl font-bold mb-3`}>
                  {company.logo}
                </div>
                <span className="font-medium text-gray-900 dark:text-white">{company.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Our Users Say
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center mb-1">
                  {[...Array(5)].map((_, j) => (
                    <svg key={j} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 italic">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <div className="font-semibold text-gray-900 dark:text-white">{t.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Start free, upgrade when you need more.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: "Free", price: "$0", desc: "For job seekers", features: ["AI job matching", "5 applications/week", "Basic profile", "Email support"], cta: "Get Started" },
              { name: "Pro", price: "$19", desc: "For professionals", features: ["Unlimited applications", "Priority matching", "Resume review", "Analytics dashboard"], cta: "Start Pro Trial", popular: true },
              { name: "Business", price: "$99", desc: "For employers", features: ["Unlimited job posts", "Candidate search", "Team collaboration", "API access"], cta: "Contact Sales" },
            ].map((plan) => (
              <div key={plan.name} className={`rounded-2xl p-8 ${plan.popular ? "bg-blue-600 text-white ring-4 ring-blue-400" : "bg-gray-50 dark:bg-gray-800"}`}>
                {plan.popular && <div className="text-sm font-medium text-blue-200 mb-2">Most Popular</div>}
                <h3 className={`text-xl font-bold ${plan.popular ? "text-white" : "text-gray-900 dark:text-white"}`}>{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className={`text-4xl font-bold ${plan.popular ? "text-white" : "text-gray-900 dark:text-white"}`}>{plan.price}</span>
                  <span className={`ml-1 ${plan.popular ? "text-blue-200" : "text-gray-500"}`}>/month</span>
                </div>
                <p className={`mt-2 ${plan.popular ? "text-blue-200" : "text-gray-500 dark:text-gray-400"}`}>{plan.desc}</p>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center space-x-2">
                      <svg className={`w-5 h-5 ${plan.popular ? "text-blue-200" : "text-green-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={plan.popular ? "text-blue-100" : "text-gray-600 dark:text-gray-300"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/pricing"
                  className={`mt-8 block text-center py-3 px-6 rounded-xl font-medium transition-colors ${
                    plan.popular
                      ? "bg-white text-blue-600 hover:bg-blue-50"
                      : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/pricing" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
              Compare all plans &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="font-medium text-gray-900 dark:text-white">{faq.q}</span>
                  <svg className={`w-5 h-5 text-gray-500 transition-transform ${openFaq === i ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-gray-600 dark:text-gray-400">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter + Final CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Find Your Perfect Job?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Join 50,000+ professionals who found their dream jobs through JobPilot AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-8">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl text-gray-900 placeholder-gray-500 outline-none"
            />
            <button className="px-6 py-3 bg-white text-blue-600 hover:bg-blue-50 font-medium rounded-xl transition-colors">
              Subscribe
            </button>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-3 bg-white text-blue-600 font-medium rounded-xl hover:bg-blue-50 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="/jobs"
              className="px-8 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-colors border border-white/20"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

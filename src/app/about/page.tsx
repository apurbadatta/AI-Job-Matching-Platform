import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - JobPilot AI",
  description: "Learn about JobPilot AI's mission to revolutionize job matching with artificial intelligence.",
};

const team = [
  {
    name: "Sarah Mitchell",
    role: "CEO & Co-Founder",
    bio: "Former VP of Talent Acquisition at a Fortune 500 company. 15 years of experience in HR technology and workforce development.",
    image: "",
  },
  {
    name: "James Cooper",
    role: "CTO & Co-Founder",
    bio: "Ex-Google engineer with expertise in machine learning and distributed systems. Built recommendation engines serving millions of users.",
    image: "",
  },
  {
    name: "Emily Chen",
    role: "Head of Product",
    bio: "Previously led product teams at LinkedIn and Indeed. Passionate about creating intuitive experiences that connect people with opportunities.",
    image: "",
  },
  {
    name: "David Park",
    role: "Head of AI Research",
    bio: "PhD in Computer Science from Stanford. Published researcher in natural language processing and career matching algorithms.",
    image: "",
  },
  {
    name: "Lisa Wang",
    role: "Head of Marketing",
    bio: "Grew three startups from seed to Series B. Expert in growth marketing and building authentic brand communities.",
    image: "",
  },
  {
    name: "Michael Torres",
    role: "Head of Engineering",
    bio: "Full-stack engineer with 12 years of experience. Previously built scalable platforms at Airbnb and Shopify.",
    image: "",
  },
];

const values = [
  {
    title: "Transparency",
    description: "We believe job seekers deserve honest information about companies, salaries, and culture. No hidden agendas, no misleading listings.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
  },
  {
    title: "Innovation",
    description: "We leverage cutting-edge AI to make better matches, not just more matches. Technology should serve people, not the other way around.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: "Inclusivity",
    description: "Every person deserves access to meaningful employment regardless of background. We design for accessibility and equity in everything we build.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    title: "Data Privacy",
    description: "Your career data is yours. We never sell personal information to third parties and give you full control over what you share.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

const milestones = [
  { year: "2022", event: "JobPilot AI founded with a vision to fix the broken hiring process." },
  { year: "2023", event: "Launched beta with AI-powered matching, serving 10,000 early adopters." },
  { year: "2024", event: "Raised Series A funding. Expanded to 500,000 jobs and 200,000 users." },
  { year: "2025", event: "Introduced AI cover letters, career coaching, and employer analytics tools." },
  { year: "2026", event: "Serving over 2 million professionals and 15,000 companies worldwide." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-800 dark:to-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Redefining How People
              <span className="block text-blue-200">Find Meaningful Work</span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-100">
              We believe everyone deserves a career they love. JobPilot AI uses artificial intelligence
              to connect talented professionals with opportunities that truly match their skills,
              values, and ambitions.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                The traditional job search process is broken. Candidates spend countless hours
                scrolling through irrelevant listings, while employers struggle to find qualified
                applicants. The result is frustration on both sides.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                JobPilot AI was built to solve this problem. Our AI-powered platform analyzes
                your skills, experience, preferences, and career goals to deliver personalized
                job recommendations that actually make sense. No more guessing, no more wasted time.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                We are on a mission to make the job search process transparent, efficient, and
                human-centered. Every feature we build is designed with one question in mind:
                does this help people find work they genuinely love?
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800/50 rounded-2xl p-8 sm:p-12">
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">2M+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">15K+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Partner Companies</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">500K+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Jobs Matched</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">92%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              These principles guide every decision we make, from product development to customer support.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story / Timeline */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              From a small idea to a platform trusted by millions. Here is how we got here.
            </p>
          </div>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-0.5 bg-blue-200 dark:bg-blue-800 -translate-x-1/2" />
            <div className="space-y-12">
              {milestones.map((m, i) => (
                <div
                  key={m.year}
                  className={`relative flex flex-col sm:flex-row ${
                    i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                  } items-start sm:items-center`}
                >
                  <div className={`sm:w-1/2 ${i % 2 === 0 ? "sm:pr-12 sm:text-right" : "sm:pl-12"}`}>
                    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm">
                      <div className="text-blue-600 dark:text-blue-400 font-bold text-lg mb-1">{m.year}</div>
                      <p className="text-gray-600 dark:text-gray-300">{m.event}</p>
                    </div>
                  </div>
                  <div className="absolute left-4 sm:left-1/2 w-4 h-4 bg-blue-600 rounded-full border-4 border-white dark:border-gray-900 -translate-x-1/2 top-6 sm:top-1/2 sm:-translate-y-1/2 z-10" />
                  <div className="sm:w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Meet the Team
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Passionate professionals dedicated to transforming the way people find and build their careers.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow text-center"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-blue-600 dark:text-blue-400 text-sm font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Find Your Dream Job?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Join over 2 million professionals who have transformed their careers with JobPilot AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="/jobs"
              className="px-8 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

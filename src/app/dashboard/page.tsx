"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  generateRecommendations,
  trackInteraction,
  fetchSavedJobs,
  Recommendation,
  Job,
} from "@/lib/api";
import RecommendationCard, {
  RecommendationCardSkeleton,
} from "@/components/RecommendationCard";

const CATEGORIES = [
  "Development", "Design", "Marketing", "Sales", "Data Science", "Finance",
  "Engineering", "Product", "Customer Support", "Other",
];

const statIcons: Record<string, React.ReactNode> = {
  recommendations: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  saved: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
  ),
  score: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  letters: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
};

const statColors: Record<string, string> = {
  recommendations: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  saved: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
  score: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  letters: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
};

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user as any;
  const queryClient = useQueryClient();

  const [preferredCategory, setPreferredCategory] = useState("");
  const [preferredLocation, setPreferredLocation] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login?redirect=/dashboard");
    } else if (!isPending && user) {
      if (user.role === "admin") {
        router.push("/admin");
      } else if (user.role === "employer") {
        router.push("/jobs/manage");
      }
    }
  }, [session, isPending, router, user]);

  const {
    data: recData,
    isLoading: recLoading,
    error: recError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["recommendations", preferredCategory, preferredLocation],
    queryFn: () => generateRecommendations(preferredCategory || undefined, preferredLocation || undefined),
    enabled: !!session && user?.role === "candidate",
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const { data: savedJobs = [] } = useQuery({
    queryKey: ["savedJobs"],
    queryFn: fetchSavedJobs,
    enabled: !!session && user?.role === "candidate",
  });

  const savedJobIds = new Set(savedJobs.map((j: Job) => j._id));

  const interactionMutation = useMutation({
    mutationFn: ({ jobId, type }: { jobId: string; type: string }) =>
      trackInteraction(jobId, type),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedJobs"] });
    },
  });

  const handleSave = useCallback(
    (jobId: string) => {
      const isSaved = savedJobIds.has(jobId);
      interactionMutation.mutate({
        jobId,
        type: isSaved ? "unsave" : "save",
      });
    },
    [savedJobIds, interactionMutation]
  );

  const handleApply = useCallback(
    (jobId: string) => {
      interactionMutation.mutate({ jobId, type: "apply" });
      router.push(`/jobs/${jobId}`);
    },
    [interactionMutation, router]
  );

  if (isPending || !session || user?.role !== "candidate") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const recommendations = recData?.recommendations || [];
  const totalAnalyzed = recData?.totalAnalyzed || 0;
  const avgScore = recommendations.length > 0
    ? Math.round(recommendations.reduce((a: number, r: Recommendation) => a + r.score, 0) / recommendations.length)
    : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                Welcome back, {user?.name?.split(" ")[0] || "there"}!
              </h1>
              <p className="text-blue-100 text-sm">
                AI-powered job recommendations tailored to your profile
              </p>
            </div>
            <Link
              href="/profile"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 text-white text-sm font-medium rounded-xl transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Edit Profile
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { key: "recommendations", label: "Recommendations", value: recommendations.length.toString() },
            { key: "saved", label: "Saved Jobs", value: savedJobs.length.toString() },
            { key: "score", label: "Avg Match Score", value: avgScore !== null ? `${avgScore}%` : "N/A" },
            { key: "letters", label: "Cover Letters", value: "-", href: "/cover-letters" },
          ].map((stat) => (
            <Link
              key={stat.key}
              href={stat.href || "#"}
              className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 ${stat.href ? "hover:shadow-md hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 group" : ""}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${statColors[stat.key]} ${stat.href ? "group-hover:scale-110 transition-transform" : ""}`}>
                  {statIcons[stat.key]}
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/applications"
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Applications</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Track your job applications</p>
              </div>
            </div>
          </Link>
          <Link
            href="/cover-letters"
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Cover Letters</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Generate AI-powered cover letters</p>
              </div>
            </div>
          </Link>
          <Link
            href="/blog"
            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-md hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Blog</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Career tips and industry insights</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Filter Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Refine Recommendations
                </span>
                {totalAnalyzed > 0 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({totalAnalyzed} jobs analyzed)
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
              >
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                    Preferred Category
                  </label>
                  <select
                    value={preferredCategory}
                    onChange={(e) => setPreferredCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any Category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                    Preferred Location
                  </label>
                  <input
                    type="text"
                    value={preferredLocation}
                    onChange={(e) => setPreferredLocation(e.target.value)}
                    placeholder="e.g. San Francisco"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isFetching ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Regenerate
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error State */}
        {recError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">
                  Failed to load recommendations
                </h3>
                <p className="text-sm text-red-600 dark:text-red-400 mb-3">
                  Our AI service encountered an error. Please try again.
                </p>
                <button
                  onClick={() => refetch()}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {recLoading ? (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Finding your perfect matches...
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <RecommendationCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : recommendations.length === 0 && !recError ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center">
            <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No recommendations yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
              Complete your profile with skills and experience to get personalized AI job recommendations.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/profile"
                className="px-5 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Update Profile
              </Link>
              <button
                onClick={() => refetch()}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Generate Recommendations
              </button>
            </div>
          </div>
        ) : recommendations.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recommended for You
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {recommendations.length} match{recommendations.length !== 1 ? "es" : ""}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.map((rec: Recommendation) => (
                <RecommendationCard
                  key={rec.jobId}
                  recommendation={rec}
                  onSave={handleSave}
                  isSaved={savedJobIds.has(rec.jobId)}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

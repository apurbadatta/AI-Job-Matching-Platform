"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { fetchJob, fetchRelatedJobs, fetchCompanyReviews, Job } from "@/lib/api";
import { useSession } from "@/lib/auth-client";
import { JobCardSkeleton } from "@/components/JobCard";
import JobCard from "@/components/JobCard";

function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
  return `${Math.floor(seconds / 2592000)}mo ago`;
}

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const sizeClass = size === "lg" ? "w-5 h-5" : "w-4 h-4";
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`${sizeClass} ${
            star <= rating ? "text-yellow-400" : "text-gray-300 dark:text-gray-600"
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

const jobTypeColors: Record<string, string> = {
  "full-time": "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  "part-time": "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  remote: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
};

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const jobId = params.id as string;

  const user = session?.user as any;
  const isLoggedIn = !!session;

  const { data: job, isLoading: jobLoading, error: jobError } = useQuery({
    queryKey: ["job", jobId],
    queryFn: () => fetchJob(jobId),
    enabled: !!jobId,
  });

  const companyId = job?.postedBy?._id;

  const { data: relatedJobs = [], isLoading: relatedLoading } = useQuery({
    queryKey: ["relatedJobs", jobId],
    queryFn: () => fetchRelatedJobs(jobId),
    enabled: !!jobId,
  });

  const { data: reviewData, isLoading: reviewsLoading } = useQuery({
    queryKey: ["companyReviews", companyId],
    queryFn: () => fetchCompanyReviews(companyId!),
    enabled: !!companyId,
  });

  if (jobLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-24" />
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                <div className="flex-1 space-y-3">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                </div>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-7 bg-gray-200 dark:bg-gray-700 rounded-lg w-20" />
                ))}
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (jobError || !job) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Job not found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">The job you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link href="/jobs" className="text-blue-600 hover:underline">&larr; Back to jobs</Link>
        </div>
      </div>
    );
  }

  const company = job.postedBy;
  const companyName = company?.companyName || company?.name || "Company";
  const stats = reviewData?.stats;
  const reviews = reviewData?.reviews || [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 py-8 sm:py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/jobs" className="inline-flex items-center text-blue-100 hover:text-white text-sm mb-6 transition-colors">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Jobs
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-bold text-blue-600 flex-shrink-0">
              {companyLogo ? (
                <img src={companyLogo} alt={companyName} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                companyName.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{job.title}</h1>
              <p className="text-blue-100 text-sm sm:text-base">
                {companyName}
                {job.location && <span className="ml-2">• {job.location}</span>}
              </p>
            </div>
            <div className="flex-shrink-0">
              {isLoggedIn ? (
                <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-colors">
                  Apply Now
                </button>
              ) : (
                <Link
                  href={`/login?redirect=/jobs/${jobId}`}
                  className="px-6 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-colors inline-flex items-center gap-2 group relative"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Login to Apply
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Job Description</h2>
              <div className="text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">
                {job.fullDescription}
              </div>
            </div>

            {/* Key Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Key Information</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: "Salary", value: job.salary, icon: "💰" },
                  { label: "Location", value: job.location, icon: "📍" },
                  { label: "Job Type", value: job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1), icon: "💼" },
                  { label: "Category", value: job.category, icon: "🏷️" },
                  { label: "Deadline", value: new Date(job.deadline).toLocaleDateString(), icon: "📅" },
                  { label: "Posted", value: timeAgo(job.createdAt), icon: "🕐" },
                ].map((item) => (
                  <div key={item.label} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                      <span className="mr-1">{item.icon}</span>
                      {item.label}
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Company Reviews</h2>
                {stats && stats.totalReviews > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgRating}</span>
                    <div>
                      <StarRating rating={Math.round(stats.avgRating)} size="lg" />
                      <p className="text-xs text-gray-500 dark:text-gray-400">{stats.totalReviews} reviews</p>
                    </div>
                  </div>
                )}
              </div>

              {reviewsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/3" />
                          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-full" />
                          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-2/3" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-gray-500 dark:text-gray-400">No reviews yet for this company</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review._id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                          {review.userId?.name?.charAt(0) || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-900 dark:text-white text-sm">
                              {review.userId?.name || "Anonymous"}
                            </span>
                            <span className="px-2 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300">
                              {review.employmentStatus === "current" ? "Current Employee" : "Former Employee"}
                            </span>
                          </div>
                          <StarRating rating={review.rating} />
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm mt-2">{review.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{review.content}</p>
                          {(review.pros || review.cons) && (
                            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {review.pros && (
                                <div className="text-xs">
                                  <span className="font-medium text-green-600 dark:text-green-400">Pros: </span>
                                  <span className="text-gray-600 dark:text-gray-400">{review.pros}</span>
                                </div>
                              )}
                              {review.cons && (
                                <div className="text-xs">
                                  <span className="font-medium text-red-600 dark:text-red-400">Cons: </span>
                                  <span className="text-gray-600 dark:text-gray-400">{review.cons}</span>
                                </div>
                              )}
                            </div>
                          )}
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                            {timeAgo(review.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Job Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">💰</span>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Salary</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{job.salary}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">📍</span>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Location</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{job.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">💼</span>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Type</div>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-lg ${jobTypeColors[job.jobType]}`}>
                      {job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg">📅</span>
                  <div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Deadline</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(job.deadline).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                {isLoggedIn ? (
                  <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors">
                    Apply Now
                  </button>
                ) : (
                  <Link
                    href={`/login?redirect=/jobs/${jobId}`}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Login to Apply
                  </Link>
                )}
                <button className="w-full mt-3 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Save Job
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Jobs */}
        {relatedLoading ? (
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Related Jobs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <JobCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : relatedJobs.length > 0 ? (
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Related Jobs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedJobs.map((relatedJob) => (
                <JobCard key={relatedJob._id} job={relatedJob} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

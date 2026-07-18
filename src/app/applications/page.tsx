"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchMyApplications } from "@/lib/api";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
  reviewed: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  accepted: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  rejected: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
};

export default function ApplicationsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user as any;
  const isLoggedIn = !!session;

  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!isLoggedIn) router.push("/login?redirect=/applications");
    if (user && user.role !== "candidate") router.push("/dashboard");
  }, [user, isLoggedIn, router]);

  const { data, isLoading } = useQuery({
    queryKey: ["myApplications", statusFilter, page],
    queryFn: () => fetchMyApplications({ page, limit: 6, status: statusFilter !== "all" ? statusFilter : undefined }),
    enabled: isLoggedIn && user?.role === "candidate",
  });

  const applications = data?.applications || [];
  const pagination = data?.pagination;

  if (!isLoggedIn || !user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Applications</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Track the status of your job applications</p>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {["all", "pending", "reviewed", "accepted", "rejected"].map((s) => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === s
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
              {s !== "all" && pagination && (
                <span className="ml-1 text-xs opacity-70">
                  ({data?.applications?.filter((a: any) => a.status === s).length || "?"})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!isLoading && applications.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
            <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No applications yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Start applying to jobs to track them here</p>
            <Link href="/jobs" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
              Browse Jobs
            </Link>
          </div>
        )}

        {/* Applications List */}
        {!isLoading && applications.length > 0 && (
          <div className="space-y-4">
            {applications.map((app: any) => {
              const job = app.job;
              const company = job?.postedBy;
              return (
                <div key={app._id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {job?.title || "Unknown Job"}
                        </h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[app.status] || ""}`}>
                          {app.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {company?.companyName || company?.name || "Company"} • {job?.location}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-500">
                        Applied {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                      {app.coverLetter && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 line-clamp-2">
                          Cover letter: {app.coverLetter.substring(0, 100)}...
                        </p>
                      )}
                    </div>
                    <Link
                      href={`/jobs/${job?._id}`}
                      className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors whitespace-nowrap"
                    >
                      View Job
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Previous
            </button>
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-10 h-10 text-sm font-medium rounded-lg ${
                  page === p ? "bg-blue-600 text-white" : "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(pagination.pages, page + 1))}
              disabled={page === pagination.pages}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

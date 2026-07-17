"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchEmployerJobs, deleteJob, EmployerJob } from "@/lib/api";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
  approved: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  rejected: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
};

export default function ManageJobsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user as any;
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("newest");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login?redirect=/jobs/manage");
    } else if (!isPending && user && user.role === "candidate") {
      router.push("/dashboard");
    }
  }, [session, isPending, router, user]);

  const { data, isLoading } = useQuery({
    queryKey: ["employerJobs", page, sort],
    queryFn: () => fetchEmployerJobs(page, sort),
    enabled: !!session && user?.role === "employer",
  });

  const deleteMutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employerJobs"] });
      setDeleteId(null);
    },
  });

  if (isPending || !session || user?.role === "candidate") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const jobs = data?.jobs || [];
  const pagination = data?.pagination;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Jobs</h1>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                {pagination?.total || 0} total jobs posted
              </p>
            </div>
            <Link
              href="/jobs/add"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Post New Job
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Sort */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">Sort by:</span>
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="status">By Status</option>
          </select>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="p-4 animate-pulse">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                    </div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16" />
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center">
            <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No jobs posted yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Start by posting your first job listing</p>
            <Link
              href="/jobs/add"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Post Your First Job
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Job Title</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Applicants</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Posted</th>
                    <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {jobs.map((job) => (
                    <tr key={job._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{job.title}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{job.category} • {job.location}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize ${statusColors[job.status]}`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900 dark:text-white">{job.applicantsCount}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/jobs/${job._id}`}
                            className="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => setDeleteId(job._id)}
                            className="px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {jobs.map((job) => (
                <div key={job._id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{job.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{job.category} • {job.location}</p>
                    </div>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${statusColors[job.status]}`}>
                      {job.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>{job.applicantsCount} applicants</span>
                      <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/jobs/${job._id}`}
                        className="px-3 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => setDeleteId(job._id)}
                        className="px-3 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                  disabled={page === pagination.pages}
                  className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-sm w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Delete Job?</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
              This action cannot be undone. The job listing will be permanently removed.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteId)}
                disabled={deleteMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

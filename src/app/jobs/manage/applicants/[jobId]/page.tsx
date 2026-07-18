"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchJobApplicants, updateApplicationStatus } from "@/lib/api";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
  reviewed: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  accepted: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  rejected: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
};

export default function ApplicantsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const jobId = params.jobId as string;
  const user = session?.user as any;

  useEffect(() => {
    if (!user) router.push("/login");
    if (user && user.role === "candidate") router.push("/dashboard");
    if (user && user.role === "admin") router.push("/admin/jobs");
  }, [user, router]);

  const { data, isLoading } = useQuery({
    queryKey: ["applicants", jobId],
    queryFn: () => fetchJobApplicants(jobId),
    enabled: !!jobId && !!user,
  });

  const statusMutation = useMutation({
    mutationFn: ({ appId, status }: { appId: string; status: string }) =>
      updateApplicationStatus(jobId, appId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applicants", jobId] });
    },
  });

  const applications = data?.applications || [];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/jobs/manage" className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline mb-6">
          ← Back to Manage Jobs
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Applicants</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {applications.length} applicant{applications.length !== 1 ? "s" : ""} for this position
        </p>

        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && applications.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
            <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No applicants yet</h3>
            <p className="text-gray-500 dark:text-gray-400">Candidates will appear here once they apply</p>
          </div>
        )}

        {!isLoading && applications.length > 0 && (
          <div className="space-y-4">
            {applications.map((app: any) => {
              const candidate = app.candidate;
              return (
                <div key={app._id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {candidate?.name || "Unknown"}
                        </h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[app.status]}`}>
                          {app.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{candidate?.email}</p>
                      {candidate?.skills?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {candidate.skills.map((skill: string, i: number) => (
                            <span key={i} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                      {candidate?.experience && (
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 line-clamp-2">{candidate.experience}</p>
                      )}
                      {app.coverLetter && (
                        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Cover Letter:</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">{app.coverLetter}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                      {candidate?.resumeUrl && (
                        <a
                          href={candidate.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-center"
                        >
                          Resume
                        </a>
                      )}
                      <select
                        value={app.status}
                        onChange={(e) => statusMutation.mutate({ appId: app._id, status: e.target.value })}
                        disabled={statusMutation.isPending}
                        className="px-3 py-1.5 text-xs font-medium bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
                    Applied {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

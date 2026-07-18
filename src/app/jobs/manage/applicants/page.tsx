"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/lib/auth-client";
import { fetchEmployerJobs, EmployerJob, updateApplicationStatus } from "@/lib/api";

interface Applicant {
  _id: string;
  name: string;
  email: string;
  skills: string[];
  experience: string;
  resumeUrl: string;
  jobTitle: string;
  jobId: string;
  status: string;
  appliedAt: string;
  coverLetter: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
  reviewed: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  accepted: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  rejected: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
};

export default function AllApplicantsPage() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobFilter, setJobFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["employerJobs", 1, "newest"],
    queryFn: () => fetchEmployerJobs(1, "newest"),
  });

  const jobs = data?.jobs || [];

  const { data: allApplicants, isLoading: applicantsLoading } = useQuery({
    queryKey: ["allApplicants", jobs.map((j: EmployerJob) => j._id)],
    queryFn: async () => {
      const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const results: Applicant[] = [];

      for (const job of jobs) {
        try {
          const res = await fetch(`${API}/api/jobs/${job._id}/applicants`, {
            credentials: "include",
          });
          if (!res.ok) continue;
          const data = await res.json();
          const applicants = data.applications || [];
          for (const app of applicants) {
            const candidate = app.candidate || {};
            results.push({
              _id: app._id,
              name: candidate.name || "Unknown",
              email: candidate.email || "",
              skills: candidate.skills || [],
              experience: candidate.experience || "",
              resumeUrl: candidate.resumeUrl || "",
              jobTitle: job.title,
              jobId: job._id,
              status: app.status || "pending",
              appliedAt: app.createdAt,
              coverLetter: app.coverLetter || "",
            });
          }
        } catch {
          // skip
        }
      }
      return results;
    },
    enabled: jobs.length > 0,
  });

  const statusMutation = useMutation({
    mutationFn: ({ appId, status, jobId }: { appId: string; status: string; jobId: string }) =>
      updateApplicationStatus(jobId, appId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allApplicants"] });
    },
  });

  const applicants = allApplicants || [];

  const filtered = applicants.filter((a) => {
    const matchesSearch =
      !search ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.jobTitle.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    const matchesJob = jobFilter === "all" || a.jobId === jobFilter;
    return matchesSearch && matchesStatus && matchesJob;
  });

  const statusCounts = {
    all: applicants.length,
    pending: applicants.filter((a) => a.status === "pending").length,
    reviewed: applicants.filter((a) => a.status === "reviewed").length,
    accepted: applicants.filter((a) => a.status === "accepted").length,
    rejected: applicants.filter((a) => a.status === "rejected").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Applicants</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          View and manage all candidates who applied to your jobs.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {(["all", "pending", "reviewed", "accepted", "rejected"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`p-3 rounded-xl text-center transition-all ${
              statusFilter === s
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
            }`}
          >
            <div className={`text-2xl font-bold ${statusFilter === s ? "text-white" : "text-gray-900 dark:text-white"}`}>
              {statusCounts[s]}
            </div>
            <div className={`text-xs font-medium mt-0.5 ${statusFilter === s ? "text-blue-100" : "text-gray-500 dark:text-gray-400"}`}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </div>
          </button>
        ))}
      </div>

      {/* Filters Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or job..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Job Filter */}
        <select
          value={jobFilter}
          onChange={(e) => setJobFilter(e.target.value)}
          className="px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Jobs</option>
          {jobs.map((job) => (
            <option key={job._id} value={job._id}>{job.title}</option>
          ))}
        </select>
      </div>

      {/* Applicants List */}
      {isLoading || applicantsLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No applicants found</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {search || jobFilter !== "all" ? "Try adjusting your filters" : "No candidates have applied yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((applicant) => {
            const isExpanded = expandedId === applicant._id;
            return (
              <div
                key={applicant._id}
                className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all hover:shadow-md"
              >
                {/* Main Row */}
                <div
                  className="p-4 sm:p-5 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : applicant._id)}
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-11 h-11 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {applicant.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{applicant.name}</h3>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${statusColors[applicant.status] || statusColors.pending}`}>
                          {applicant.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{applicant.email}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 dark:text-gray-500">
                        <span className="text-gray-600 dark:text-gray-300 font-medium">{applicant.jobTitle}</span>
                        <span>{new Date(applicant.appliedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Expand Icon */}
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${isExpanded ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-4 sm:px-5 pb-5 border-t border-gray-100 dark:border-gray-700 pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Left Column */}
                      <div className="space-y-3">
                        {/* Skills */}
                        {applicant.skills.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Skills</p>
                            <div className="flex flex-wrap gap-1.5">
                              {applicant.skills.map((skill, i) => (
                                <span key={i} className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs rounded-full">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Experience */}
                        {applicant.experience && (
                          <div>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Experience</p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{applicant.experience}</p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-2">
                          {applicant.resumeUrl && (
                            <a
                              href={applicant.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            >
                              View Resume
                            </a>
                          )}
                          <Link
                            href={`/jobs/manage/applicants/${applicant.jobId}`}
                            className="px-3 py-1.5 text-xs font-medium text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"
                          >
                            View Job Details
                          </Link>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-3">
                        {/* Cover Letter */}
                        {applicant.coverLetter ? (
                          <div>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Cover Letter</p>
                            <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-sm text-gray-700 dark:text-gray-300 max-h-40 overflow-y-auto whitespace-pre-wrap">
                              {applicant.coverLetter}
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-center">
                            <p className="text-xs text-gray-400">No cover letter submitted</p>
                          </div>
                        )}

                        {/* Status Update */}
                        <div>
                          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Update Status</p>
                          <div className="flex gap-2">
                            {(["pending", "reviewed", "accepted", "rejected"] as const).map((s) => (
                              <button
                                key={s}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (s !== applicant.status) {
                                    statusMutation.mutate({
                                      appId: applicant._id,
                                      status: s,
                                      jobId: applicant.jobId,
                                    });
                                  }
                                }}
                                disabled={statusMutation.isPending || applicant.status === s}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                                  applicant.status === s
                                    ? `${statusColors[s]} ring-2 ring-offset-1 ring-current/20`
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                                } disabled:opacity-50`}
                              >
                                {s.charAt(0).toUpperCase() + s.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

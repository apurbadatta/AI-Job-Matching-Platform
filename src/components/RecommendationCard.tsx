"use client";

import Link from "next/link";
import { Recommendation } from "@/lib/api";

const scoreColors = (score: number) => {
  if (score >= 90) return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 ring-green-600/20";
  if (score >= 70) return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 ring-blue-600/20";
  if (score >= 50) return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 ring-yellow-600/20";
  return "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 ring-gray-600/20";
};

const jobTypeColors: Record<string, string> = {
  "full-time": "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  "part-time": "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  remote: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
};

export default function RecommendationCard({
  recommendation,
  onSave,
  isSaved,
}: {
  recommendation: Recommendation;
  onSave?: (jobId: string) => void;
  isSaved?: boolean;
}) {
  const { job, score, reason } = recommendation;
  const company = job.postedBy;
  const companyName = company?.companyName || company?.name || "Company";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
      <div className="p-5 flex-1 flex flex-col">
        {/* Header with Score */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              {companyName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
                {job.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{companyName}</p>
            </div>
          </div>
          <div className={`px-2.5 py-1 rounded-full text-xs font-bold ring-1 ring-inset ${scoreColors(score)}`}>
            {score}% Match
          </div>
        </div>

        {/* Reason */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-4">
          <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">{reason}</p>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-2 py-0.5 text-xs font-medium rounded-lg ${jobTypeColors[job.jobType] || ""}`}>
            {job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1)}
          </span>
          <span className="px-2 py-0.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            {job.location}
          </span>
          <span className="px-2 py-0.5 text-xs font-medium rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
            {job.salary}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 flex-1">
          {job.shortDescription}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <Link
            href={`/jobs/${job._id}`}
            className="px-4 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            View Details
          </Link>
          {onSave && (
            <button
              onClick={() => onSave(job._id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                isSaved
                  ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {isSaved ? "Saved" : "Save"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function RecommendationCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-full">
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
            <div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-1 animate-pulse" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse" />
            </div>
          </div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16 animate-pulse" />
        </div>
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 mb-4">
          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-full animate-pulse" />
          <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-2/3 mt-1 animate-pulse" />
        </div>
        <div className="flex gap-2 mb-4">
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse" />
          <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse" />
        </div>
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

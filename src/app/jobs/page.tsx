"use client";

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchJobs, JobsQueryParams } from "@/lib/api";
import JobCard, { JobCardSkeleton } from "@/components/JobCard";

const CATEGORIES = ["Development", "Design", "Marketing", "Sales", "Data Science", "Finance"];
const JOB_TYPES = ["full-time", "part-time", "remote"];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "salary", label: "Salary (High to Low)" },
  { value: "relevance", label: "Relevance" },
];

export default function JobsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [jobType, setJobType] = useState(searchParams.get("jobType") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [page, setPage] = useState(1);

  const queryParams: JobsQueryParams = {
    search: search || undefined,
    category: category || undefined,
    location: location || undefined,
    jobType: jobType || undefined,
    sort,
    page,
    limit: 8,
  };

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["jobs", queryParams],
    queryFn: () => fetchJobs(queryParams),
    placeholderData: (prev) => prev,
  });

  const jobs = data?.jobs || [];
  const pagination = data?.pagination;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  }, []);

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setLocation("");
    setJobType("");
    setSort("newest");
    setPage(1);
  };

  const hasActiveFilters = category || location || jobType || search;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Explore Jobs
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover opportunities that match your skills and ambitions
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search by job title or keyword..."
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Category Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => { setLocation(e.target.value); setPage(1); }}
                placeholder="Filter by location..."
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Job Type Filter */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                Job Type
              </label>
              <select
                value={jobType}
                onChange={(e) => { setJobType(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                {JOB_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                Sort By
              </label>
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <span className="text-xs text-gray-500 dark:text-gray-400">Active filters:</span>
              {search && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-lg flex items-center gap-1">
                  Search: {search}
                  <button onClick={() => { setSearch(""); setPage(1); }} className="hover:text-blue-900 dark:hover:text-blue-200">×</button>
                </span>
              )}
              {category && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-lg flex items-center gap-1">
                  {category}
                  <button onClick={() => { setCategory(""); setPage(1); }} className="hover:text-blue-900 dark:hover:text-blue-200">×</button>
                </span>
              )}
              {location && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-lg flex items-center gap-1">
                  {location}
                  <button onClick={() => { setLocation(""); setPage(1); }} className="hover:text-blue-900 dark:hover:text-blue-200">×</button>
                </span>
              )}
              {jobType && (
                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-lg flex items-center gap-1">
                  {jobType}
                  <button onClick={() => { setJobType(""); setPage(1); }} className="hover:text-blue-900 dark:hover:text-blue-200">×</button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isLoading ? (
              "Loading jobs..."
            ) : (
              <>
                <span className="font-semibold text-gray-900 dark:text-white">{pagination?.total || 0}</span> jobs found
                {pagination && pagination.pages > 1 && (
                  <span> (Page {pagination.page} of {pagination.pages})</span>
                )}
              </>
            )}
          </p>
          {isFetching && !isLoading && (
            <span className="text-xs text-gray-400">Updating...</span>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
            <p className="text-red-600 dark:text-red-400 text-sm">
              Failed to load jobs. Please try again later.
            </p>
          </div>
        )}

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <JobCardSkeleton key={i} />)
            : jobs.map((job) => <JobCard key={job._id} job={job} />)}
        </div>

        {/* Empty State */}
        {!isLoading && jobs.length === 0 && (
          <div className="text-center py-16">
            <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No jobs found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="mt-8">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => { setPage(Math.max(1, page - 1)); scrollToTop(); }}
                disabled={page === 1}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                ← Previous
              </button>
              {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === pagination.pages || Math.abs(p - page) <= 1)
                .map((p, i, arr) => (
                  <span key={p} className="flex items-center">
                    {i > 0 && arr[i - 1] !== p - 1 && (
                      <span className="px-2 text-gray-400">...</span>
                    )}
                    <button
                      onClick={() => { setPage(p); scrollToTop(); }}
                      className={`w-10 h-10 text-sm font-medium rounded-lg transition-colors ${
                        page === p
                          ? "bg-blue-600 text-white shadow-md"
                          : "text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                    >
                      {p}
                    </button>
                  </span>
                ))}
              <button
                onClick={() => { setPage(Math.min(pagination.pages, page + 1)); scrollToTop(); }}
                disabled={page === pagination.pages}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
            <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-3">
              Showing {((pagination.page - 1) * 4) + 1}–{Math.min(pagination.page * 4, pagination.total)} of {pagination.total} jobs
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

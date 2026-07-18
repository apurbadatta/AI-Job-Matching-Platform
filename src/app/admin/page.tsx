"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  fetchAdminStats,
  fetchUsersOverTime,
  fetchJobsOverTime,
  AdminStats,
  UsersOverTimeData,
  JobsOverTimeData,
} from "@/lib/api";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { useTheme } from "@/components/ThemeProvider";

function StatCard({ label, value, icon, color, href }: { label: string; value: number | string; icon: React.ReactNode; color: string; href: string }) {
  return (
    <Link href={href} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 group">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
        </div>
      </div>
    </Link>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
      {message}
    </div>
  );
}

export default function AdminOverviewPage() {
  const { theme } = useTheme();
  const gridColor = theme === "dark" ? "#374151" : "#E5E7EB";
  const tickColor = theme === "dark" ? "#9CA3AF" : "#6B7280";

  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ["adminStats"],
    queryFn: fetchAdminStats,
  });

  const { data: usersData = [] } = useQuery<UsersOverTimeData[]>({
    queryKey: ["usersOverTime"],
    queryFn: fetchUsersOverTime,
  });

  const { data: jobsData = [] } = useQuery<JobsOverTimeData[]>({
    queryKey: ["jobsOverTime"],
    queryFn: fetchJobsOverTime,
  });

  const formatMonth = (month: string) => {
    const [year, m] = month.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[parseInt(m) - 1]} ${year.slice(2)}`;
  };

  const usersChartData = usersData.map((d) => ({ ...d, label: formatMonth(d.month) }));
  const jobsChartData = jobsData.map((d) => ({ ...d, label: formatMonth(d.month) }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Platform overview and quick actions</p>
        </div>
      </div>

      {/* Stats Cards */}
      {statsLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : stats ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Users"
            value={stats.totalUsers}
            href="/admin/users"
            color="bg-blue-100 dark:bg-blue-900/30"
            icon={<svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
          />
          <StatCard
            label="Total Jobs"
            value={stats.totalJobs}
            href="/admin/jobs"
            color="bg-purple-100 dark:bg-purple-900/30"
            icon={<svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>}
          />
          <StatCard
            label="Pending Jobs"
            value={stats.pendingJobs}
            href="/admin/jobs?status=pending"
            color="bg-yellow-100 dark:bg-yellow-900/30"
            icon={<svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <StatCard
            label="Active Subscriptions"
            value={stats.activeSubscriptions}
            href="/admin/analytics"
            color="bg-green-100 dark:bg-green-900/30"
            icon={<svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>}
          />
        </div>
      ) : null}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/analytics" className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">View Analytics</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Charts, trends & reports</p>
            </div>
          </div>
        </Link>

        <Link href="/admin/users" className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Manage Users</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">View, suspend & verify accounts</p>
            </div>
          </div>
        </Link>

        <Link href="/admin/jobs" className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-200 group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Manage Jobs</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Approve, reject & feature listings</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Signups (12 Months)</h3>
          <div className="h-72">
            {usersChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={usersChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.5} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: tickColor }} />
                  <YAxis tick={{ fontSize: 11, fill: tickColor }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
                      border: `1px solid ${theme === "dark" ? "#374151" : "#E5E7EB"}`,
                      borderRadius: "8px",
                      color: theme === "dark" ? "#F3F4F6" : "#111827",
                    }}
                  />
                  <Line type="monotone" dataKey="candidates" stroke="#3B82F6" strokeWidth={2} name="Candidates" dot={{ fill: "#3B82F6", r: 3 }} />
                  <Line type="monotone" dataKey="employers" stroke="#8B5CF6" strokeWidth={2} name="Employers" dot={{ fill: "#8B5CF6", r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No user signup data yet" />
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Jobs Posted (12 Months)</h3>
          <div className="h-72">
            {jobsChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={jobsChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} opacity={0.5} />
                  <XAxis dataKey="label" tick={{ fontSize: 11, fill: tickColor }} />
                  <YAxis tick={{ fontSize: 11, fill: tickColor }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === "dark" ? "#1F2937" : "#FFFFFF",
                      border: `1px solid ${theme === "dark" ? "#374151" : "#E5E7EB"}`,
                      borderRadius: "8px",
                      color: theme === "dark" ? "#F3F4F6" : "#111827",
                    }}
                  />
                  <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Jobs Posted" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyState message="No job posting data yet" />
            )}
          </div>
        </div>
      </div>

      {/* Summary */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">User Breakdown</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Candidates</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">{stats.totalCandidates}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Employers</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">{stats.totalEmployers}</span>
              </div>
              <div className="pt-2 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-white">Total</span>
                <span className="font-bold text-gray-900 dark:text-white">{stats.totalUsers}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Job Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Approved</span>
                </div>
                <span className="font-semibold text-green-600 dark:text-green-400">{stats.approvedJobs}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Pending</span>
                </div>
                <span className="font-semibold text-yellow-600 dark:text-yellow-400">{stats.pendingJobs}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Rejected</span>
                </div>
                <span className="font-semibold text-red-600 dark:text-red-400">{stats.rejectedJobs}</span>
              </div>
              <div className="pt-2 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-white">Approval Rate</span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {stats.totalJobs > 0 ? Math.round((stats.approvedJobs / stats.totalJobs) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Platform Health</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Job Fill Rate</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {stats.totalJobs > 0 ? Math.round((stats.approvedJobs / stats.totalJobs) * 100) : 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Subscription Rate</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {stats.totalEmployers > 0 ? Math.round((stats.activeSubscriptions / stats.totalEmployers) * 100) : 0}%
                </span>
              </div>
              <div className="pt-2 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-white">Active Subscriptions</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{stats.activeSubscriptions}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

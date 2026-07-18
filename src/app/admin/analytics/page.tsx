"use client";

import { useQuery } from "@tanstack/react-query";
import {
  fetchAdminStats,
  fetchUsersOverTime,
  fetchJobsOverTime,
  fetchCategoriesAnalytics,
  fetchRevenueAnalytics,
  AdminStats,
  UsersOverTimeData,
  JobsOverTimeData,
  CategoryData,
  RevenueData,
} from "@/lib/api";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

function StatCard({ label, value, icon, color }: { label: string; value: number | string; icon: string; color: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
        </div>
      </div>
    </div>
  );
}

export default function AdminAnalyticsPage() {
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

  const { data: categoriesData = [] } = useQuery<CategoryData[]>({
    queryKey: ["categoriesAnalytics"],
    queryFn: fetchCategoriesAnalytics,
  });

  const { data: revenueData = [] } = useQuery<RevenueData[]>({
    queryKey: ["revenueAnalytics"],
    queryFn: fetchRevenueAnalytics,
  });

  const formatMonth = (month: string) => {
    const [year, m] = month.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${months[parseInt(m) - 1]} ${year.slice(2)}`;
  };

  const usersChartData = usersData.map((d) => ({
    ...d,
    label: formatMonth(d.month),
  }));

  const jobsChartData = jobsData.map((d) => ({
    ...d,
    label: formatMonth(d.month),
  }));

  const totalRevenue = revenueData.reduce((sum, r) => sum + r.revenue, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Platform insights and metrics</p>
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
          <StatCard label="Total Users" value={stats.totalUsers} icon="👥" color="bg-blue-100 dark:bg-blue-900/30" />
          <StatCard label="Total Jobs" value={stats.totalJobs} icon="💼" color="bg-purple-100 dark:bg-purple-900/30" />
          <StatCard label="Pending Jobs" value={stats.pendingJobs} icon="⏳" color="bg-yellow-100 dark:bg-yellow-900/30" />
          <StatCard label="Active Subscriptions" value={stats.activeSubscriptions} icon="💎" color="bg-green-100 dark:bg-green-900/30" />
        </div>
      ) : null}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users Over Time - Line Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Users Over Time</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={usersChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#9CA3AF" }} />
                <YAxis tick={{ fontSize: 12, fill: "#9CA3AF" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#F3F4F6",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="candidates" stroke="#3B82F6" strokeWidth={2} name="Candidates" dot={false} />
                <Line type="monotone" dataKey="employers" stroke="#8B5CF6" strokeWidth={2} name="Employers" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Jobs Per Month - Bar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Jobs Posted Per Month</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={jobsChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#9CA3AF" }} />
                <YAxis tick={{ fontSize: 12, fill: "#9CA3AF" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#F3F4F6",
                  }}
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Jobs Posted" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories - Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Job Categories</h3>
          <div className="h-72">
            {categoriesData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
                No data available
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoriesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {categoriesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#F3F4F6",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Revenue - Bar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subscription Revenue</h3>
          <div className="h-72">
            {revenueData.length === 0 || totalRevenue === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
                No revenue data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis dataKey="plan" tick={{ fontSize: 12, fill: "#9CA3AF" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#9CA3AF" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      color: "#F3F4F6",
                    }}
                    labelFormatter={(label) => `${label}`}
                  />
                  <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} name="Revenue" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          {totalRevenue > 0 && (
            <div className="mt-4 text-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Total Monthly Revenue: </span>
              <span className="text-lg font-bold text-green-600 dark:text-green-400">${totalRevenue.toFixed(2)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">User Breakdown</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Candidates</span>
                <span className="font-semibold text-gray-900 dark:text-white">{stats.totalCandidates}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Employers</span>
                <span className="font-semibold text-gray-900 dark:text-white">{stats.totalEmployers}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Job Status</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Approved</span>
                <span className="font-semibold text-green-600 dark:text-green-400">{stats.approvedJobs}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Pending</span>
                <span className="font-semibold text-yellow-600 dark:text-yellow-400">{stats.pendingJobs}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Rejected</span>
                <span className="font-semibold text-red-600 dark:text-red-400">{stats.rejectedJobs}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Platform Health</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Approval Rate</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {stats.totalJobs > 0 ? Math.round((stats.approvedJobs / stats.totalJobs) * 100) : 0}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Conversion Rate</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {stats.totalEmployers > 0 ? Math.round((stats.activeSubscriptions / stats.totalEmployers) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

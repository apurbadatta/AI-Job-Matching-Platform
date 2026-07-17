"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    } else if (!isPending) {
      setLoading(false);
    }
  }, [session, isPending, router]);

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/login");
        },
      },
    });
  };

  if (loading || isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const user = session.user as any;
  const role = user.role || "candidate";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                JobPilot AI
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {user.email}
              </span>
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 capitalize">
                {role}
              </span>
              <button
                onClick={handleSignOut}
                className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Welcome, {user.name || "User"}!
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Role
                </h3>
                <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white capitalize">
                  {role}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Email
                </h3>
                <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                  {user.email}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Account Status
                </h3>
                <p className="mt-1 text-lg font-semibold text-green-600 dark:text-green-400">
                  Active
                </p>
              </div>
            </div>

            {role === "candidate" && (
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                  Candidate Dashboard
                </h3>
                <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
                  Browse jobs, track applications, and get AI-powered recommendations.
                </p>
              </div>
            )}

            {role === "employer" && (
              <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h3 className="text-sm font-medium text-purple-800 dark:text-purple-300">
                  Employer Dashboard
                </h3>
                <p className="mt-2 text-sm text-purple-600 dark:text-purple-400">
                  Post jobs, manage applications, and find the best candidates.
                </p>
              </div>
            )}

            {role === "admin" && (
              <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                  Admin Panel
                </h3>
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  Manage users, moderate jobs, and configure platform settings.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

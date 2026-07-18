"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile } from "@/lib/api";

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = session?.user as any;
  const isLoggedIn = !!session;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyDescription, setCompanyDescription] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login?redirect=/profile");
      return;
    }
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setSkills(user.skills?.join(", ") || "");
      setExperience(user.experience || "");
      setResumeUrl(user.resumeUrl || "");
      setCompanyName(user.companyName || "");
      setCompanyDescription(user.companyDescription || "");
    }
  }, [user, isLoggedIn, router]);

  const mutation = useMutation({
    mutationFn: () =>
      updateProfile({
        name,
        skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
        experience,
        resumeUrl,
        companyName,
        companyDescription,
      }),
    onSuccess: () => {
      setSuccess("Profile updated successfully!");
      setError("");
      queryClient.invalidateQueries({ queryKey: ["session"] });
      setTimeout(() => setSuccess(""), 3000);
    },
    onError: () => {
      setError("Failed to update profile. Please try again.");
      setSuccess("");
    },
  });

  if (!isLoggedIn || !user) return null;

  const isCandidate = user.role === "candidate";
  const isEmployer = user.role === "employer";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Profile</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Manage your account settings and preferences.</p>

        {success && (
          <div className="mb-6 px-4 py-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-400 text-sm">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-6 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 space-y-6">
          {/* Role Badge */}
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              isEmployer ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
              : user.role === "admin" ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
              : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
            }`}>
              {user.role === "admin" ? "Admin" : isEmployer ? "Employer" : "Candidate"}
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">{user.email}</span>
          </div>

          {/* Basic Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Candidate Fields */}
          {isCandidate && (
            <>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Skills</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Comma-separated (e.g. React, Node.js, TypeScript)</p>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="React, Node.js, TypeScript, MongoDB..."
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {skills && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {skills.split(",").map((s) => s.trim()).filter(Boolean).map((skill, i) => (
                      <span key={i} className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Experience</h2>
                <textarea
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  rows={4}
                  placeholder="Describe your work experience, education, and achievements..."
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resume URL</h2>
                <input
                  type="url"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  placeholder="https://drive.google.com/your-resume.pdf"
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {/* Employer Fields */}
          {isEmployer && (
            <>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Company Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Description</label>
                    <textarea
                      value={companyDescription}
                      onChange={(e) => setCompanyDescription(e.target.value)}
                      rows={4}
                      placeholder="Tell candidates about your company..."
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {mutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

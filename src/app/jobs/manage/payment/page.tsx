"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/lib/auth-client";
import {
  fetchSubscriptionStatus,
  cancelSubscription,
  createPortalSession,
  fetchInvoices,
  SubscriptionStatus,
  Invoice,
} from "@/lib/api";

const planColors: Record<string, string> = {
  free: "from-gray-400 to-gray-500",
  pro: "from-blue-500 to-indigo-600",
  business: "from-purple-500 to-pink-600",
};

const planBadge: Record<string, string> = {
  free: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
  pro: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  business: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
};

const statusColors: Record<string, string> = {
  active: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  inactive: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400",
  past_due: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
  canceled: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  trialing: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
};

const PLAN_FEATURES: Record<string, string[]> = {
  free: ["3 job posts", "Basic listing", "Standard support"],
  pro: [
    "Unlimited job posts",
    "AI job description generator",
    "Featured badge",
    "Priority in search results",
    "Priority support",
  ],
  business: [
    "Everything in Pro",
    "Analytics dashboard",
    "Advanced branding",
    "Multiple recruiter seats",
    "Priority support",
    "Custom integrations",
  ],
};

const PLAN_PRICES: Record<string, string> = {
  free: "$0",
  pro: "$9.99/mo",
  business: "$29.99/mo",
};

export default function EmployerPaymentPage() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const queryClient = useQueryClient();
  const [canceling, setCanceling] = useState(false);

  const { data: subscription, isLoading } = useQuery({
    queryKey: ["subscriptionStatus"],
    queryFn: fetchSubscriptionStatus,
  });

  const cancelMutation = useMutation({
    mutationFn: cancelSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptionStatus"] });
      setCanceling(false);
    },
  });

  const portalMutation = useMutation({
    mutationFn: createPortalSession,
    onSuccess: (data) => {
      window.location.href = data.url;
    },
  });

  const { data: invoicesData, isLoading: invoicesLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: fetchInvoices,
  });

  const sub = subscription as SubscriptionStatus | undefined;
  const currentPlan = sub?.plan || "free";
  const currentStatus = sub?.status || "inactive";
  const periodEnd = sub?.currentPeriodEnd;
  const features = sub?.features || PLAN_FEATURES.free;
  const jobPostLimit = sub?.jobPostLimit ?? 3;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Subscription & Payment</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your subscription plan and billing.
        </p>
      </div>

      {/* Current Plan Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Plan Banner */}
        <div className={`bg-gradient-to-r ${planColors[currentPlan]} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm font-medium">Current Plan</p>
              <h2 className="text-3xl font-bold text-white mt-1">
                {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
              </h2>
              <p className="text-white/70 text-sm mt-2">
                {PLAN_PRICES[currentPlan]} {currentPlan !== "free" ? "billed monthly" : ""}
              </p>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1.5 text-xs font-semibold rounded-full ${statusColors[currentStatus]}`}>
                {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Plan Details */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Plan Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Plan Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Plan</span>
                  <span className="font-medium text-gray-900 dark:text-white">{currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Status</span>
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[currentStatus]}`}>
                    {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Price</span>
                  <span className="font-medium text-gray-900 dark:text-white">{PLAN_PRICES[currentPlan]}</span>
                </div>
                {jobPostLimit === -1 ? (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Job Posts</span>
                    <span className="font-medium text-green-600 dark:text-green-400">Unlimited</span>
                  </div>
                ) : (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Job Post Limit</span>
                    <span className="font-medium text-gray-900 dark:text-white">{jobPostLimit} posts</span>
                  </div>
                )}
              </div>
            </div>

            {/* Billing Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Billing</h3>
              <div className="space-y-3">
                {periodEnd ? (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Next billing date</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {new Date(periodEnd).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Days remaining</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {Math.max(0, Math.ceil((new Date(periodEnd).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {currentPlan === "free" ? "No billing info on Free plan" : "No billing period set"}
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Payment method</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {sub?.stripeCustomerId ? "Stripe" : "None"}
                  </span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Features</h3>
              <ul className="space-y-2">
                {features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Upgrade Card */}
        {currentPlan === "free" && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Upgrade Plan</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Unlock more features and unlimited job posts.
            </p>
            <a
              href="/pricing"
              className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              View Plans & Upgrade
            </a>
          </div>
        )}

        {/* Manage Subscription */}
        {currentPlan !== "free" && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Manage Subscription</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Update payment method, view invoices, or change your plan.
            </p>
            <button
              onClick={() => portalMutation.mutate()}
              disabled={portalMutation.isPending}
              className="inline-flex items-center px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {portalMutation.isPending ? (
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
              ) : (
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
              Open Billing Portal
            </button>
          </div>
        )}

        {/* Cancel Subscription */}
        {currentPlan !== "free" && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Cancel Subscription</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Your subscription will remain active until the end of the billing period.
            </p>
            {canceling ? (
              <div className="space-y-3">
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                  Are you sure? This will cancel your subscription at period end.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => cancelMutation.mutate()}
                    disabled={cancelMutation.isPending}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {cancelMutation.isPending ? "Canceling..." : "Yes, Cancel"}
                  </button>
                  <button
                    onClick={() => setCanceling(false)}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Keep Plan
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setCanceling(true)}
                className="inline-flex items-center px-4 py-2.5 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel Subscription
              </button>
            )}
          </div>
        )}
      </div>

      {/* All Plans Comparison */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Compare Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(["free", "pro", "business"] as const).map((plan) => (
            <div
              key={plan}
              className={`rounded-xl border-2 p-5 transition-all ${
                currentPlan === plan
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/10"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <div className="text-center mb-4">
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">{plan.charAt(0).toUpperCase() + plan.slice(1)}</h4>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{PLAN_PRICES[plan]}</p>
                {currentPlan === plan && (
                  <span className="inline-block mt-2 px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                    Current Plan
                  </span>
                )}
              </div>
              <ul className="space-y-2">
                {PLAN_FEATURES[plan].map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <svg className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">{f}</span>
                  </li>
                ))}
              </ul>
              {currentPlan !== plan && plan !== "free" && (
                <a
                  href="/pricing"
                  className="mt-4 block text-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Upgrade
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Invoices */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Payment History & Invoices</h3>
          {invoicesData?.invoices && invoicesData.invoices.length > 0 && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {invoicesData.invoices.length} invoice{invoicesData.invoices.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {invoicesLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
            <p className="text-gray-500 dark:text-gray-400 mt-4">Loading invoices...</p>
          </div>
        ) : !invoicesData?.invoices || invoicesData.invoices.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
            </svg>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No invoices yet</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Invoices will appear here after your first payment.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Invoice</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {invoicesData!.invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {inv.number || inv.id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(inv.date * 1000).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 dark:text-gray-400">{inv.description}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        ${(inv.amount / 100).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        inv.status === "paid"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          : inv.status === "open"
                          ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                          : inv.status === "void"
                          ? "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                          : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                      }`}>
                        {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {inv.invoiceUrl && (
                          <a
                            href={inv.invoiceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          >
                            View
                          </a>
                        )}
                        {inv.pdfUrl && (
                          <a
                            href={inv.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            PDF
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
          <p className="text-gray-500 dark:text-gray-400 mt-4">Loading subscription info...</p>
        </div>
      )}
    </div>
  );
}

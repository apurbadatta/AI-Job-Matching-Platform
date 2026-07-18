"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import {
  fetchSubscriptionStatus,
  createCheckoutSession,
  SubscriptionStatus,
} from "@/lib/api";
import Link from "next/link";

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "",
    description: "Perfect for getting started",
    features: [
      { text: "3 job posts", included: true },
      { text: "Basic listing", included: true },
      { text: "Standard support", included: true },
      { text: "AI job description generator", included: false },
      { text: "Featured badge", included: false },
      { text: "Analytics dashboard", included: false },
      { text: "Priority support", included: false },
      { text: "Multiple recruiter seats", included: false },
    ],
    cta: "Current Plan",
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 9.99,
    period: "/month",
    description: "Best for growing teams",
    features: [
      { text: "Unlimited job posts", included: true },
      { text: "Basic listing", included: true },
      { text: "AI job description generator", included: true },
      { text: "Featured badge", included: true },
      { text: "Priority in search results", included: true },
      { text: "Priority support", included: true },
      { text: "Analytics dashboard", included: false },
      { text: "Multiple recruiter seats", included: false },
    ],
    cta: "Upgrade to Pro",
    popular: true,
  },
  {
    id: "business",
    name: "Business",
    price: 29.99,
    period: "/month",
    description: "For established companies",
    features: [
      { text: "Unlimited job posts", included: true },
      { text: "Basic listing", included: true },
      { text: "AI job description generator", included: true },
      { text: "Featured badge", included: true },
      { text: "Priority in search results", included: true },
      { text: "Priority support", included: true },
      { text: "Analytics dashboard", included: true },
      { text: "Multiple recruiter seats", included: true },
    ],
    cta: "Upgrade to Business",
    popular: false,
  },
];

export default function PricingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const user = session?.user as any;
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCanceled, setShowCanceled] = useState(false);

  const { data: subscription, isLoading: subLoading } = useQuery<SubscriptionStatus>({
    queryKey: ["subscription"],
    queryFn: fetchSubscriptionStatus,
    enabled: !!session,
  });

  useEffect(() => {
    const success = searchParams.get("success");
    const canceled = searchParams.get("canceled");
    let t1: ReturnType<typeof setTimeout>, t2: ReturnType<typeof setTimeout>;
    if (success === "true") {
      setShowSuccess(true);
      t1 = setTimeout(() => setShowSuccess(false), 5000);
    }
    if (canceled === "true") {
      setShowCanceled(true);
      t2 = setTimeout(() => setShowCanceled(false), 5000);
    }
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [searchParams]);

  const handleUpgrade = async (plan: "pro" | "business") => {
    if (!session) {
      router.push("/login?redirect=/pricing");
      return;
    }

    if (user?.role === "candidate") {
      return;
    }

    setLoadingPlan(plan);
    try {
      const { url } = await createCheckoutSession(plan);
      if (url) {
        window.location.href = url;
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      alert(error.response?.data?.error || "Failed to start checkout. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const currentPlan = subscription?.plan || "free";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose the plan that fits your hiring needs. Upgrade or downgrade anytime.
          </p>
        </div>

        {/* Success / Canceled Toasts */}
        {showSuccess && (
          <div className="mb-8 max-w-md mx-auto bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-xl text-sm text-center">
            Payment successful! Your plan has been upgraded. 🎉
          </div>
        )}
        {showCanceled && (
          <div className="mb-8 max-w-md mx-auto bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 px-4 py-3 rounded-xl text-sm text-center">
            Payment was canceled. You can try again anytime.
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan) => {
            const isCurrentPlan = currentPlan === plan.id;
            const isPaidPlan = plan.id === "pro" || plan.id === "business";
            const canUpgrade = session && user?.role !== "candidate" && !isCurrentPlan;
            const isDisabled = !canUpgrade && isPaidPlan;

            return (
              <div
                key={plan.id}
                className={`relative bg-white dark:bg-gray-800 rounded-2xl border-2 p-8 transition-all ${
                  plan.popular
                    ? "border-blue-500 dark:border-blue-400 shadow-xl shadow-blue-500/10"
                    : "border-gray-200 dark:border-gray-700"
                } ${isCurrentPlan ? "ring-2 ring-green-500 dark:ring-green-400" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                {isCurrentPlan && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-green-500 text-white text-xs font-bold px-4 py-1.5 rounded-full">
                      CURRENT PLAN
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline justify-center gap-1">
                    {plan.price === 0 ? (
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">Free</span>
                    ) : (
                      <>
                        <span className="text-4xl font-bold text-gray-900 dark:text-white">
                          ${plan.price}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">{plan.period}</span>
                      </>
                    )}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      {feature.included ? (
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-300 dark:text-gray-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                      <span
                        className={`text-sm ${
                          feature.included
                            ? "text-gray-700 dark:text-gray-300"
                            : "text-gray-400 dark:text-gray-500"
                        }`}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleUpgrade(plan.id as "pro" | "business")}
                  disabled={isDisabled || loadingPlan === plan.id}
                  className={`w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all ${
                    isCurrentPlan
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 cursor-default"
                      : plan.popular
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 disabled:opacity-50"
                      : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 disabled:opacity-50"
                  }`}
                >
                  {loadingPlan === plan.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : isCurrentPlan ? (
                    "Current Plan"
                  ) : !session ? (
                    "Get Started"
                  ) : user?.role === "candidate" ? (
                    "Employers Only"
                  ) : (
                    plan.cta
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "Can I switch plans at any time?",
                a: "Yes! You can upgrade or downgrade at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the change takes effect at the end of your billing period.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards (Visa, MasterCard, American Express) through our secure payment processor Stripe.",
              },
              {
                q: "Is there a free trial for paid plans?",
                a: "No free trial is needed - our Free plan lets you test the platform with up to 3 job posts. Upgrade when you're ready for more.",
              },
              {
                q: "What happens when I reach the free plan limit?",
                a: "You'll see a prompt to upgrade when you try to post your 4th job. Your existing jobs remain active and visible.",
              },
            ].map((faq, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Need a custom plan for your enterprise?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Contact Sales
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

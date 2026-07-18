import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

export interface Job {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  location: string;
  salary: string;
  jobType: "full-time" | "part-time" | "remote";
  postedBy: {
    _id: string;
    name: string;
    companyName?: string;
    companyLogo?: string;
    companyDescription?: string;
  };
  deadline: string;
  isFeatured: boolean;
  status: "pending" | "approved" | "rejected";
  companyLogo?: string;
  createdAt: string;
}

export interface EmployerJob extends Job {
  applicantsCount: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface JobsResponse {
  jobs: Job[];
  pagination: Pagination;
}

export interface EmployerJobsResponse {
  jobs: EmployerJob[];
  pagination: Pagination;
}

export interface JobsQueryParams {
  search?: string;
  category?: string;
  location?: string;
  jobType?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface Review {
  _id: string;
  jobId: { _id: string; title: string };
  userId: { _id: string; name: string; profileImage?: string };
  companyId: string;
  rating: number;
  title: string;
  content: string;
  pros: string;
  cons: string;
  employmentStatus: "current" | "former";
  createdAt: string;
}

export interface ReviewStats {
  avgRating: number;
  totalReviews: number;
  ratingDistribution: number[];
}

export interface ReviewsResponse {
  reviews: Review[];
  pagination: Pagination;
  stats: ReviewStats;
}

export interface CreateJobData {
  title: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  location: string;
  salary: string;
  jobType: string;
  deadline: string;
  companyLogo?: string;
}

export interface Recommendation {
  jobId: string;
  score: number;
  reason: string;
  job: Job;
}

export interface RecommendationsResponse {
  recommendations: Recommendation[];
  totalAnalyzed: number;
}

// Public endpoints
export const fetchJobs = async (params: JobsQueryParams): Promise<JobsResponse> => {
  const searchParams = new URLSearchParams();
  if (params.search) searchParams.set("search", params.search);
  if (params.category) searchParams.set("category", params.category);
  if (params.location) searchParams.set("location", params.location);
  if (params.jobType) searchParams.set("jobType", params.jobType);
  if (params.sort) searchParams.set("sort", params.sort);
  if (params.page) searchParams.set("page", params.page.toString());
  if (params.limit) searchParams.set("limit", params.limit.toString());

  const { data } = await api.get<JobsResponse>(`/jobs?${searchParams.toString()}`);
  return data;
};

export const fetchJob = async (id: string): Promise<Job> => {
  const { data } = await api.get<Job>(`/jobs/${id}`);
  return data;
};

export const fetchRelatedJobs = async (id: string): Promise<Job[]> => {
  const { data } = await api.get<Job[]>(`/jobs/${id}/related`);
  return data;
};

export const fetchCompanyReviews = async (
  companyId: string,
  page = 1,
  limit = 10
): Promise<ReviewsResponse> => {
  const { data } = await api.get<ReviewsResponse>(
    `/reviews/company/${companyId}?page=${page}&limit=${limit}`
  );
  return data;
};

// Employer endpoints
export const fetchEmployerJobs = async (page = 1, sort = "newest"): Promise<EmployerJobsResponse> => {
  const { data } = await api.get<EmployerJobsResponse>(
    `/jobs/employer?page=${page}&sort=${sort}`
  );
  return data;
};

export const createJob = async (jobData: CreateJobData): Promise<Job> => {
  const { data } = await api.post<Job>("/jobs", jobData);
  return data;
};

export const deleteJob = async (id: string): Promise<void> => {
  await api.delete(`/jobs/${id}`);
};

// AI endpoints
export const generateJobDescription = async (
  bulletPoints: string,
  jobTitle: string,
  category: string,
  companyName: string
): Promise<string> => {
  const { data } = await api.post<{ description: string }>("/ai/generate-description", {
    bulletPoints,
    jobTitle,
    category,
    companyName,
  });
  return data.description;
};

export const generateRecommendations = async (
  preferredCategory?: string,
  preferredLocation?: string
): Promise<RecommendationsResponse> => {
  const { data } = await api.post<RecommendationsResponse>("/ai/recommendations", {
    preferredCategory,
    preferredLocation,
  });
  return data;
};

export const trackInteraction = async (jobId: string, type: string): Promise<void> => {
  await api.post("/ai/interactions", { jobId, type });
};

export const fetchSavedJobs = async (): Promise<Job[]> => {
  const { data } = await api.get<{ savedJobs: Job[] }>("/ai/saved-jobs");
  return data.savedJobs;
};

// Cover Letter endpoints
export interface CoverLetterData {
  coverLetter: string;
  id: string;
}

export interface CoverLetterHistory {
  _id: string;
  jobId: { _id: string; title: string };
  tone: "formal" | "friendly" | "confident";
  length: "short" | "medium" | "long";
  content: string;
  jobTitle: string;
  companyName: string;
  createdAt: string;
}

export interface CoverLettersResponse {
  coverLetters: CoverLetterHistory[];
  pagination: Pagination;
}

export const generateCoverLetter = async (
  jobId: string,
  tone: string,
  length: string
): Promise<CoverLetterData> => {
  const { data } = await api.post<CoverLetterData>("/ai/cover-letter", {
    jobId,
    tone,
    length,
  });
  return data;
};

export const fetchCoverLetterHistory = async (
  page = 1,
  limit = 10
): Promise<CoverLettersResponse> => {
  const { data } = await api.get<CoverLettersResponse>(
    `/ai/cover-letters?page=${page}&limit=${limit}`
  );
  return data;
};

// Payment / Subscription endpoints
export interface SubscriptionStatus {
  plan: "free" | "pro" | "business";
  status: string;
  stripeSubscriptionId: string | null;
  stripeCustomerId: string | null;
  currentPeriodEnd: string | null;
  features: string[];
  jobPostLimit: number;
}

export interface CheckoutSessionResponse {
  url: string;
  sessionId: string;
}

export interface PortalSessionResponse {
  url: string;
}

export const fetchSubscriptionStatus = async (): Promise<SubscriptionStatus> => {
  const { data } = await api.get<SubscriptionStatus>("/payment/subscription-status");
  return data;
};

export const createCheckoutSession = async (
  plan: "pro" | "business"
): Promise<CheckoutSessionResponse> => {
  const { data } = await api.post<CheckoutSessionResponse>("/payment/create-checkout-session", {
    plan,
  });
  return data;
};

export const cancelSubscription = async (): Promise<{ message: string; currentPeriodEnd: string | null }> => {
  const { data } = await api.post("/payment/cancel-subscription");
  return data;
};

export const createPortalSession = async (): Promise<PortalSessionResponse> => {
  const { data } = await api.post<PortalSessionResponse>("/payment/create-portal-session");
  return data;
};

// ==================== ADMIN endpoints ====================

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: "candidate" | "employer" | "admin";
  status: string;
  createdAt: string;
  isVerified?: boolean;
}

export interface AdminUsersResponse {
  users: AdminUser[];
  pagination: Pagination;
}

export interface AdminJob extends Job {
  postedBy: {
    _id: string;
    name: string;
    companyName?: string;
  };
}

export interface AdminJobsResponse {
  jobs: AdminJob[];
  pagination: Pagination;
}

export interface AdminStats {
  totalUsers: number;
  totalCandidates: number;
  totalEmployers: number;
  totalJobs: number;
  pendingJobs: number;
  approvedJobs: number;
  rejectedJobs: number;
  activeSubscriptions: number;
}

export interface UsersOverTimeData {
  month: string;
  candidates: number;
  employers: number;
}

export interface JobsOverTimeData {
  month: string;
  count: number;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export interface RevenueData {
  plan: string;
  revenue: number;
  count: number;
}

// Admin - Users
export const fetchAdminUsers = async (
  page = 1,
  search = "",
  role = ""
): Promise<AdminUsersResponse> => {
  const params = new URLSearchParams({ page: page.toString() });
  if (search) params.set("search", search);
  if (role) params.set("role", role);
  const { data } = await api.get<AdminUsersResponse>(`/admin/users?${params.toString()}`);
  return data;
};

export const suspendUser = async (id: string): Promise<void> => {
  await api.post(`/admin/users/${id}/suspend`);
};

export const activateUser = async (id: string): Promise<void> => {
  await api.post(`/admin/users/${id}/activate`);
};

export const toggleUserVerification = async (id: string): Promise<{ isVerified: boolean }> => {
  const { data } = await api.post<{ isVerified: boolean }>(`/admin/users/${id}/verify`);
  return data;
};

// Admin - Jobs
export const fetchAdminJobs = async (
  page = 1,
  status = "",
  search = ""
): Promise<AdminJobsResponse> => {
  const params = new URLSearchParams({ page: page.toString() });
  if (status) params.set("status", status);
  if (search) params.set("search", search);
  const { data } = await api.get<AdminJobsResponse>(`/admin/jobs?${params.toString()}`);
  return data;
};

export const approveJob = async (id: string): Promise<void> => {
  await api.post(`/admin/jobs/${id}/approve`);
};

export const rejectJob = async (id: string): Promise<void> => {
  await api.post(`/admin/jobs/${id}/reject`);
};

export const adminDeleteJob = async (id: string): Promise<void> => {
  await api.delete(`/admin/jobs/${id}`);
};

export const toggleJobFeatured = async (id: string): Promise<{ isFeatured: boolean }> => {
  const { data } = await api.post<{ isFeatured: boolean }>(`/admin/jobs/${id}/feature`);
  return data;
};

// Admin - Analytics
export const fetchAdminStats = async (): Promise<AdminStats> => {
  const { data } = await api.get<AdminStats>("/admin/analytics/stats");
  return data;
};

export const fetchUsersOverTime = async (): Promise<UsersOverTimeData[]> => {
  const { data } = await api.get<UsersOverTimeData[]>("/admin/analytics/users-over-time");
  return data;
};

export const fetchJobsOverTime = async (): Promise<JobsOverTimeData[]> => {
  const { data } = await api.get<JobsOverTimeData[]>("/admin/analytics/jobs-over-time");
  return data;
};

export const fetchCategoriesAnalytics = async (): Promise<CategoryData[]> => {
  const { data } = await api.get<CategoryData[]>("/admin/analytics/categories");
  return data;
};

export const fetchRevenueAnalytics = async (): Promise<RevenueData[]> => {
  const { data } = await api.get<RevenueData[]>("/admin/analytics/revenue");
  return data;
};

export default api;

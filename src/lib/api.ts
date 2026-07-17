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

export default api;

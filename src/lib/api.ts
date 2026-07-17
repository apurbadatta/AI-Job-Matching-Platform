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
  };
  deadline: string;
  isFeatured: boolean;
  createdAt: string;
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

export interface JobsQueryParams {
  search?: string;
  category?: string;
  location?: string;
  jobType?: string;
  sort?: string;
  page?: number;
  limit?: number;
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

export default api;

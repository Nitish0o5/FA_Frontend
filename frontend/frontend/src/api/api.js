import axios from "axios";

const BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL)
  ? import.meta.env.VITE_API_URL
  : (window.__API_URL__ || "http://127.0.0.1:5000/api");

// Helper to set auth header
export const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    try {
      localStorage.setItem("app_token", token);
    } catch (e) {}
  } else {
    delete axios.defaults.headers.common["Authorization"];
    try {
      localStorage.removeItem("app_token");
    } catch (e) {}
  }
};

// Sync data
export const syncData = async () => {
  const { data } = await axios.post(`${BASE_URL}/sync`);
  return data;
};

// Health check
export const getHealth = async () => {
  const { data } = await axios.get(`${BASE_URL}/health`);
  return data;
};

// Auth operations
export const login = async (email, password) => {
  const { data } = await axios.post(`${BASE_URL}/auth/login`, { email, password });
  const token = data?.data?.token || data?.data?.accessToken || data?.token;
  if (token) {
    setAuthToken(token);
    try {
      const me = await axios.get(`${BASE_URL}/auth/me`);
      return { token, user: me.data?.data || me.data };
    } catch (e) {
      return { token, user: null };
    }
  }
  return { token: null, user: null };
};

export const register = async (userData) => {
  const { data } = await axios.post(`${BASE_URL}/auth/register`, userData);
  return data;
};

export const getMe = async () => {
  const { data } = await axios.get(`${BASE_URL}/auth/me`);
  return data?.data || data;
};

// Student CRUD
export const getStudents = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const { data } = await axios.get(`${BASE_URL}/students?${query}`);
  return data;
};
export const getStudent = async (id) => {
  const { data } = await axios.get(`${BASE_URL}/students/${id}`);
  return data?.data || data;
};
export const createStudent = async (studentData) => {
  const { data } = await axios.post(`${BASE_URL}/students`, studentData);
  return data?.data || data;
};
export const updateStudent = async (id, studentData) => {
  const { data } = await axios.put(`${BASE_URL}/students/${id}`, studentData);
  return data?.data || data;
};
export const deleteStudent = async (id) => {
  const { data } = await axios.delete(`${BASE_URL}/students/${id}`);
  return data;
};

// Company CRUD
export const getCompanies = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const { data } = await axios.get(`${BASE_URL}/companies?${query}`);
  return data;
};
export const getCompany = async (id) => {
  const { data } = await axios.get(`${BASE_URL}/companies/${id}`);
  return data?.data || data;
};
export const createCompany = async (companyData) => {
  const { data } = await axios.post(`${BASE_URL}/companies`, companyData);
  return data?.data || data;
};
export const updateCompany = async (id, companyData) => {
  const { data } = await axios.put(`${BASE_URL}/companies/${id}`, companyData);
  return data?.data || data;
};
export const deleteCompany = async (id) => {
  const { data } = await axios.delete(`${BASE_URL}/companies/${id}`);
  return data;
};

// Drive CRUD
export const getDrives = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const { data } = await axios.get(`${BASE_URL}/drives?${query}`);
  return data;
};
export const getDrive = async (id) => {
  const { data } = await axios.get(`${BASE_URL}/drives/${id}`);
  return data?.data || data;
};
export const createDrive = async (driveData) => {
  const { data } = await axios.post(`${BASE_URL}/drives`, driveData);
  return data?.data || data;
};
export const updateDrive = async (id, driveData) => {
  const { data } = await axios.put(`${BASE_URL}/drives/${id}`, driveData);
  return data?.data || data;
};
export const deleteDrive = async (id) => {
  const { data } = await axios.delete(`${BASE_URL}/drives/${id}`);
  return data;
};

// Application CRUD
export const getApplications = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const { data } = await axios.get(`${BASE_URL}/applications?${query}`);
  return data;
};
export const getApplication = async (id) => {
  const { data } = await axios.get(`${BASE_URL}/applications/${id}`);
  return data?.data || data;
};
export const createApplication = async (appData) => {
  const { data } = await axios.post(`${BASE_URL}/applications`, appData);
  return data?.data || data;
};
export const updateApplication = async (id, appData) => {
  const { data } = await axios.put(`${BASE_URL}/applications/${id}`, appData);
  return data?.data || data;
};
export const deleteApplication = async (id) => {
  const { data } = await axios.delete(`${BASE_URL}/applications/${id}`);
  return data;
};

// Interview CRUD
export const getInterviews = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const { data } = await axios.get(`${BASE_URL}/interviews?${query}`);
  return data;
};
export const getInterview = async (id) => {
  const { data } = await axios.get(`${BASE_URL}/interviews/${id}`);
  return data?.data || data;
};
export const createInterview = async (interviewData) => {
  const { data } = await axios.post(`${BASE_URL}/interviews`, interviewData);
  return data?.data || data;
};
export const updateInterview = async (id, interviewData) => {
  const { data } = await axios.put(`${BASE_URL}/interviews/${id}`, interviewData);
  return data?.data || data;
};
export const deleteInterview = async (id) => {
  const { data } = await axios.delete(`${BASE_URL}/interviews/${id}`);
  return data;
};

// Analytics API calls
export const getPlacementAnalytics = async () => {
  const { data } = await axios.get(`${BASE_URL}/analytics/placements`);
  return data?.data || data;
};
export const getDepartmentAnalytics = async () => {
  const { data } = await axios.get(`${BASE_URL}/analytics/departments`);
  return data?.data || data;
};
export const getCompanyAnalytics = async () => {
  const { data } = await axios.get(`${BASE_URL}/analytics/companies`);
  return data?.data || data;
};

export default {
  setAuthToken,
  syncData,
  getHealth,
  login,
  register,
  getMe,
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
  getDrives,
  getDrive,
  createDrive,
  updateDrive,
  deleteDrive,
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
  getInterviews,
  getInterview,
  createInterview,
  updateInterview,
  deleteInterview,
  getPlacementAnalytics,
  getDepartmentAnalytics,
  getCompanyAnalytics,
};

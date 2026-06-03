import axios from "axios";

const BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL)
  ? import.meta.env.VITE_API_URL
  : (window.__API_URL__ || "http://127.0.0.1:5000/api");

export const syncData = async () => {
  const { data } = await axios.post(`${BASE_URL}/sync`);
  return data;
};

export const getHealth = async () => {
  const { data } = await axios.get(`${BASE_URL}/health`);
  return data;
};

export const getStudents = async (page = 1, limit = 20) => {
  const { data } = await axios.get(`${BASE_URL}/students?page=${page}&limit=${limit}`);
  return data;
};

export const getCompanies = async (page = 1, limit = 20) => {
  const { data } = await axios.get(`${BASE_URL}/companies?page=${page}&limit=${limit}`);
  return data;
};

export const getDrives = async (page = 1, limit = 20) => {
  const { data } = await axios.get(`${BASE_URL}/drives?page=${page}&limit=${limit}`);
  return data;
};

export const getApplications = async (page = 1, limit = 20) => {
  const { data } = await axios.get(`${BASE_URL}/applications?page=${page}&limit=${limit}`);
  return data;
};

export const getInterviews = async (page = 1, limit = 20) => {
  const { data } = await axios.get(`${BASE_URL}/interviews?page=${page}&limit=${limit}`);
  return data;
};

export const login = async (email, password) => {
  const { data } = await axios.post(`${BASE_URL}/auth/login`, { email, password });
  // data => { success, message, data: { accessToken } }
  const token = data?.data?.accessToken ?? data?.data?.token ?? data?.accessToken ?? data?.token;
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    // fetch profile
    try {
      const me = await axios.get(`${BASE_URL}/auth/me`);
      return { token, user: me.data?.data ?? me.data };
    } catch (e) {
      return { token, user: null };
    }
  }
  return { token: null, user: null };
};

export const getMe = async () => {
  const { data } = await axios.get(`${BASE_URL}/auth/me`);
  return data;
};

export default {
  syncData,
  getHealth,
  getStudents,
  getCompanies,
  getDrives,
  getApplications,
  getInterviews,
};

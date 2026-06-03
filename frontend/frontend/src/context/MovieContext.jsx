import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../api/api";
import axios from "axios";

export const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem("app_token") || null;
    } catch (e) {
      return null;
    }
  });

  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);

  const [filters, setFilters] = useState({});
  const [analytics, setAnalytics] = useState({
    placements: {},
    departments: [],
    companies: [],
  });

  // Set initial auth token in axios headers
  if (token) {
    api.setAuthToken(token);
  }

  // Refresh all data collections
  const refreshData = useCallback(async () => {
    try {
      // Sync first
      try {
        await api.syncData();
      } catch (syncErr) {
        console.warn("Auto-sync failed:", syncErr.message || syncErr);
      }

      const [s, c, d, a, i, placementStats, deptStats, companyStats] = await Promise.all([
        api.getStudents({ limit: 1000 }),
        api.getCompanies({ limit: 1000 }),
        api.getDrives({ limit: 1000 }),
        api.getApplications({ limit: 1000 }),
        api.getInterviews({ limit: 1000 }),
        api.getPlacementAnalytics(),
        api.getDepartmentAnalytics(),
        api.getCompanyAnalytics(),
      ]);

      const getArr = (payload) => {
        if (!payload) return [];
        if (Array.isArray(payload)) return payload;
        if (Array.isArray(payload.data)) return payload.data;
        return [];
      };

      setStudents(getArr(s));
      setCompanies(getArr(c));
      setDrives(getArr(d));
      setApplications(getArr(a));
      setInterviews(getArr(i));
      setAnalytics({
        placements: placementStats || {},
        departments: deptStats || [],
        companies: companyStats || [],
      });
    } catch (err) {
      console.error("Error refreshing data:", err.message || err);
    }
  }, []);

  // Auth check on mount or when token changes
  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      if (token) {
        try {
          api.setAuthToken(token);
          const userData = await api.getMe();
          setUser(userData);
        } catch (err) {
          console.error("Token invalid, logging out:", err.message || err);
          setUser(null);
          setToken(null);
          api.setAuthToken(null);
        }
      } else {
        setUser(null);
      }
      
      // Load data always!
      await refreshData();
      setLoading(false);
    };

    checkAuth();
  }, [token, refreshData]);

  // Sync window.appState with the current context state
  useEffect(() => {
    window.appState = {
      authUser: user ? user.role : null,
      token: token,
      students: students.length,
      companies: companies.length,
      drives: drives.length,
      applications: applications.length,
      interviews: interviews.length,
      filters: filters,
      analytics: analytics,
    };
  }, [user, token, students, companies, drives, applications, interviews, filters, analytics]);

  // User Authentication
  const loginUser = async (email, password) => {
    try {
      const res = await api.login(email, password);
      if (res.token) {
        setToken(res.token);
        setUser(res.user);
        api.setAuthToken(res.token);
        return { success: true };
      }
      return { success: false, error: "Invalid credentials" };
    } catch (err) {
      return { success: false, error: err.response?.data?.message || err.message || "Login failed" };
    }
  };

  const logoutUser = () => {
    setToken(null);
    setUser(null);
    api.setAuthToken(null);
    setStudents([]);
    setCompanies([]);
    setDrives([]);
    setApplications([]);
    setInterviews([]);
    setFilters({});
    setAnalytics({ placements: {}, departments: [], companies: [] });
  };

  // Student Actions
  const addStudent = async (data) => {
    const student = await api.createStudent(data);
    await refreshData();
    return student;
  };
  const editStudent = async (id, data) => {
    const student = await api.updateStudent(id, data);
    await refreshData();
    return student;
  };
  const removeStudent = async (id) => {
    await api.deleteStudent(id);
    await refreshData();
  };

  // Company Actions
  const addCompany = async (data) => {
    const company = await api.createCompany(data);
    await refreshData();
    return company;
  };
  const editCompany = async (id, data) => {
    const company = await api.updateCompany(id, data);
    await refreshData();
    return company;
  };
  const removeCompany = async (id) => {
    await api.deleteCompany(id);
    await refreshData();
  };

  // Drive Actions
  const addDrive = async (data) => {
    const drive = await api.createDrive(data);
    await refreshData();
    return drive;
  };
  const editDrive = async (id, data) => {
    const drive = await api.updateDrive(id, data);
    await refreshData();
    return drive;
  };
  const removeDrive = async (id) => {
    await api.deleteDrive(id);
    await refreshData();
  };

  // Application Actions
  const applyToDrive = async (studentId, driveId) => {
    const app = await api.createApplication({ student: studentId, drive: driveId });
    await refreshData();
    return app;
  };
  const updateAppStatus = async (id, status, currentRound) => {
    const app = await api.updateApplication(id, { status, currentRound });
    await refreshData();
    return app;
  };
  const removeApplication = async (id) => {
    await api.deleteApplication(id);
    await refreshData();
  };

  // Interview Actions
  const addInterview = async (data) => {
    const interview = await api.createInterview(data);
    await refreshData();
    return interview;
  };
  const editInterview = async (id, data) => {
    const interview = await api.updateInterview(id, data);
    await refreshData();
    return interview;
  };
  const removeInterview = async (id) => {
    await api.deleteInterview(id);
    await refreshData();
  };

  // Update filter parameters
  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Trigger sync manual trigger
  const triggerSync = async () => {
    setLoading(true);
    try {
      await api.syncData();
      await refreshData();
    } catch (e) {
      console.error("Manual sync failed:", e.message || e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MovieContext.Provider
      value={{
        loading,
        user,
        token,
        students,
        companies,
        drives,
        applications,
        interviews,
        filters,
        analytics,
        loginUser,
        logoutUser,
        refreshData,
        updateFilters,
        addStudent,
        editStudent,
        removeStudent,
        addCompany,
        editCompany,
        removeCompany,
        addDrive,
        editDrive,
        removeDrive,
        applyToDrive,
        updateAppStatus,
        removeApplication,
        addInterview,
        editInterview,
        removeInterview,
        triggerSync,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovie = () => useContext(MovieContext);

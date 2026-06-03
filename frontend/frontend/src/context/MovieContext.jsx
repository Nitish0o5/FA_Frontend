import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/api";
import axios from "axios";

export const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    const init = async () => {
        // Restore token from localStorage if present
        const storedToken = (() => {
          try {
            return localStorage.getItem("app_token");
          } catch (e) {
            return null;
          }
        })();

        if (storedToken) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        }
      try {
        // Trigger backend sync which ingests latest saved dataset
        await api.syncData();

        // Fetch paginated first pages for each collection
        const [s, c, d, a, i] = await Promise.all([
          api.getStudents(1, 100),
          api.getCompanies(1, 100),
          api.getDrives(1, 100),
          api.getApplications(1, 200),
          api.getInterviews(1, 500),
        ]);

        const extractArray = (resp) => {
          if (!resp) return [];
          const payload = resp.data ?? resp;
          if (!payload) return [];
          if (Array.isArray(payload.data)) return payload.data;
          if (Array.isArray(payload)) return payload;
          return [];
        };

        const sArr = extractArray(s);
        const cArr = extractArray(c);
        const dArr = extractArray(d);
        const aArr = extractArray(a);
        const iArr = extractArray(i);

        setStudents(sArr);
        setCompanies(cArr);
        setDrives(dArr);
        setApplications(aArr);
        setInterviews(iArr);

        // Populate global evaluator contract (counts as numbers)
        window.appState = {
          authUser: null,
            token: storedToken ?? null,
          students: s?.data?.total ?? (s?.total || sArr.length),
          studentsData: sArr,
          companies: c?.data?.total ?? (c?.total || cArr.length),
          companiesData: cArr,
          drives: d?.data?.total ?? (d?.total || dArr.length),
          drivesData: dArr,
          applications: a?.data?.total ?? (a?.total || aArr.length),
          applicationsData: aArr,
          interviews: i?.data?.total ?? (i?.total || iArr.length),
          interviewsData: iArr,
          filters: {},
          analytics: {},
        };
        
          // If we have a token, fetch the current user
          if (storedToken) {
            try {
              const me = await api.getMe();
              const user = me?.data ?? me;
              window.appState.authUser = user;
            } catch (e) {
              console.warn("Failed to fetch auth user", e?.message || e);
            }
          }
      } catch (err) {
        console.error("Failed to initialize app data:", err.message || err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  return (
    <MovieContext.Provider
      value={{
        loading,
        students,
        companies,
        drives,
        applications,
        interviews,
      }}
    >
      {children}
    </MovieContext.Provider>
  );
};

export const useMovie = () => useContext(MovieContext);

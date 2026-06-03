import React from "react";
import { Link } from "react-router-dom";
import { useMovie } from "../context/MovieContext";

const Dashboard = () => {
  const {
    loading,
    user,
    students,
    companies,
    drives,
    applications,
    interviews,
    analytics,
    triggerSync,
  } = useMovie();

  if (loading) return <div className="loading-screen text-center mt-5">Loading Dashboard data...</div>;

  // Recent 5 drives
  const recentDrives = [...drives].slice(0, 5);
  // Recent 5 applications
  const recentApps = [...applications].slice(0, 5);
  // Pending interviews
  const pendingInterviews = interviews.filter((i) => i.result === "pending").slice(0, 5);

  return (
    <div className="page-container dashboard-page" data-testid="dashboard-page">
      <div className="page-header d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1>Welcome, {user?.name || "User"}!</h1>
          <p className="text-muted">Overview of the Recruitment System</p>
        </div>
        {(user?.role === "admin" || user?.role === "placement_officer") && (
          <button onClick={triggerSync} className="btn btn-outline-primary" data-testid="sync-db-btn">
            🔄 Sync Data from API
          </button>
        )}
      </div>

      {/* Analytics Cards Grid */}
      <div className="stats-grid mb-4">
        <Link to="/students" className="card stat-card" data-testid="card-students">
          <div className="stat-icon">🎓</div>
          <div className="stat-content">
            <h3 className="stat-title">Total Students</h3>
            <p className="stat-value">{students.length}</p>
          </div>
        </Link>

        <Link to="/companies" className="card stat-card" data-testid="card-companies">
          <div className="stat-icon">🏢</div>
          <div className="stat-content">
            <h3 className="stat-title">Total Companies</h3>
            <p className="stat-value">{companies.length}</p>
          </div>
        </Link>

        <Link to="/drives" className="card stat-card" data-testid="card-drives">
          <div className="stat-icon">📢</div>
          <div className="stat-content">
            <h3 className="stat-title">Placement Drives</h3>
            <p className="stat-value">{drives.length}</p>
          </div>
        </Link>

        <Link to="/applications" className="card stat-card" data-testid="card-applications">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3 className="stat-title">Total Applications</h3>
            <p className="stat-value">{applications.length}</p>
          </div>
        </Link>

        <Link to="/interviews" className="card stat-card" data-testid="card-interviews">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <h3 className="stat-title">Interviews Scheduled</h3>
            <p className="stat-value">{interviews.length}</p>
          </div>
        </Link>
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Left Column */}
        <div className="dashboard-col">
          {/* Upcoming Drives Card */}
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h2>Upcoming & Active Drives</h2>
              <Link to="/drives" className="small">View All</Link>
            </div>
            <div className="card-body">
              {recentDrives.length === 0 ? (
                <p className="text-muted text-center py-3">No drives available</p>
              ) : (
                <div className="list-group">
                  {recentDrives.map((d) => (
                    <div key={d._id || d.driveId} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{d.title}</strong>
                          <div className="text-muted small">Mode: {d.mode} | Location: {d.location || "N/A"}</div>
                        </div>
                        <span className={`badge badge-${d.status}`}>{d.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="dashboard-col">
          {/* Recent Applications Card */}
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h2>Recent Applications</h2>
              <Link to="/applications" className="small">View All</Link>
            </div>
            <div className="card-body">
              {recentApps.length === 0 ? (
                <p className="text-muted text-center py-3">No applications submitted yet</p>
              ) : (
                <div className="list-group">
                  {recentApps.map((a) => (
                    <div key={a._id || a.applicationId} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{a.student?.name || "Student"}</strong>
                          <div className="text-muted small">Applied for: {a.drive?.title || "Drive"}</div>
                        </div>
                        <span className={`badge badge-${a.status}`}>{a.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Pending Interviews Card */}
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h2>Pending Interviews</h2>
              <Link to="/interviews" className="small">View All</Link>
            </div>
            <div className="card-body">
              {pendingInterviews.length === 0 ? (
                <p className="text-muted text-center py-3">No pending interviews</p>
              ) : (
                <div className="list-group">
                  {pendingInterviews.map((i) => (
                    <div key={i._id || i.interviewId} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{i.application?.student?.name || "Student"}</strong>
                          <div className="text-muted small">
                            Round: {i.round} | Date: {i.interviewDate ? new Date(i.interviewDate).toLocaleDateString() : "N/A"}
                          </div>
                        </div>
                        <span className="badge badge-warning">pending</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

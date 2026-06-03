import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useMovie } from "../context/MovieContext";
import api from "../api/api";

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, applications, updateAppStatus, interviews } = useMovie();

  const [app, setApp] = useState(null);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState("");
  const [round, setRound] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isStaff = user?.role === "admin" || user?.role === "placement_officer";

  useEffect(() => {
    // Find in context first
    const found = applications.find((a) => a.applicationId === id || a._id === id);
    if (found) {
      setApp(found);
      setStatus(found.status || "applied");
      setRound(found.currentRound || "Applied");
    } else {
      // Fetch from API
      api.getApplication(id)
        .then((data) => {
          setApp(data);
          setStatus(data.status || "applied");
          setRound(data.currentRound || "Applied");
        })
        .catch(() => {
          setError("Application not found");
        });
    }
  }, [id, applications]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const updated = await updateAppStatus(app._id || app.applicationId, status, round);
      setApp(updated);
      setSuccess("Application status updated successfully!");
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to update status");
    }
  };

  if (error && !app) {
    return (
      <div className="page-container text-center mt-5">
        <div className="alert alert-danger">{error}</div>
        <Link to="/applications" className="btn btn-secondary">Back to Applications</Link>
      </div>
    );
  }

  if (!app) return <div className="loading">Loading application details...</div>;

  // Find interviews scheduled for this application
  const appIntvs = interviews.filter(
    (intv) => intv.application?._id === app._id || intv.application?.applicationId === app.applicationId
  );

  const student = app.student || {};
  const drive = app.drive || {};
  const company = drive.company || {};

  return (
    <div className="page-container application-detail-page" data-testid="application-detail-page">
      <div className="mb-3">
        <Link to="/applications" className="text-secondary">
          &larr; Back to Applications
        </Link>
      </div>

      <div className="detail-header card mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div>
            <h1>Application {app.applicationId}</h1>
            <p className="text-muted mb-0">
              Applied on: {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "N/A"}
            </p>
          </div>
          <div className="d-flex align-items-center">
            <span className={`badge badge-${app.status} mr-2`}>{app.status}</span>
            {isStaff && !editing && (
              <button
                className="btn btn-outline-primary"
                onClick={() => setEditing(true)}
                data-testid="edit-status-btn"
              >
                Update Status
              </button>
            )}
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {editing && isStaff ? (
        <form onSubmit={handleUpdate} className="form-card mb-4" data-testid="update-status-form">
          <h3>Update Application Status</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Current Round</label>
              <input
                type="text"
                value={round}
                onChange={(e) => setRound(e.target.value)}
                required
                data-testid="edit-round"
              />
            </div>
            <div className="form-group">
              <label>Application Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                data-testid="edit-status"
              >
                <option value="applied">Applied</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="selected">Selected</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          <div className="mt-3">
            <button type="submit" className="btn btn-success mr-2" data-testid="save-status-btn">
              Save Changes
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="dashboard-grid">
          {/* Student Profile Card */}
          <div className="card">
            <div className="card-header">
              <h3>Applicant Student Info</h3>
            </div>
            <div className="card-body">
              <div className="info-item mb-2">
                <span className="info-label">Name:</span>
                <span className="info-value font-bold">
                  <Link to={`/students/${student.studentId}`}>{student.name}</Link>
                </span>
              </div>
              <div className="info-item mb-2">
                <span className="info-label">ID:</span>
                <span className="info-value">{student.studentId}</span>
              </div>
              <div className="info-item mb-2">
                <span className="info-label">Email:</span>
                <span className="info-value">{student.email}</span>
              </div>
              <div className="info-item mb-2">
                <span className="info-label">Department:</span>
                <span className="info-value">{student.department}</span>
              </div>
              <div className="info-item mb-2">
                <span className="info-label">CGPA:</span>
                <span className="info-value">{student.cgpa}</span>
              </div>
            </div>
          </div>

          {/* Drive info card */}
          <div className="card">
            <div className="card-header">
              <h3>Recruitment Drive Info</h3>
            </div>
            <div className="card-body">
              <div className="info-item mb-2">
                <span className="info-label">Title:</span>
                <span className="info-value font-bold">
                  <Link to={`/drives/${drive.driveId}`}>{drive.title}</Link>
                </span>
              </div>
              <div className="info-item mb-2">
                <span className="info-label">Company:</span>
                <span className="info-value font-bold">
                  <Link to={`/companies/${company.companyId}`}>{company.name}</Link>
                </span>
              </div>
              <div className="info-item mb-2">
                <span className="info-label">Role:</span>
                <span className="info-value">{company.role}</span>
              </div>
              <div className="info-item mb-2">
                <span className="info-label">Package:</span>
                <span className="info-value">{company.package} LPA</span>
              </div>
              <div className="info-item mb-2">
                <span className="info-label">Min CGPA Required:</span>
                <span className="info-value">{company.minimumCgpa}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Associated Interviews list */}
      <div className="card mt-4">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3>Application Interview History ({appIntvs.length})</h3>
          {isStaff && (
            <Link to="/interviews" className="btn btn-sm btn-primary">
              Schedule New Interview
            </Link>
          )}
        </div>
        <div className="card-body">
          {appIntvs.length === 0 ? (
            <p className="text-muted text-center py-2">No interviews scheduled yet for this application.</p>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Interview ID</th>
                    <th>Round</th>
                    <th>Interviewer</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Result</th>
                    <th>Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {appIntvs.map((intv) => (
                    <tr key={intv._id || intv.interviewId}>
                      <td>{intv.interviewId}</td>
                      <td>{intv.round}</td>
                      <td>{intv.interviewer}</td>
                      <td>{intv.interviewDate ? new Date(intv.interviewDate).toLocaleString() : "N/A"}</td>
                      <td>
                        <span className={`badge badge-${intv.status}`}>{intv.status}</span>
                      </td>
                      <td>
                        <span className={`badge badge-${intv.result}`}>{intv.result}</span>
                      </td>
                      <td>{intv.feedback || <span className="text-muted">None</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetail;

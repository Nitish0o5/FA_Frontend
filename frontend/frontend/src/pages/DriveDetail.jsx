import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useMovie } from "../context/MovieContext";
import api from "../api/api";

const DriveDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, drives, editDrive, applications, companies } = useMovie();

  const [drive, setDrive] = useState(null);
  const [editing, setEditing] = useState(false);

  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [mode, setMode] = useState("online");
  const [location, setLocation] = useState("");
  const [deadline, setDeadline] = useState("");
  const [rounds, setRounds] = useState("");
  const [status, setStatus] = useState("open");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isStaff = user?.role === "admin" || user?.role === "placement_officer";

  useEffect(() => {
    // Look up in context first
    const found = drives.find((d) => d.driveId === id || d._id === id);
    if (found) {
      setDrive(found);
      setCompany(found.company?._id || found.company || "");
      setTitle(found.title || "");
      setMode(found.mode || "online");
      setLocation(found.location || "");
      setDeadline(found.registrationDeadline ? new Date(found.registrationDeadline).toISOString().split("T")[0] : "");
      setRounds(found.rounds ? found.rounds.join(", ") : "");
      setStatus(found.status || "open");
    } else {
      // Fetch from API
      api.getDrive(id)
        .then((data) => {
          setDrive(data);
          setCompany(data.company?._id || data.company || "");
          setTitle(data.title || "");
          setMode(data.mode || "online");
          setLocation(data.location || "");
          setDeadline(data.registrationDeadline ? new Date(data.registrationDeadline).toISOString().split("T")[0] : "");
          setRounds(data.rounds ? data.rounds.join(", ") : "");
          setStatus(data.status || "open");
        })
        .catch(() => {
          setError("Drive not found");
        });
    }
  }, [id, drives]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const roundsArray = rounds
      ? rounds.split(",").map((r) => r.trim()).filter(Boolean)
      : [];

    try {
      const updated = await editDrive(drive._id || drive.driveId, {
        company,
        title,
        mode,
        location,
        registrationDeadline: deadline,
        rounds: roundsArray,
        status,
      });
      setDrive(updated);
      setSuccess("Drive updated successfully!");
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to update drive");
    }
  };

  if (error && !drive) {
    return (
      <div className="page-container text-center mt-5">
        <div className="alert alert-danger">{error}</div>
        <Link to="/drives" className="btn btn-secondary">Back to Drives</Link>
      </div>
    );
  }

  if (!drive) return <div className="loading">Loading recruitment drive details...</div>;

  // Find applications for this recruitment drive
  const driveApps = applications.filter(
    (app) => app.drive?._id === drive._id || app.drive?.driveId === drive.driveId
  );

  return (
    <div className="page-container drive-detail-page" data-testid="drive-detail-page">
      <div className="mb-3">
        <Link to="/drives" className="text-secondary">
          &larr; Back to Recruitment Drives
        </Link>
      </div>

      <div className="detail-header card mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div>
            <h1>{drive.title}</h1>
            <p className="text-muted mb-0">ID: {drive.driveId} | Mode: {drive.mode}</p>
          </div>
          <div className="d-flex align-items-center">
            <span className={`badge badge-${drive.status} mr-2`}>{drive.status}</span>
            {isStaff && !editing && (
              <button
                className="btn btn-outline-primary"
                onClick={() => setEditing(true)}
                data-testid="edit-drive-btn"
              >
                Edit Drive
              </button>
            )}
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {editing && isStaff ? (
        <form onSubmit={handleUpdate} className="form-card mb-4" data-testid="edit-drive-form">
          <h3>Edit Recruitment Drive</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Drive Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                data-testid="edit-title"
              />
            </div>
            <div className="form-group">
              <label>Company *</label>
              <select
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
                data-testid="edit-company"
              >
                <option value="">-- Select Company --</option>
                {companies.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Mode</label>
              <select value={mode} onChange={(e) => setMode(e.target.value)} data-testid="edit-mode">
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                data-testid="edit-location"
              />
            </div>
            <div className="form-group">
              <label>Registration Deadline *</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
                data-testid="edit-deadline"
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} data-testid="edit-status">
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div className="form-group">
              <label>Rounds (comma separated)</label>
              <input
                type="text"
                value={rounds}
                onChange={(e) => setRounds(e.target.value)}
                data-testid="edit-rounds"
              />
            </div>
          </div>
          <div className="mt-3">
            <button type="submit" className="btn btn-success mr-2" data-testid="save-drive-btn">
              Save Changes
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="card mb-4">
          <div className="card-body">
            <h3>Drive Details Summary</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Drive ID:</span>
                <span className="info-value">{drive.driveId}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Company Name:</span>
                <span className="info-value">{drive.company?.name || "N/A"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Role Offered:</span>
                <span className="info-value">{drive.company?.role || "N/A"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Min CGPA Required:</span>
                <span className="info-value">{drive.company?.minimumCgpa || "N/A"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Package (LPA):</span>
                <span className="info-value">{drive.company?.package ? `${drive.company.package} LPA` : "N/A"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Location:</span>
                <span className="info-value">{drive.location || "N/A"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Deadline:</span>
                <span className="info-value">{drive.registrationDeadline ? new Date(drive.registrationDeadline).toLocaleDateString() : "N/A"}</span>
              </div>
            </div>
            <div className="skills-container mt-3">
              <span className="info-label">Recruitment Rounds:</span>
              <div className="skills-tags mt-2">
                {drive.rounds && drive.rounds.length > 0 ? (
                  drive.rounds.map((round, idx) => (
                    <span key={`${round}-${idx}`} className="skill-tag badge badge-info">
                      {round}
                    </span>
                  ))
                ) : (
                  <span className="text-muted">No rounds defined</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Applicants Section */}
      <div className="card">
        <div className="card-header">
          <h3>Applicants Registered ({driveApps.length})</h3>
        </div>
        <div className="card-body">
          {driveApps.length === 0 ? (
            <p className="text-muted text-center py-2">No students have applied to this drive yet.</p>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>CGPA</th>
                    <th>Applied At</th>
                    <th>Current Round</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {driveApps.map((app) => (
                    <tr key={app._id || app.applicationId}>
                      <td>
                        <Link to={`/students/${app.student?.studentId}`} className="text-primary font-bold">
                          {app.student?.studentId}
                        </Link>
                      </td>
                      <td>{app.student?.name}</td>
                      <td>{app.student?.email}</td>
                      <td>{app.student?.cgpa}</td>
                      <td>{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "N/A"}</td>
                      <td>{app.currentRound}</td>
                      <td>
                        <span className={`badge badge-${app.status}`}>{app.status}</span>
                      </td>
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

export default DriveDetail;

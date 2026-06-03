import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMovie } from "../context/MovieContext";

const Applications = () => {
  const { loading, user, applications, updateAppStatus, removeApplication } = useMovie();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState("");
  const [editRound, setEditRound] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isStaff = user?.role === "admin" || user?.role === "placement_officer";

  const handleSaveEdit = async (id) => {
    setError("");
    setSuccess("");
    try {
      await updateAppStatus(id, editStatus, editRound);
      setSuccess("Application status updated!");
      setEditingId(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to update status");
    }
  };

  const startEdit = (app) => {
    setEditingId(app._id || app.applicationId);
    setEditStatus(app.status || "applied");
    setEditRound(app.currentRound || "Applied");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        await removeApplication(id);
        setSuccess("Application deleted");
      } catch (err) {
        setError("Failed to delete application");
      }
    }
  };

  if (loading) return <div className="loading">Loading applications...</div>;

  const filteredApps = applications.filter((app) => {
    const studentName = app.student?.name || "";
    const companyName = app.drive?.company?.name || "";
    const driveTitle = app.drive?.title || "";

    const matchesSearch =
      !search ||
      studentName.toLowerCase().includes(search.toLowerCase()) ||
      companyName.toLowerCase().includes(search.toLowerCase()) ||
      driveTitle.toLowerCase().includes(search.toLowerCase()) ||
      app.applicationId?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = !statusFilter || app.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page-container" data-testid="applications-page">
      <div className="page-header d-flex justify-content-between align-items-center mb-4">
        <h1>Student Applications</h1>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {/* Filters Box */}
      <div className="filters-card card mb-4">
        <h3>Filter & Search</h3>
        <div className="filters-grid select-3-cols">
          <div className="form-group">
            <label>Search Student/Company/Title</label>
            <input
              type="text"
              className="form-control"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              data-testid="filter-search"
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              data-testid="filter-status"
            >
              <option value="">All Statuses</option>
              <option value="applied">Applied</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="selected">Selected</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="table-container">
        <table className="data-table" data-testid="applications-table">
          <thead>
            <tr>
              <th>Application ID</th>
              <th>Student</th>
              <th>Recruitment Drive</th>
              <th>Company</th>
              <th>Applied At</th>
              <th>Current Round</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center">
                  No applications found.
                </td>
              </tr>
            ) : (
              filteredApps.map((app) => {
                const isEditing = editingId === (app._id || app.applicationId);
                const s = app.student || {};
                const d = app.drive || {};
                const c = d.company || {};

                return (
                  <tr key={app._id || app.applicationId} data-testid={`application-row-${app.applicationId}`}>
                    <td>
                      <Link to={`/applications/${app.applicationId}`} className="text-primary font-bold">
                        {app.applicationId}
                      </Link>
                    </td>
                    <td>
                      <strong>{s.name || "N/A"}</strong>
                      <div className="text-muted small">CGPA: {s.cgpa} | Dept: {s.department}</div>
                    </td>
                    <td>{d.title}</td>
                    <td>{c.name || "N/A"}</td>
                    <td>{app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "N/A"}</td>
                    <td>
                      {isEditing ? (
                        <input
                          type="text"
                          className="form-control-sm"
                          value={editRound}
                          onChange={(e) => setEditRound(e.target.value)}
                        />
                      ) : (
                        app.currentRound
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <select
                          className="form-control-sm"
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                        >
                          <option value="applied">Applied</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="selected">Selected</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      ) : (
                        <span className={`badge badge-${app.status}`}>{app.status}</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        {isEditing ? (
                          <>
                            <button
                              className="btn btn-sm btn-success mr-1"
                              onClick={() => handleSaveEdit(app._id || app.applicationId)}
                              data-testid="save-status-btn"
                            >
                              Save
                            </button>
                            <button className="btn btn-sm btn-secondary" onClick={() => setEditingId(null)}>
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <Link
                              to={`/applications/${app.applicationId}`}
                              className="btn btn-sm btn-outline-primary mr-1"
                            >
                              View
                            </Link>
                            {isStaff && (
                              <>
                                <button
                                  className="btn btn-sm btn-outline-success mr-1"
                                  onClick={() => startEdit(app)}
                                  data-testid={`edit-btn-${app.applicationId}`}
                                >
                                  Update Status
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDelete(app._id || app.applicationId)}
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Applications;

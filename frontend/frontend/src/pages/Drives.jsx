import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMovie } from "../context/MovieContext";

const Drives = () => {
  const {
    loading,
    user,
    drives,
    companies,
    students,
    applications,
    addDrive,
    removeDrive,
    applyToDrive,
  } = useMovie();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [driveId, setDriveId] = useState("");
  const [companySelect, setCompanySelect] = useState("");
  const [title, setTitle] = useState("");
  const [mode, setMode] = useState("online");
  const [location, setLocation] = useState("");
  const [deadline, setDeadline] = useState("");
  const [rounds, setRounds] = useState("");
  const [status, setStatus] = useState("open");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isStaff = user?.role === "admin" || user?.role === "placement_officer";
  const isStudent = user?.role === "student";

  // If student, find their student object to validate applications
  const currentStudentObj = isStudent
    ? students.find((s) => s.email?.toLowerCase() === user?.email?.toLowerCase())
    : null;

  const handleCreateDrive = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!driveId || !companySelect || !title || !deadline) {
      setError("Please fill in all required fields");
      return;
    }

    const roundsArray = rounds
      ? rounds.split(",").map((r) => r.trim()).filter(Boolean)
      : ["Aptitude", "Technical", "HR"];

    try {
      await addDrive({
        driveId,
        company: companySelect,
        title,
        mode,
        location,
        registrationDeadline: deadline,
        rounds: roundsArray,
        status,
      });
      setSuccess("Drive created successfully!");
      setDriveId("");
      setCompanySelect("");
      setTitle("");
      setLocation("");
      setDeadline("");
      setRounds("");
      setShowAddForm(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to create drive");
    }
  };

  const handleApply = async (drive) => {
    setError("");
    setSuccess("");

    if (!currentStudentObj) {
      setError("You must have a student profile to apply");
      return;
    }

    try {
      await applyToDrive(currentStudentObj._id || currentStudentObj.studentId, drive._id || drive.driveId);
      setSuccess(`Applied to ${drive.title} successfully!`);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to submit application");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this recruitment drive?")) {
      try {
        await removeDrive(id);
        setSuccess("Drive deleted successfully");
      } catch (err) {
        setError("Failed to delete drive");
      }
    }
  };

  if (loading) return <div className="loading">Loading drives...</div>;

  const filteredDrives = drives.filter((d) => {
    const companyName = d.company?.name || "";
    const driveTitle = d.title || "";
    const matchesSearch =
      !search ||
      driveTitle.toLowerCase().includes(search.toLowerCase()) ||
      companyName.toLowerCase().includes(search.toLowerCase()) ||
      d.driveId?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = !statusFilter || d.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page-container" data-testid="drives-page">
      <div className="page-header d-flex justify-content-between align-items-center mb-4">
        <h1>Recruitment Drives</h1>
        {isStaff && (
          <button
            className="btn btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
            data-testid="add-drive-btn"
          >
            {showAddForm ? "Cancel" : "Create Drive"}
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showAddForm && isStaff && (
        <form onSubmit={handleCreateDrive} className="form-card mb-4" data-testid="drive-form">
          <h3>Create Recruitment Drive</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Drive ID *</label>
              <input
                type="text"
                value={driveId}
                onChange={(e) => setDriveId(e.target.value)}
                required
                placeholder="e.g. DRV101"
                data-testid="input-drive-id"
              />
            </div>
            <div className="form-group">
              <label>Associated Company *</label>
              <select
                value={companySelect}
                onChange={(e) => setCompanySelect(e.target.value)}
                required
                data-testid="select-company"
              >
                <option value="">-- Select Company --</option>
                {companies.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.role})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Drive Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. PixelCraft Hiring Drive"
                data-testid="input-drive-title"
              />
            </div>
            <div className="form-group">
              <label>Mode</label>
              <select value={mode} onChange={(e) => setMode(e.target.value)}>
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
                placeholder="Location (for offline drives)"
              />
            </div>
            <div className="form-group">
              <label>Registration Deadline *</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
                data-testid="input-drive-deadline"
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
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
                placeholder="Aptitude, Technical, HR"
              />
            </div>
          </div>
          <button type="submit" className="btn btn-success mt-3" data-testid="save-drive-btn">
            Save Drive
          </button>
        </form>
      )}

      {/* Filters Box */}
      <div className="filters-card card mb-4">
        <h3>Filter & Search</h3>
        <div className="filters-grid select-3-cols">
          <div className="form-group">
            <label>Search Title/Company</label>
            <input
              type="text"
              className="form-control"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search drives..."
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
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table list */}
      <div className="table-container">
        <table className="data-table" data-testid="drives-table">
          <thead>
            <tr>
              <th>Drive ID</th>
              <th>Company</th>
              <th>Drive Title</th>
              <th>Mode</th>
              <th>Location</th>
              <th>Deadline</th>
              <th>Rounds</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDrives.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center">
                  No recruitment drives scheduled.
                </td>
              </tr>
            ) : (
              filteredDrives.map((d) => {
                const comp = d.company || {};
                const hasApplied =
                  isStudent &&
                  applications.some(
                    (a) =>
                      (a.student?._id === currentStudentObj?._id ||
                        a.student?.studentId === currentStudentObj?.studentId) &&
                      (a.drive?._id === d._id || a.drive?.driveId === d.driveId)
                  );

                return (
                  <tr key={d._id || d.driveId} data-testid={`drive-row-${d.driveId}`}>
                    <td>
                      <Link to={`/drives/${d.driveId}`} className="text-primary font-bold">
                        {d.driveId}
                      </Link>
                    </td>
                    <td>
                      <strong>{comp.name || "N/A"}</strong>
                      <div className="text-muted small">Min CGPA: {comp.minimumCgpa}</div>
                    </td>
                    <td>{d.title}</td>
                    <td>{d.mode}</td>
                    <td>{d.location || "N/A"}</td>
                    <td>{d.registrationDeadline ? new Date(d.registrationDeadline).toLocaleDateString() : "N/A"}</td>
                    <td>
                      {d.rounds?.map((r, idx) => (
                        <span key={`${r}-${idx}`} className="badge badge-info mr-1">
                          {r}
                        </span>
                      ))}
                    </td>
                    <td>
                      <span className={`badge badge-${d.status}`}>{d.status}</span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Link to={`/drives/${d.driveId}`} className="btn btn-sm btn-outline-primary mr-1">
                          View
                        </Link>
                        {isStudent && (
                          <button
                            className="btn btn-sm btn-success mr-1"
                            disabled={hasApplied || d.status === "closed"}
                            onClick={() => handleApply(d)}
                            data-testid={`apply-btn-${d.driveId}`}
                          >
                            {hasApplied ? "Applied" : "Apply"}
                          </button>
                        )}
                        {isStaff && (
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(d._id || d.driveId)}
                          >
                            Delete
                          </button>
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

export default Drives;

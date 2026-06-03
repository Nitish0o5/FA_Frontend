import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useMovie } from "../context/MovieContext";
import api from "../api/api";

const CompanyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, companies, editCompany, drives } = useMovie();

  const [company, setCompany] = useState(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [pkg, setPkg] = useState("");
  const [minCgpa, setMinCgpa] = useState("");
  const [eligibleDepts, setEligibleDepts] = useState("");
  const [driveDate, setDriveDate] = useState("");
  const [status, setStatus] = useState("active");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isStaff = user?.role === "admin" || user?.role === "placement_officer";

  useEffect(() => {
    // Look up in context first
    const found = companies.find((c) => c.companyId === id || c._id === id);
    if (found) {
      setCompany(found);
      setName(found.name || "");
      setRole(found.role || "");
      setPkg(found.package || "");
      setMinCgpa(found.minimumCgpa || "");
      setEligibleDepts(found.eligibleDepartments ? found.eligibleDepartments.join(", ") : "");
      setDriveDate(found.driveDate ? new Date(found.driveDate).toISOString().split("T")[0] : "");
      setStatus(found.status || "active");
    } else {
      // Fetch from API
      api.getCompany(id)
        .then((data) => {
          setCompany(data);
          setName(data.name || "");
          setRole(data.role || "");
          setPkg(data.package || "");
          setMinCgpa(data.minimumCgpa || "");
          setEligibleDepts(data.eligibleDepartments ? data.eligibleDepartments.join(", ") : "");
          setDriveDate(data.driveDate ? new Date(data.driveDate).toISOString().split("T")[0] : "");
          setStatus(data.status || "active");
        })
        .catch(() => {
          setError("Company not found");
        });
    }
  }, [id, companies]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const packageVal = parseFloat(pkg);
    const cgpaVal = parseFloat(minCgpa);

    if (isNaN(packageVal) || packageVal <= 0) {
      setError("Package must be a valid positive number");
      return;
    }

    if (isNaN(cgpaVal) || cgpaVal < 0 || cgpaVal > 10) {
      setError("Minimum CGPA must be between 0 and 10");
      return;
    }

    const deptsArray = eligibleDepts
      ? eligibleDepts.split(",").map((d) => d.trim().toUpperCase()).filter(Boolean)
      : [];

    try {
      const updated = await editCompany(company._id || company.companyId, {
        name,
        role,
        package: packageVal,
        minimumCgpa: cgpaVal,
        eligibleDepartments: deptsArray,
        driveDate: driveDate || null,
        status,
      });
      setCompany(updated);
      setSuccess("Company updated successfully!");
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to update company");
    }
  };

  if (error && !company) {
    return (
      <div className="page-container text-center mt-5">
        <div className="alert alert-danger">{error}</div>
        <Link to="/companies" className="btn btn-secondary">Back to Companies</Link>
      </div>
    );
  }

  if (!company) return <div className="loading">Loading company details...</div>;

  // Find placement drives for this company
  const companyDrives = drives.filter(
    (d) => d.company?._id === company._id || d.company?.companyId === company.companyId
  );

  return (
    <div className="page-container company-detail-page" data-testid="company-detail-page">
      <div className="mb-3">
        <Link to="/companies" className="text-secondary">
          &larr; Back to Companies Directory
        </Link>
      </div>

      <div className="detail-header card mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div>
            <h1>{company.name}</h1>
            <p className="text-muted mb-0">ID: {company.companyId} | Job Role: {company.role}</p>
          </div>
          <div className="d-flex align-items-center">
            <span className={`badge badge-${company.status} mr-2`}>{company.status}</span>
            {isStaff && !editing && (
              <button
                className="btn btn-outline-primary"
                onClick={() => setEditing(true)}
                data-testid="edit-company-btn"
              >
                Edit Company
              </button>
            )}
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {editing && isStaff ? (
        <form onSubmit={handleUpdate} className="form-card mb-4" data-testid="edit-company-form">
          <h3>Edit Company Profile</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Company Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                data-testid="edit-name"
              />
            </div>
            <div className="form-group">
              <label>Job Role *</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                data-testid="edit-role"
              />
            </div>
            <div className="form-group">
              <label>Package (LPA) *</label>
              <input
                type="number"
                step="0.1"
                value={pkg}
                onChange={(e) => setPkg(e.target.value)}
                required
                data-testid="edit-package"
              />
            </div>
            <div className="form-group">
              <label>Minimum CGPA *</label>
              <input
                type="number"
                step="0.01"
                value={minCgpa}
                onChange={(e) => setMinCgpa(e.target.value)}
                required
                data-testid="edit-cgpa"
              />
            </div>
            <div className="form-group">
              <label>Tentative Drive Date</label>
              <input
                type="date"
                value={driveDate}
                onChange={(e) => setDriveDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="form-group">
              <label>Eligible Departments (comma separated)</label>
              <input
                type="text"
                value={eligibleDepts}
                onChange={(e) => setEligibleDepts(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-3">
            <button type="submit" className="btn btn-success mr-2" data-testid="save-company-btn">
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
            <h3>Company Info Summary</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Company ID:</span>
                <span className="info-value">{company.companyId}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Job Role:</span>
                <span className="info-value">{company.role || "N/A"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Annual Package:</span>
                <span className="info-value">{company.package ? `${company.package} LPA` : "N/A"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Minimum CGPA:</span>
                <span className="info-value">{company.minimumCgpa}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Drive Date:</span>
                <span className="info-value">{company.driveDate ? new Date(company.driveDate).toLocaleDateString() : "N/A"}</span>
              </div>
            </div>
            <div className="skills-container mt-3">
              <span className="info-label">Eligible Departments:</span>
              <div className="skills-tags mt-2">
                {company.eligibleDepartments && company.eligibleDepartments.length > 0 ? (
                  company.eligibleDepartments.map((dept) => (
                    <span key={dept} className="skill-tag badge badge-info">
                      {dept}
                    </span>
                  ))
                ) : (
                  <span className="text-muted">All Departments Eligible</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drives section */}
      <div className="card">
        <div className="card-header">
          <h3>Drives Hosted ({companyDrives.length})</h3>
        </div>
        <div className="card-body">
          {companyDrives.length === 0 ? (
            <p className="text-muted text-center py-2">No drives hosted for this company yet.</p>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Drive ID</th>
                    <th>Drive Title</th>
                    <th>Mode</th>
                    <th>Location</th>
                    <th>Deadline</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {companyDrives.map((d) => (
                    <tr key={d._id || d.driveId}>
                      <td>{d.driveId}</td>
                      <td>
                        <strong>{d.title}</strong>
                      </td>
                      <td>{d.mode}</td>
                      <td>{d.location || "N/A"}</td>
                      <td>{d.registrationDeadline ? new Date(d.registrationDeadline).toLocaleDateString() : "N/A"}</td>
                      <td>
                        <span className={`badge badge-${d.status}`}>{d.status}</span>
                      </td>
                      <td>
                        <Link to={`/drives/${d.driveId}`} className="btn btn-sm btn-outline-primary">
                          Details
                        </Link>
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

export default CompanyDetail;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMovie } from "../context/MovieContext";

const Companies = () => {
  const { loading, user, companies, addCompany, removeCompany } = useMovie();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [companyId, setCompanyId] = useState("");
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

  const handleAddCompany = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!companyId || !name || !role || !pkg || !minCgpa) {
      setError("Please fill in all required fields");
      return;
    }

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
      await addCompany({
        companyId,
        name,
        role,
        package: packageVal,
        minimumCgpa: cgpaVal,
        eligibleDepartments: deptsArray,
        driveDate: driveDate || null,
        status,
      });
      setSuccess("Company profile created successfully!");
      setCompanyId("");
      setName("");
      setRole("");
      setPkg("");
      setMinCgpa("");
      setEligibleDepts("");
      setDriveDate("");
      setShowAddForm(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to create company");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this company profile? This might affect drives and applications.")) {
      try {
        await removeCompany(id);
        setSuccess("Company deleted successfully");
      } catch (err) {
        setError("Failed to delete company");
      }
    }
  };

  if (loading) return <div className="loading">Loading company profiles...</div>;

  const filteredCompanies = companies.filter((c) => {
    const matchesSearch =
      !search ||
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.role?.toLowerCase().includes(search.toLowerCase()) ||
      c.companyId?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = !statusFilter || c.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="page-container" data-testid="companies-page">
      <div className="page-header d-flex justify-content-between align-items-center mb-4">
        <h1>Participating Companies</h1>
        {isStaff && (
          <button
            className="btn btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
            data-testid="add-company-btn"
          >
            {showAddForm ? "Cancel" : "Add Company"}
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showAddForm && isStaff && (
        <form onSubmit={handleAddCompany} className="form-card mb-4" data-testid="company-form">
          <h3>Add New Company Profile</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Company ID *</label>
              <input
                type="text"
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                required
                placeholder="e.g. CMP501"
                data-testid="input-company-id"
              />
            </div>
            <div className="form-group">
              <label>Company Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. TechNova"
                data-testid="input-company-name"
              />
            </div>
            <div className="form-group">
              <label>Job Role *</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
                placeholder="e.g. Software Engineer, ML Engineer"
                data-testid="input-company-role"
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
                placeholder="LPA package"
                data-testid="input-company-package"
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
                placeholder="e.g. 6.5"
                data-testid="input-company-cgpa"
              />
            </div>
            <div className="form-group">
              <label>Eligible Departments (comma separated)</label>
              <input
                type="text"
                value={eligibleDepts}
                onChange={(e) => setEligibleDepts(e.target.value)}
                placeholder="CSE, ECE, EEE"
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
          </div>
          <button type="submit" className="btn btn-success mt-3" data-testid="save-company-btn">
            Save Company
          </button>
        </form>
      )}

      {/* Filters Box */}
      <div className="filters-card card mb-4">
        <h3>Filter & Search</h3>
        <div className="filters-grid select-3-cols">
          <div className="form-group">
            <label>Search Name/Role/ID</label>
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Companies Table */}
      <div className="table-container">
        <table className="data-table" data-testid="companies-table">
          <thead>
            <tr>
              <th>Company ID</th>
              <th>Company Name</th>
              <th>Job Role</th>
              <th>Package (LPA)</th>
              <th>Min CGPA</th>
              <th>Eligible Departments</th>
              <th>Drive Date</th>
              <th>Status</th>
              {isStaff && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.length === 0 ? (
              <tr>
                <td colSpan={isStaff ? 9 : 8} className="text-center">
                  No matching company records found.
                </td>
              </tr>
            ) : (
              filteredCompanies.map((c) => (
                <tr key={c._id || c.companyId} data-testid={`company-row-${c.companyId}`}>
                  <td>
                    <Link to={`/companies/${c.companyId}`} className="text-primary font-bold">
                      {c.companyId}
                    </Link>
                  </td>
                  <td>{c.name}</td>
                  <td>{c.role}</td>
                  <td>{c.package} LPA</td>
                  <td>{c.minimumCgpa}</td>
                  <td>
                    {c.eligibleDepartments && c.eligibleDepartments.length > 0 ? (
                      c.eligibleDepartments.map((d) => (
                        <span key={d} className="badge badge-info mr-1">
                          {d}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted">All</span>
                    )}
                  </td>
                  <td>{c.driveDate ? new Date(c.driveDate).toLocaleDateString() : "N/A"}</td>
                  <td>
                    <span className={`badge badge-${c.status}`}>{c.status}</span>
                  </td>
                  {isStaff && (
                    <td>
                      <div className="action-buttons">
                        <Link to={`/companies/${c.companyId}`} className="btn btn-sm btn-outline-primary mr-1">
                          View
                        </Link>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(c._id || c.companyId)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Companies;

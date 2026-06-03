import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMovie } from "../context/MovieContext";

const Students = () => {
  const { loading, user, students, addStudent, removeStudent } = useMovie();

  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [minCgpa, setMinCgpa] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [phone, setPhone] = useState("");
  const [skills, setSkills] = useState("");
  const [gradYear, setGradYear] = useState("2026");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isStaff = user?.role === "admin" || user?.role === "placement_officer";

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!studentId || !name || !email || !department || !cgpa || !phone) {
      setError("Please fill in all required fields");
      return;
    }

    const parsedCgpa = parseFloat(cgpa);
    if (isNaN(parsedCgpa) || parsedCgpa < 0 || parsedCgpa > 10) {
      setError("CGPA must be a number between 0 and 10");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    if (phone.trim().length < 10) {
      setError("Phone number must be at least 10 digits");
      return;
    }

    const skillsArray = skills
      ? skills.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    try {
      await addStudent({
        studentId,
        name,
        email,
        department,
        cgpa: parsedCgpa,
        phone,
        skills: skillsArray,
        graduationYear: parseInt(gradYear) || 2026,
        status: "active",
      });
      setSuccess("Student created successfully!");
      setStudentId("");
      setName("");
      setEmail("");
      setDepartment("");
      setCgpa("");
      setPhone("");
      setSkills("");
      setShowAddForm(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to create student");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student profile?")) {
      try {
        await removeStudent(id);
        setSuccess("Student deleted successfully");
      } catch (err) {
        setError("Failed to delete student");
      }
    }
  };

  if (loading) return <div className="loading">Loading student records...</div>;

  // Filter students array in memory
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      !search ||
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId?.toLowerCase().includes(search.toLowerCase());

    const matchesDept = !deptFilter || s.department?.toUpperCase() === deptFilter.toUpperCase();
    const matchesStatus = !statusFilter || s.status === statusFilter;
    const matchesCgpa = !minCgpa || s.cgpa >= parseFloat(minCgpa);

    return matchesSearch && matchesDept && matchesStatus && matchesCgpa;
  });

  // Get unique departments for filter dropdown
  const departments = [...new Set(students.map((s) => s.department).filter(Boolean))];

  return (
    <div className="page-container" data-testid="students-page">
      <div className="page-header d-flex justify-content-between align-items-center mb-4">
        <h1>Students Directory</h1>
        {isStaff && (
          <button
            className="btn btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
            data-testid="add-student-btn"
          >
            {showAddForm ? "Cancel" : "Add Student"}
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showAddForm && isStaff && (
        <form onSubmit={handleAddStudent} className="form-card mb-4" data-testid="student-form">
          <h3>Create New Student Profile</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Student ID *</label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required
                placeholder="e.g. STU1001"
                data-testid="input-student-id"
              />
            </div>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Lakshit Manne"
                data-testid="input-student-name"
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="e.g. student@test.com"
                data-testid="input-student-email"
              />
            </div>
            <div className="form-group">
              <label>Department *</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
                placeholder="e.g. CIVIL, CSE, ECE"
                data-testid="input-student-dept"
              />
            </div>
            <div className="form-group">
              <label>CGPA *</label>
              <input
                type="number"
                step="0.01"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                required
                placeholder="e.g. 8.5"
                data-testid="input-student-cgpa"
              />
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="10 digit number"
                data-testid="input-student-phone"
              />
            </div>
            <div className="form-group">
              <label>Graduation Year</label>
              <input
                type="number"
                value={gradYear}
                onChange={(e) => setGradYear(e.target.value)}
                placeholder="e.g. 2026"
              />
            </div>
            <div className="form-group">
              <label>Skills (comma separated)</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="React, Node.js, AWS"
              />
            </div>
          </div>
          <button type="submit" className="btn btn-success mt-3" data-testid="save-student-btn">
            Save Student Profile
          </button>
        </form>
      )}

      {/* Filters Box */}
      <div className="filters-card card mb-4">
        <h3>Filter & Search</h3>
        <div className="filters-grid">
          <div className="form-group">
            <label>Search Name/Email/ID</label>
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
            <label>Department</label>
            <select
              className="form-control"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              data-testid="filter-dept"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Min CGPA</label>
            <input
              type="number"
              step="0.1"
              className="form-control"
              value={minCgpa}
              onChange={(e) => setMinCgpa(e.target.value)}
              placeholder="Minimum CGPA"
              data-testid="filter-cgpa"
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
              <option value="placed">Placed</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table list */}
      <div className="table-container">
        <table className="data-table" data-testid="students-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>CGPA</th>
              <th>Phone</th>
              <th>Status</th>
              {isStaff && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={isStaff ? 8 : 7} className="text-center">
                  No matching student records found.
                </td>
              </tr>
            ) : (
              filteredStudents.map((s) => (
                <tr key={s._id || s.studentId} data-testid={`student-row-${s.studentId}`}>
                  <td>
                    <Link to={`/students/${s.studentId}`} className="text-primary font-bold">
                      {s.studentId}
                    </Link>
                  </td>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.department}</td>
                  <td>{s.cgpa}</td>
                  <td>{s.phone || "N/A"}</td>
                  <td>
                    <span className={`badge badge-${s.status}`}>{s.status}</span>
                  </td>
                  {isStaff && (
                    <td>
                      <div className="action-buttons">
                        <Link to={`/students/${s.studentId}`} className="btn btn-sm btn-outline-primary mr-1">
                          View
                        </Link>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(s._id || s.studentId)}
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

export default Students;

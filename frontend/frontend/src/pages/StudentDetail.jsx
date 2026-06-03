import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useMovie } from "../context/MovieContext";
import api from "../api/api";

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, students, editStudent, applications, interviews } = useMovie();

  const [student, setStudent] = useState(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [cgpa, setCgpa] = useState("");
  const [phone, setPhone] = useState("");
  const [skills, setSkills] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [status, setStatus] = useState("active");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isStaff = user?.role === "admin" || user?.role === "placement_officer";

  useEffect(() => {
    // Look up in context first
    const found = students.find((s) => s.studentId === id || s._id === id);
    if (found) {
      setStudent(found);
      setName(found.name || "");
      setEmail(found.email || "");
      setDepartment(found.department || "");
      setCgpa(found.cgpa || "");
      setPhone(found.phone || "");
      setSkills(found.skills ? found.skills.join(", ") : "");
      setGradYear(found.graduationYear || "");
      setStatus(found.status || "active");
    } else {
      // Fetch from API
      api.getStudent(id)
        .then((data) => {
          setStudent(data);
          setName(data.name || "");
          setEmail(data.email || "");
          setDepartment(data.department || "");
          setCgpa(data.cgpa || "");
          setPhone(data.phone || "");
          setSkills(data.skills ? data.skills.join(", ") : "");
          setGradYear(data.graduationYear || "");
          setStatus(data.status || "active");
        })
        .catch(() => {
          setError("Student not found");
        });
    }
  }, [id, students]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const parsedCgpa = parseFloat(cgpa);
    if (isNaN(parsedCgpa) || parsedCgpa < 0 || parsedCgpa > 10) {
      setError("CGPA must be a number between 0 and 10");
      return;
    }

    const skillsArray = skills
      ? skills.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    try {
      const updated = await editStudent(student._id || student.studentId, {
        name,
        email,
        department,
        cgpa: parsedCgpa,
        phone,
        skills: skillsArray,
        graduationYear: parseInt(gradYear) || 2026,
        status,
      });
      setStudent(updated);
      setSuccess("Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to update profile");
    }
  };

  if (error && !student) {
    return (
      <div className="page-container text-center mt-5">
        <div className="alert alert-danger">{error}</div>
        <Link to="/students" className="btn btn-secondary">Back to Students</Link>
      </div>
    );
  }

  if (!student) return <div className="loading">Loading student details...</div>;

  // Find applications submitted by this student
  const studentApps = applications.filter(
    (app) => app.student?._id === student._id || app.student?.studentId === student.studentId
  );

  // Find interviews scheduled for this student
  const studentIntvs = interviews.filter(
    (intv) =>
      intv.application?.student?._id === student._id ||
      intv.application?.student?.studentId === student.studentId
  );

  return (
    <div className="page-container student-detail-page" data-testid="student-detail-page">
      <div className="mb-3">
        <Link to="/students" className="text-secondary">
          &larr; Back to Students Directory
        </Link>
      </div>

      <div className="detail-header card mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div>
            <h1>{student.name}</h1>
            <p className="text-muted mb-0">ID: {student.studentId} | Department: {student.department}</p>
          </div>
          <div className="d-flex align-items-center">
            <span className={`badge badge-${student.status} mr-2`}>{student.status}</span>
            {isStaff && !editing && (
              <button
                className="btn btn-outline-primary"
                onClick={() => setEditing(true)}
                data-testid="edit-student-btn"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {editing && isStaff ? (
        <form onSubmit={handleUpdate} className="form-card mb-4" data-testid="edit-student-form">
          <h3>Edit Student Profile</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                data-testid="edit-name"
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="edit-email"
              />
            </div>
            <div className="form-group">
              <label>Department *</label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
                data-testid="edit-dept"
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
                data-testid="edit-cgpa"
              />
            </div>
            <div className="form-group">
              <label>Phone *</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                data-testid="edit-phone"
              />
            </div>
            <div className="form-group">
              <label>Graduation Year</label>
              <input
                type="number"
                value={gradYear}
                onChange={(e) => setGradYear(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="active">Active</option>
                <option value="placed">Placed</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="form-group">
              <label>Skills (comma separated)</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-3">
            <button type="submit" className="btn btn-success mr-2" data-testid="save-student-btn">
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
            <h3>Profile Summary</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Student ID:</span>
                <span className="info-value">{student.studentId}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">{student.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Department:</span>
                <span className="info-value">{student.department}</span>
              </div>
              <div className="info-item">
                <span className="info-label">CGPA:</span>
                <span className="info-value">{student.cgpa}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Phone:</span>
                <span className="info-value">{student.phone || "N/A"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Graduation Year:</span>
                <span className="info-value">{student.graduationYear || "N/A"}</span>
              </div>
            </div>
            <div className="skills-container mt-3">
              <span className="info-label">Skills:</span>
              <div className="skills-tags mt-2">
                {student.skills && student.skills.length > 0 ? (
                  student.skills.map((skill) => (
                    <span key={skill} className="skill-tag badge badge-info">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-muted">No skills listed</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Applications section */}
      <div className="card mb-4">
        <div className="card-header">
          <h3>Applications Submitted ({studentApps.length})</h3>
        </div>
        <div className="card-body">
          {studentApps.length === 0 ? (
            <p className="text-muted text-center py-2">This student hasn't applied to any drives yet.</p>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Application ID</th>
                    <th>Recruitment Drive</th>
                    <th>Applied At</th>
                    <th>Current Round</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {studentApps.map((app) => (
                    <tr key={app._id || app.applicationId}>
                      <td>
                        <Link to={`/applications/${app.applicationId}`} className="text-primary font-bold">
                          {app.applicationId}
                        </Link>
                      </td>
                      <td>{app.drive?.title || "Drive"}</td>
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

      {/* Interviews section */}
      <div className="card">
        <div className="card-header">
          <h3>Interviews Timeline ({studentIntvs.length})</h3>
        </div>
        <div className="card-body">
          {studentIntvs.length === 0 ? (
            <p className="text-muted text-center py-2">No interviews scheduled yet.</p>
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
                  </tr>
                </thead>
                <tbody>
                  {studentIntvs.map((intv) => (
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

export default StudentDetail;

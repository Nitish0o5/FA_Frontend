import React from "react";
import { useMovie } from "../context/MovieContext";

const Profile = () => {
  const { user, students } = useMovie();

  if (!user) return <div className="loading">Please log in to view profile.</div>;

  // If user is a student, let's find their student details using their email
  const studentDetails = user.role === "student"
    ? students.find(s => s.email?.toLowerCase() === user.email?.toLowerCase())
    : null;

  return (
    <div className="page-container" data-testid="profile-page">
      <h1>My Profile</h1>
      <div className="profile-card card">
        <div className="avatar-circle">
          {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
        </div>
        <h2>{user.name || "User Name"}</h2>
        <p className="profile-email">{user.email}</p>
        <span className={`badge badge-role role-${user.role}`}>{user.role}</span>

        {studentDetails && (
          <div className="student-profile-info mt-4">
            <hr />
            <h3 className="mb-3">Student Details</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Student ID:</span>
                <span className="info-value">{studentDetails.studentId}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Department:</span>
                <span className="info-value">{studentDetails.department}</span>
              </div>
              <div className="info-item">
                <span className="info-label">CGPA:</span>
                <span className="info-value">{studentDetails.cgpa}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Phone:</span>
                <span className="info-value">{studentDetails.phone}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Graduation Year:</span>
                <span className="info-value">{studentDetails.graduationYear}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Status:</span>
                <span className={`badge badge-${studentDetails.status}`}>{studentDetails.status}</span>
              </div>
            </div>
            {studentDetails.skills && studentDetails.skills.length > 0 && (
              <div className="skills-container mt-3">
                <span className="info-label">Skills:</span>
                <div className="skills-tags mt-2">
                  {studentDetails.skills.map((skill) => (
                    <span key={skill} className="skill-tag badge badge-info">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

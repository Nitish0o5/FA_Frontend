import React, { useState } from "react";
import { useMovie } from "../context/MovieContext";

const Interviews = () => {
  const {
    loading,
    user,
    interviews,
    applications,
    addInterview,
    editInterview,
    removeInterview,
  } = useMovie();

  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState("");
  const [interviewer, setInterviewer] = useState("");
  const [round, setRound] = useState("Technical");
  const [interviewDate, setInterviewDate] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Edit states
  const [editingId, setEditingId] = useState(null);
  const [editResult, setEditResult] = useState("");
  const [editFeedback, setEditFeedback] = useState("");
  const [editStatus, setEditStatus] = useState("");

  const isStaff = user?.role === "admin" || user?.role === "placement_officer";

  const handleSchedule = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedAppId || !interviewer || !interviewDate) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await addInterview({
        application: selectedAppId,
        interviewer,
        round,
        interviewDate,
        status: "scheduled",
        result: "pending",
      });
      setSuccess("Interview scheduled successfully!");
      setSelectedAppId("");
      setInterviewer("");
      setInterviewDate("");
      setShowScheduleForm(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to schedule interview");
    }
  };

  const handleSaveResult = async (id) => {
    setError("");
    setSuccess("");
    try {
      await editInterview(id, {
        result: editResult,
        feedback: editFeedback,
        status: editStatus || "completed",
      });
      setSuccess("Interview updated successfully!");
      setEditingId(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to update interview");
    }
  };

  const startEdit = (intv) => {
    setEditingId(intv._id || intv.interviewId);
    setEditResult(intv.result || "pending");
    setEditFeedback(intv.feedback || "");
    setEditStatus(intv.status || "scheduled");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this interview schedule?")) {
      try {
        await removeInterview(id);
        setSuccess("Interview schedule deleted");
      } catch (err) {
        setError("Failed to delete interview");
      }
    }
  };

  if (loading) return <div className="loading">Loading interviews...</div>;

  // Filter applications that are eligible (not rejected and not already selected)
  const eligibleApps = applications.filter(
    (app) => app.status !== "rejected" && app.status !== "selected"
  );

  return (
    <div className="page-container" data-testid="interviews-page">
      <div className="page-header">
        <h1>Interviews</h1>
        {isStaff && (
          <button
            className="btn btn-primary"
            onClick={() => setShowScheduleForm(!showScheduleForm)}
            data-testid="schedule-interview-btn"
          >
            {showScheduleForm ? "Cancel" : "Schedule Interview"}
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      {showScheduleForm && isStaff && (
        <form onSubmit={handleSchedule} className="form-card mb-4" data-testid="schedule-form">
          <h3>Schedule New Interview</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Select Application (Student - Company)</label>
              <select
                value={selectedAppId}
                onChange={(e) => setSelectedAppId(e.target.value)}
                required
                data-testid="select-application"
              >
                <option value="">-- Select Application --</option>
                {eligibleApps.map((app) => (
                  <option key={app._id} value={app._id}>
                    {app.student?.name} - {app.drive?.title || "Drive"} ({app.status})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Interviewer Name</label>
              <input
                type="text"
                value={interviewer}
                onChange={(e) => setInterviewer(e.target.value)}
                required
                placeholder="Interviewer name"
                data-testid="input-interviewer"
              />
            </div>

            <div className="form-group">
              <label>Interview Round</label>
              <select
                value={round}
                onChange={(e) => setRound(e.target.value)}
                data-testid="select-round"
              >
                <option value="Aptitude">Aptitude</option>
                <option value="Technical">Technical</option>
                <option value="HR">HR</option>
                <option value="Managerial">Managerial</option>
              </select>
            </div>

            <div className="form-group">
              <label>Date & Time</label>
              <input
                type="datetime-local"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                required
                data-testid="input-date"
              />
            </div>
          </div>
          <button type="submit" className="btn btn-success mt-3" data-testid="submit-schedule-btn">
            Save Interview Schedule
          </button>
        </form>
      )}

      <div className="table-container">
        <table className="data-table" data-testid="interviews-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Student</th>
              <th>Company</th>
              <th>Round</th>
              <th>Interviewer</th>
              <th>Date</th>
              <th>Status</th>
              <th>Result</th>
              {isStaff && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {interviews.length === 0 ? (
              <tr>
                <td colSpan={isStaff ? 9 : 8} className="text-center">
                  No interviews scheduled yet.
                </td>
              </tr>
            ) : (
              interviews.map((intv) => {
                const isEditing = editingId === (intv._id || intv.interviewId);
                const app = intv.application || {};
                const student = app.student || {};
                const drive = app.drive || {};
                const company = drive.company || {};

                return (
                  <tr key={intv._id || intv.interviewId} data-testid={`interview-row-${intv.interviewId}`}>
                    <td>{intv.interviewId}</td>
                    <td>
                      <strong>{student.name || "N/A"}</strong>
                      <div className="text-muted small">{student.studentId}</div>
                    </td>
                    <td>
                      <strong>{company.name || "N/A"}</strong>
                      <div className="text-muted small">{drive.title}</div>
                    </td>
                    <td>{intv.round}</td>
                    <td>{intv.interviewer}</td>
                    <td>{intv.interviewDate ? new Date(intv.interviewDate).toLocaleString() : "N/A"}</td>
                    <td>
                      {isEditing ? (
                        <select
                          className="form-control-sm"
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                        >
                          <option value="scheduled">Scheduled</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      ) : (
                        <span className={`badge badge-${intv.status}`}>{intv.status}</span>
                      )}
                    </td>
                    <td>
                      {isEditing ? (
                        <div className="edit-result-container">
                          <select
                            className="form-control-sm mb-1"
                            value={editResult}
                            onChange={(e) => setEditResult(e.target.value)}
                          >
                            <option value="pending">Pending</option>
                            <option value="pass">Pass</option>
                            <option value="fail">Fail</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Feedback"
                            className="form-control-sm"
                            value={editFeedback}
                            onChange={(e) => setEditFeedback(e.target.value)}
                          />
                        </div>
                      ) : (
                        <div>
                          <span className={`badge badge-${intv.result}`}>{intv.result}</span>
                          {intv.feedback && <p className="feedback-text small text-muted">{intv.feedback}</p>}
                        </div>
                      )}
                    </td>
                    {isStaff && (
                      <td>
                        {isEditing ? (
                          <div className="action-buttons">
                            <button
                              className="btn btn-sm btn-success mr-1"
                              onClick={() => handleSaveResult(intv._id || intv.interviewId)}
                              data-testid="save-result-btn"
                            >
                              Save
                            </button>
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => setEditingId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="action-buttons">
                            <button
                              className="btn btn-sm btn-outline-primary mr-1"
                              onClick={() => startEdit(intv)}
                              data-testid="edit-result-btn"
                            >
                              Edit Result
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(intv._id || intv.interviewId)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    )}
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

export default Interviews;

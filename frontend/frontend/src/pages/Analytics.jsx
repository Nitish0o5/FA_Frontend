import React from "react";
import { useMovie } from "../context/MovieContext";

const Analytics = () => {
  const { loading, analytics } = useMovie();

  if (loading) return <div className="loading">Loading placement analytics...</div>;

  const { placements = {}, departments = [], companies = [] } = analytics;

  return (
    <div className="page-container analytics-page" data-testid="analytics-page">
      <h1>Placement Analytics Dashboard</h1>
      <p className="text-muted mb-4">Visual breakdown of the current placement session</p>

      {/* Aggregate placements breakdown */}
      <div className="card mb-4">
        <div className="card-header">
          <h3>Overall Status Breakdown</h3>
        </div>
        <div className="card-body">
          <div className="analytics-breakdown-grid">
            <div className="breakdown-item bg-applied">
              <span className="breakdown-label">Total Applications</span>
              <span className="breakdown-value">{placements.total || 0}</span>
            </div>
            <div className="breakdown-item bg-shortlisted">
              <span className="breakdown-label">Shortlisted</span>
              <span className="breakdown-value">{placements.shortlisted || 0}</span>
            </div>
            <div className="breakdown-item bg-selected">
              <span className="breakdown-label">Selected / Placed</span>
              <span className="breakdown-value text-success">{placements.selected || 0}</span>
            </div>
            <div className="breakdown-item bg-rejected">
              <span className="breakdown-label">Rejected</span>
              <span className="breakdown-value text-danger">{placements.rejected || 0}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Department-wise Placements Card */}
        <div className="card mb-4">
          <div className="card-header">
            <h3>Department Placement Performance</h3>
          </div>
          <div className="card-body">
            {departments.length === 0 ? (
              <p className="text-muted text-center py-3">No department statistics available</p>
            ) : (
              <div className="dept-stats-list">
                {departments.map((dept) => (
                  <div key={dept.department} className="dept-stat-item mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span className="font-bold">{dept.department}</span>
                      <span>
                        {dept.placed} / {dept.total} Placed ({dept.percentage}%)
                      </span>
                    </div>
                    <div className="progress-bar-container">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${dept.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Company Placement Metrics Card */}
        <div className="card mb-4">
          <div className="card-header">
            <h3>Company Performance & Package Highlights</h3>
          </div>
          <div className="card-body">
            {companies.length === 0 ? (
              <p className="text-muted text-center py-3">No company metrics available</p>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Company</th>
                      <th>Job Role</th>
                      <th>Package (LPA)</th>
                      <th>Applicants</th>
                      <th>Selected</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies.map((comp) => (
                      <tr key={comp.companyId}>
                        <td>
                          <strong>{comp.name}</strong>
                        </td>
                        <td>{comp.role}</td>
                        <td className="font-bold text-success">{comp.package} LPA</td>
                        <td>{comp.participationCount}</td>
                        <td>{comp.selectedStudents}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

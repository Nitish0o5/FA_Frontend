import React from 'react';
import { useMovie } from '../context/MovieContext';
import { Link } from 'react-router-dom';

const Applications = () => {
  const { loading, applications } = useMovie();

  if (loading) return <p>Loading...</p>;

  return (
    <div className="app-container">
      <h1>Applications</h1>
      <ul>
        {applications.map(a => (
          <li key={a.applicationId}><Link to={`/applications/${a.applicationId}`}>{a.applicationId} - {a.studentId}</Link></li>
        ))}
      </ul>
    </div>
  );
};

export default Applications;

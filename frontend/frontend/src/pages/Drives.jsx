import React from 'react';
import { useMovie } from '../context/MovieContext';
import { Link } from 'react-router-dom';

const Drives = () => {
  const { loading, drives } = useMovie();

  if (loading) return <p>Loading...</p>;

  return (
    <div className="app-container">
      <h1>Drives</h1>
      <ul>
        {drives.map(d => (
          <li key={d.driveId}><Link to={`/drives/${d.driveId}`}>{d.driveId} - {d.title || d.name}</Link></li>
        ))}
      </ul>
    </div>
  );
};

export default Drives;

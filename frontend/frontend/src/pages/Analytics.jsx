import React from 'react';
import { useMovie } from '../context/MovieContext';

const Analytics = () => {
  const { loading, students, companies, drives, applications, interviews } = useMovie();

  if (loading) return <p>Loading...</p>;

  return (
    <div className="app-container">
      <h1>Analytics</h1>
      <p>Students: {students.length}</p>
      <p>Companies: {companies.length}</p>
      <p>Drives: {drives.length}</p>
      <p>Applications: {applications.length}</p>
      <p>Interviews: {interviews.length}</p>
    </div>
  );
};

export default Analytics;

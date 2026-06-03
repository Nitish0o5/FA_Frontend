import React from 'react';
import { useMovie } from '../context/MovieContext';

const Dashboard = () => {
  const { loading, students, companies, drives, applications, interviews } = useMovie();

  if (loading) return <p>Loading...</p>;

  return (
    <div className="app-container">
      <h1>Dashboard</h1>
      <ul>
        <li>Students: {students.length}</li>
        <li>Companies: {companies.length}</li>
        <li>Drives: {drives.length}</li>
        <li>Applications: {applications.length}</li>
        <li>Interviews: {interviews.length}</li>
      </ul>
    </div>
  );
};

export default Dashboard;

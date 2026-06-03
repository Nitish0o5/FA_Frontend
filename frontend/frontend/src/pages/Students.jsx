import React from 'react';
import { useMovie } from '../context/MovieContext';
import { Link } from 'react-router-dom';

const Students = () => {
  const { loading, students } = useMovie();

  if (loading) return <p>Loading...</p>;

  return (
    <div className="app-container">
      <h1>Students</h1>
      <ul>
        {students.map(s => (
          <li key={s.studentId}><Link to={`/students/${s.studentId}`}>{s.studentId} - {s.name || s.fullName || s.name}</Link></li>
        ))}
      </ul>
    </div>
  );
};

export default Students;

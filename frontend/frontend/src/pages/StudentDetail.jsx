import React from 'react';
import { useParams } from 'react-router-dom';
import { useMovie } from '../context/MovieContext';

const StudentDetail = () => {
  const { id } = useParams();
  const { loading, students } = useMovie();

  if (loading) return <p>Loading...</p>;

  const student = students.find(s => s.studentId === id);
  if (!student) return <p>Student not found</p>;

  return (
    <div className="app-container">
      <h1>{student.name || student.fullName || student.studentId}</h1>
      <pre>{JSON.stringify(student, null, 2)}</pre>
    </div>
  );
};

export default StudentDetail;

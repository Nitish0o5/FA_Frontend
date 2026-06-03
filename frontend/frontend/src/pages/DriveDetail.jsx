import React from 'react';
import { useParams } from 'react-router-dom';
import { useMovie } from '../context/MovieContext';

const DriveDetail = () => {
  const { id } = useParams();
  const { loading, drives } = useMovie();

  if (loading) return <p>Loading...</p>;

  const drive = drives.find(d => d.driveId === id);
  if (!drive) return <p>Drive not found</p>;

  return (
    <div className="app-container">
      <h1>{drive.title || drive.driveId}</h1>
      <pre>{JSON.stringify(drive, null, 2)}</pre>
    </div>
  );
};

export default DriveDetail;

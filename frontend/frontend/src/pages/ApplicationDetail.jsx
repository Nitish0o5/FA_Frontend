import React from 'react';
import { useParams } from 'react-router-dom';
import { useMovie } from '../context/MovieContext';

const ApplicationDetail = () => {
  const { id } = useParams();
  const { loading, applications } = useMovie();

  if (loading) return <p>Loading...</p>;

  const app = applications.find(a => a.applicationId === id);
  if (!app) return <p>Application not found</p>;

  return (
    <div className="app-container">
      <h1>{app.applicationId}</h1>
      <pre>{JSON.stringify(app, null, 2)}</pre>
    </div>
  );
};

export default ApplicationDetail;

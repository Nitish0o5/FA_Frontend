import React from 'react';
import { useMovie } from '../context/MovieContext';
import { Link } from 'react-router-dom';

const Companies = () => {
  const { loading, companies } = useMovie();

  if (loading) return <p>Loading...</p>;

  return (
    <div className="app-container">
      <h1>Companies</h1>
      <ul>
        {companies.map(c => (
          <li key={c.companyId}><Link to={`/companies/${c.companyId}`}>{c.companyId} - {c.name}</Link></li>
        ))}
      </ul>
    </div>
  );
};

export default Companies;

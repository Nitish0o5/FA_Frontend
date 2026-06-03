import React from 'react';
import { useParams } from 'react-router-dom';
import { useMovie } from '../context/MovieContext';

const CompanyDetail = () => {
  const { id } = useParams();
  const { loading, companies } = useMovie();

  if (loading) return <p>Loading...</p>;

  const company = companies.find(c => c.companyId === id);
  if (!company) return <p>Company not found</p>;

  return (
    <div className="app-container">
      <h1>{company.name || company.companyId}</h1>
      <pre>{JSON.stringify(company, null, 2)}</pre>
    </div>
  );
};

export default CompanyDetail;

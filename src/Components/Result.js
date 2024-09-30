// src/Components/Result.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Result.css'; // Import the CSS file for styling

const Result = () => {
  const [elections, setElections] = useState([]);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await axios.get('http://localhost:8080/elections');
        setElections(response.data);
      } catch (error) {
        console.error('Failed to fetch election results:', error);
      }
    };

    fetchElections();
  }, []);

  return (
    <div className="result-container">
      <h2 className="result-title">Election Results</h2>
      {elections.length === 0 ? (
        <p className="no-results">No election results available.</p>
      ) : (
        <div className="table-wrapper">
          {elections.map((election) => (
            <div key={election.id} className="election-section">
              <h3 className="election-name">{election.name}</h3>
              <p className="election-date">Date: {election.date}</p>
              <table className="result-table">
                <thead>
                  <tr>
                    <th>Party Name</th>
                    <th>Candidate</th>
                    <th>Votes</th>
                  </tr>
                </thead>
                <tbody>
                  {election.parties.map((party) => (
                    <tr key={party.name}>
                      <td>{party.name}</td>
                      <td>{party.candidate}</td>
                      <td>{party.voteCount || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Result;

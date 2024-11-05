// src/Components/ResultEnd37.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Result.css'; // Import the CSS file for styling

const Result = () => {
  const [elections, setElections] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

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

  // Function to handle navigation to the graphical analysis page
  const handleGraphClick = () => {
    navigate('/resultgraph'); // Use navigate instead of history.push
  };

  return (
    <div className='resmainEnd37'>
      <div className="result-containerEnd37">
        <h2 className="result-titleEnd37">Election Results</h2>
        {/* Button for graphical analysis */}
        <button 
          className="view-graph-buttonEnd37" 
          onClick={handleGraphClick} // Add onClick handler
        >
          View Graphical Analysis
        </button>
        {elections.length === 0 ? (
          <p className="no-resultsEnd37">No election results available.</p>
        ) : (
          <div className="table-wrapperEnd37">
            {elections.map((election) => (
              <div key={election.id} className="election-sectionEnd37">
                <h3 className="election-nameEnd37">{election.name}</h3>
                <p className="election-dateEnd37">Date: {election.date}</p>
                <table className="result-tableEnd37">
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
    </div>
  );
};

export default Result;

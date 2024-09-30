// src/Components/UserDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserDashboard = ({ user }) => {
  const [elections, setElections] = useState([]);
  const [userElections, setUserElections] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is defined before proceeding
    if (!user || !user.id) {
      setError("User is not logged in or data is missing.");
      return;
    }

    // Fetch all elections
    const fetchElections = async () => {
      try {
        const response = await axios.get('http://localhost:3000/elections');
        setElections(response.data);
      } catch (err) {
        setError('Failed to fetch elections.');
      }
    };

    // Fetch user data and elections enabled for that user
    const fetchUserElections = async () => {
      try {
        const userResponse = await axios.get(`http://localhost:3000/users/${user.id}`);
        const enabledElectionIds = userResponse.data.enabledElections;

        // Filter elections based on the enabled elections for the user
        const filteredElections = elections.filter((election) =>
          enabledElectionIds.includes(election.id)
        );
        setUserElections(filteredElections);
      } catch (err) {
        setError('Failed to fetch user elections.');
      }
    };

    fetchElections();
    fetchUserElections();
  }, [user, elections]);

  const handleProceed = (electionId) => {
    navigate(`/vote/${electionId}`);
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="user-dashboard">
      <h1>Available Elections</h1>
      <ul>
        {userElections.map((election) => (
          <li key={election.id}>
            <h3>{election.name}</h3>
            <p>Date: {election.date}</p>
            <button onClick={() => handleProceed(election.id)}>Proceed to Election</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserDashboard;

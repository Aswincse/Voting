// src/Components/VotingPage.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const VotingPage = () => {
  const { electionId } = useParams();
  const [election, setElection] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // Get the logged-in user from local storage
  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem('user'));
    setUser(loggedUser);
  }, []);

  // Fetch the election details
  useEffect(() => {
    const fetchElection = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/elections/${electionId}`);
        setElection(response.data);
      } catch (err) {
        setError('Failed to fetch election details.');
      }
    };

    fetchElection();
  }, [electionId]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!election) {
    return <div>Loading...</div>;
  }

  if (user && !election.participants.includes(user.id)) {
    return <div>You are not authorized to vote in this election.</div>;
  }

  const handleVote = (party) => {
    // Implement voting logic here
    console.log(`Voting for ${party} in election ${election.name}`);
  };

  return (
    <div>
      <h1>{election.name}</h1>
      <h2>Parties:</h2>
      <ul>
        {election.parties.map((party) => (
          <li key={party}>
            {party}
            <button onClick={() => handleVote(party)}>Vote</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VotingPage;

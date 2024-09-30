// src/Components/VotingPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VotingPage = () => {
  const [elections, setElections] = useState([]);
  const [voteSubmitted, setVoteSubmitted] = useState(false);
  const [userVotes, setUserVotes] = useState([]); // Store votes submitted by the user
  const user = JSON.parse(localStorage.getItem('user')); // Get the logged-in user from local storage
  const navigate = useNavigate();

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await axios.get('http://localhost:8080/elections');
        const userElections = response.data.filter(election => election.participants.includes(user.id));
        setElections(userElections);
      } catch (error) {
        console.error('Error fetching elections:', error);
      }
    };

    const fetchUserVotes = async () => {
      try {
        const response = await axios.get('http://localhost:8080/votes'); // Get all the votes
        const votesByUser = response.data.filter(vote => vote.userId === user.id); // Filter votes made by the user
        setUserVotes(votesByUser); // Store them in the state
      } catch (error) {
        console.error('Error fetching votes:', error);
      }
    };

    fetchElections();
    fetchUserVotes(); // Fetch user's votes to track voting status
  }, [user.id]);

  const hasVoted = (electionId) => {
    return userVotes.some(vote => vote.electionId === electionId); // Check if user has already voted in the election
  };

  const handleVote = async (electionId, partyName, candidateName) => {
    if (hasVoted(electionId)) {
      alert('You have already voted in this election. Thank you!');
      return;
    }

    try {
      // Fetch the current election details
      const electionResponse = await axios.get(`http://localhost:8080/elections/${electionId}`);
      const electionData = electionResponse.data;

      // Update the party's vote count
      const updatedParties = electionData.parties.map((party) => {
        if (party.name === partyName) {
          return { ...party, voteCount: (party.voteCount || 0) + 1 }; // Increment vote count
        }
        return party;
      });

      // Update the election with the new vote count
      await axios.patch(`http://localhost:8080/elections/${electionId}`, {
        parties: updatedParties,
      });

      // Record the vote in the `/votes` endpoint
      await axios.post('http://localhost:8080/votes', {
        userId: user.id,
        electionId: electionId,
        party: partyName,
        candidate: candidateName,
      });

      alert('Vote submitted successfully!');
      setVoteSubmitted(true);
      navigate('/userdashboard');
    } catch (error) {
      console.error('Error submitting vote:', error);
      if (error.response) {
        alert(`Error: ${error.response.data.message || 'An error occurred while submitting your vote. Please try again.'}`);
      } else {
        alert('An error occurred. Please check your network connection.');
      }
    }
  };

  return (
    <div>
      <h2>Voting Page</h2>
      {elections.length === 0 ? (
        <p>No elections available for you to vote.</p>
      ) : (
        <ul>
          {elections.map((election) => (
            <li key={election.id}>
              <h3>{election.name}</h3>
              <p>Date: {election.date}</p>
              <h4>Parties:</h4>
              {hasVoted(election.id) ? (
                <p>Already voted, thank you!</p> // Display message if the user has already voted
              ) : (
                <ul>
                  {election.parties.map((party) => (
                    <li key={party.name}>
                      <strong>{party.name}</strong> - Candidate: {party.candidate}
                      <button onClick={() => handleVote(election.id, party.name, party.candidate)}>
                        Vote
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default VotingPage;

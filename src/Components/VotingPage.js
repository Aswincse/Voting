import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import MatchScore from './MatchScore'; // Import the MatchScore component
import './VotingPage.css';

const VotingPage = () => {
  const [election, setElection] = useState(null);
  const [voteSubmitted, setVoteSubmitted] = useState(false);
  const [userVotes, setUserVotes] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [userNeeds, setUserNeeds] = useState([]); // Default to an empty array
  const user = JSON.parse(localStorage.getItem('user')); // Get the logged-in user from local storage
  const navigate = useNavigate();
  const { electionId } = useParams(); // Extract electionId from the URL

  useEffect(() => {
    const fetchElection = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/elections/${electionId}`);
        setElection(response.data);
      } catch (error) {
        console.error('Error fetching election:', error);
      }
    };

    const fetchUserVotes = async () => {
      try {
        const response = await axios.get('http://localhost:8080/votes');
        const votesByUser = response.data.filter(vote => vote.userId === user.id);
        setUserVotes(votesByUser);
      } catch (error) {
        console.error('Error fetching votes:', error);
      }
    };

    // Fetch user profile data to set userNeeds (if applicable)
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/users/${user.id}`);
        setUserNeeds(response.data.needs); // Assuming the user profile has a `needs` field
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    // Fetch data
    fetchElection();
    fetchUserVotes();
    fetchUserProfile();

    setLoading(false); // Set loading to false when data is fetched
  }, [electionId, user.id]);

  const hasVoted = () => {
    return userVotes.some(vote => vote.electionId === electionId); // Check if the user has voted in this election
  };

  const handleVote = async (partyName, candidateName) => {
    if (hasVoted()) {
      alert('You have already voted in this election. Thank you!');
      return;
    }

    try {
      const updatedParties = election.parties.map((party) => {
        if (party.partyName === partyName) {
          return { ...party, voteCount: (party.voteCount || 0) + 1 };
        }
        return party;
      });

      await axios.patch(`http://localhost:8080/elections/${electionId}`, { parties: updatedParties });

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

  if (loading) {
    return <div>Loading election and vote data...</div>; // Handle loading state
  }

  return (
    <div className="voting-page-body89">
      <div className="voting-page-container89">
        <h2 className="voting-page-title89">Voting Page</h2>
        {election ? (
          <div>
            <h3>{election.name}</h3>
            <p>Date: {election.date}</p>
            <h4>Parties:</h4>
            {hasVoted() ? (
              <p>Already voted, thank you!</p>
            ) : (
              <ul className="party-list89">
                {election.parties && election.parties.length > 0 ? (
                  election.parties.map((party) => (
                    <li key={party.partyName} className="party-option89">
                      <strong>{party.partyName}</strong> - Candidate: {party.candidateName} 
                      <div className="candidate-score">
                        <MatchScore 
                          promises={party.promises} // Pass the promises of the party
                          userNeeds={userNeeds} // Pass the user's needs
                        />
                      </div>
                      <button 
                        onClick={() => handleVote(party.partyName, party.candidateName)} 
                        className="vote-button89"
                      >
                        Vote
                      </button>
                    </li>
                  ))
                ) : (
                  <p>No parties available.</p>
                )}
              </ul>
            )}
          </div>
        ) : (
          <p>Loading election...</p>
        )}
      </div>
    </div>
  );
};

export default VotingPage;

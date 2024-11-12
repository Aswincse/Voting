import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './NeedsForm.css';

const NeedsForm = () => {
  const { userId, electionId } = useParams();
  const navigate = useNavigate();
  const [needs, setNeeds] = useState([]);
  const [newNeed, setNewNeed] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleAddNeed = () => {
    setNeeds([...needs, newNeed]);
    setNewNeed('');
  };

  const handleSaveNeeds = async () => {
    try {
      const response = await axios.get('http://localhost:8080/users');
      const users = response.data;
      const user = users.find(user => user.id === userId);

      // Find the user's existing needs for this election
      const userNeeds = user.needs.find(need => need.electionId === electionId);

      if (!userNeeds) {
        user.needs.push({ electionId, needs });
      } else {
        userNeeds.needs = needs;
      }

      // Update the user data
      await axios.put(`http://localhost:8080/users/${userId}`, user);

      // Show success popup
      setShowSuccessPopup(true);

      // Redirect to the VotingPage after 2 seconds
      setTimeout(() => {
        navigate(`/vote/${electionId}`); // Navigate to the voting page for this election
      }, 2000);
    } catch (error) {
      console.error('Error saving needs:', error);
    }
  };

  return (
    <div className="needs-form-container89">
      <h1>Needs Form</h1>
      <h2>Election ID: {electionId}</h2>

      <div className="needs-input89">
        <input
          type="text"
          value={newNeed}
          onChange={(e) => setNewNeed(e.target.value)}
          placeholder="Add your need"
        />
        <button onClick={handleAddNeed}>Add Need</button>
      </div>

      <div className="needs-list89">
        <h3>Your Needs:</h3>
        <ul>
          {needs.map((need, index) => (
            <li key={index}>{need}</li>
          ))}
        </ul>
      </div>

      <button onClick={handleSaveNeeds} className="save-needs-button89">Save Needs</button>
      <button onClick={() => navigate(`/vote/${electionId}`)} className="skip-button89">Skip</button>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="success-popup89">
          <div className="popup-content89">
            <h2>Success!</h2>
            <p>Your needs have been successfully saved.</p>
            <button onClick={() => setShowSuccessPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NeedsForm;

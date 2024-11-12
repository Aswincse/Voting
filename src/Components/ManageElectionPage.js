import React, { useState, useEffect } from 'react';
import './ManageElectionPage.css';

const ManageElectionPage = () => {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [newParty, setNewParty] = useState({ partyName: '', candidateName: '', promises: [] });
  const [users, setUsers] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]); // Store selected user IDs

  // Fetch all elections and users on load
  useEffect(() => {
    fetchElections(); // Initialize elections fetch
    fetchUsers();
  }, []); // Initial load of elections and users

  const fetchElections = async () => {
    try {
      const response = await fetch('http://localhost:8080/elections');
      const data = await response.json();
      setElections(data);
    } catch (error) {
      console.error('Error fetching elections:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8080/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleElectionChange = (e) => {
    const electionId = e.target.value;
    const election = elections.find((el) => el.id === electionId);
    setSelectedElection(election);
  };

  const handleAddParty = () => {
    const newParties = [...selectedElection.parties, newParty];
    setSelectedElection({ ...selectedElection, parties: newParties });
    setNewParty({ partyName: '', candidateName: '', promises: [] });
  };

  const handlePartyNameChange = (index, e) => {
    const newParties = [...selectedElection.parties];
    newParties[index].partyName = e.target.value;
    setSelectedElection({ ...selectedElection, parties: newParties });
  };

  const handleCandidateNameChange = (index, e) => {
    const newParties = [...selectedElection.parties];
    newParties[index].candidateName = e.target.value;
    setSelectedElection({ ...selectedElection, parties: newParties });
  };

  const handleAddPromise = (partyIndex) => {
    const updatedParties = [...selectedElection.parties];
    updatedParties[partyIndex].promises.push({ category: '', promise: '', customCategory: '' });
    setSelectedElection({ ...selectedElection, parties: updatedParties });
  };

  const handlePromiseChange = (e, partyIndex, promiseIndex) => {
    const updatedParties = [...selectedElection.parties];
    updatedParties[partyIndex].promises[promiseIndex].promise = e.target.value;
    setSelectedElection({ ...selectedElection, parties: updatedParties });
  };

  const handleRemovePromise = (partyIndex, promiseIndex) => {
    const updatedParties = [...selectedElection.parties];
    updatedParties[partyIndex].promises = updatedParties[partyIndex].promises.filter(
      (_, index) => index !== promiseIndex
    );
    setSelectedElection({ ...selectedElection, parties: updatedParties });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Update the participants with selected users' IDs
    const electionData = { ...selectedElection, participants: selectedUsers };

    try {
      const response = await fetch(`http://localhost:8080/elections/${selectedElection.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(electionData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        console.log('Election updated successfully!');
        setTimeout(() => setIsSubmitted(false), 5000);
        
        // Re-fetch elections data after successful update
        fetchElections(); // Now this function is properly defined
      } else {
        console.error('Failed to update election:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating election:', error);
    }
  };

  // Handle individual user checkbox change
  const handleUserChange = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId) // Deselect if already selected
        : [...prevSelected, userId] // Select if not selected
    );
  };

  // Handle "Select All" checkbox change
  const handleSelectAllChange = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]); // Deselect all
    } else {
      setSelectedUsers(users.map((user) => user.id)); // Select all
    }
  };

  return (
    <div className="manage-election-container">
      <div className="election-card">
        <h2 className="header">Manage Elections</h2>
        <div className="input-group">
          <label htmlFor="electionSelect" className="label">Select Election</label>
          <select id="electionSelect" onChange={handleElectionChange} className="input-field">
            <option value="">--Select an Election--</option>
            {elections.map((election) => (
              <option key={election.id} value={election.id}>
                {election.name}
              </option>
            ))}
          </select>
        </div>

        {selectedElection && (
          <form onSubmit={handleSubmit}>
            <h3>Edit Election: {selectedElection.name}</h3>

            {/* Edit Parties */}
            <div>
              <h4>Parties</h4>
              {selectedElection.parties.map((party, partyIndex) => (
                <div key={partyIndex}>
                  <label className="label">Party {partyIndex + 1}</label>
                  <input
                    type="text"
                    value={party.partyName}
                    onChange={(e) => handlePartyNameChange(partyIndex, e)}
                    placeholder="Party Name"
                    className="input-field"
                  />
                  <input
                    type="text"
                    value={party.candidateName}
                    onChange={(e) => handleCandidateNameChange(partyIndex, e)}
                    placeholder="Candidate Name"
                    className="input-field"
                  />

                  {/* Promises */}
                  <div>
                    {party.promises.map((promise, promiseIndex) => (
                      <div key={promiseIndex}>
                        <label className="label">Promise</label>
                        <input
                          type="text"
                          value={promise.promise}
                          onChange={(e) => handlePromiseChange(e, partyIndex, promiseIndex)}
                          placeholder="Enter promise"
                          className="input-field"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemovePromise(partyIndex, promiseIndex)}
                          className="btn-delete"
                        >
                          Remove Promise
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => handleAddPromise(partyIndex)}
                      className="btn-add-party"
                    >
                      Add Promise
                    </button>
                  </div>
                </div>
              ))}
              <button type="button" onClick={handleAddParty} className="btn-add-party">
                Add Party
              </button>
            </div>

            {/* Users Table */}
            <div className="participants-table">
              <table>
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        onChange={handleSelectAllChange}
                        checked={selectedUsers.length === users.length}
                      />
                    </th>
                    <th>First Name</th> {/* Changed from Name to First Name */}
                    <th>Last Name</th>  {/* Added Last Name */}
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <input
                          type="checkbox"
                          onChange={() => handleUserChange(user.id)}
                          checked={selectedUsers.includes(user.id)}
                        />
                      </td>
                      <td>{user.firstName}</td> {/* Display firstName */}
                      <td>{user.lastName}</td>  {/* Display lastName */}
                      <td>{user.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Submit Button */}
            <div className="button-group">
              <button type="submit" className="btn-save">Save Changes</button>
              <button type="button" className="btn-delete">Delete Election</button>
            </div>
          </form>
        )}
        {isSubmitted && <div className="error-message">Election updated successfully!</div>}
      </div>
    </div>
  );
};

export default ManageElectionPage;

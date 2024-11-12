import React, { useState } from 'react';
import './CreateElection.css';

const CreateElection = () => {
  const [electionName, setElectionName] = useState('');
  const [electionDate, setElectionDate] = useState('');
  const [parties, setParties] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false); // New state to show success message

  const handleElectionNameChange = (e) => setElectionName(e.target.value);
  const handleElectionDateChange = (e) => setElectionDate(e.target.value);

  const handleAddParty = () => {
    setParties([...parties, { partyName: '', candidateName: '', promises: [] }]);
  };

  const handlePartyNameChange = (index, e) => {
    const newParties = [...parties];
    newParties[index].partyName = e.target.value;
    setParties(newParties);
  };

  const handleCandidateNameChange = (index, e) => {
    const newParties = [...parties];
    newParties[index].candidateName = e.target.value;
    setParties(newParties);
  };

  const handleAddPromise = (partyIndex) => {
    setParties((prevParties) => {
      const updatedParties = [...prevParties];
      if (!updatedParties[partyIndex].promises.length || updatedParties[partyIndex].promises[updatedParties[partyIndex].promises.length - 1].promise) {
        updatedParties[partyIndex].promises.push({ category: '', promise: '', customCategory: '' });
      }
      return updatedParties;
    });
  };

  const handleCategorySelect = (e, partyIndex, promiseIndex) => {
    const newParties = [...parties];
    newParties[partyIndex].promises[promiseIndex].category = e.target.value;
    if (e.target.value !== 'Other') {
      newParties[partyIndex].promises[promiseIndex].customCategory = ''; // Reset custom category if not 'Other'
    }
    setParties(newParties);
  };

  const handleCustomCategoryChange = (e, partyIndex, promiseIndex) => {
    const newParties = [...parties];
    newParties[partyIndex].promises[promiseIndex].customCategory = e.target.value;
    setParties(newParties);
  };

  const handlePromiseChange = (e, partyIndex, promiseIndex) => {
    const newParties = [...parties];
    newParties[partyIndex].promises[promiseIndex].promise = e.target.value;
    setParties(newParties);
  };

  const handleRemovePromise = (partyIndex, promiseIndex) => {
    const newParties = [...parties];
    newParties[partyIndex].promises = newParties[partyIndex].promises.filter(
      (_, index) => index !== promiseIndex
    );
    setParties(newParties);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const electionData = {
      name: electionName,
      date: electionDate,
      parties: parties.filter(party => party.partyName !== '' && party.candidateName !== ''), // Filter out empty parties
      participants: [], // Empty participants array
    };

    try {
      const response = await fetch('http://localhost:8080/elections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(electionData),
      });

      if (response.ok) {
        setIsSubmitted(true); // Show success message
        setElectionName(''); // Reset form fields
        setElectionDate('');
        setParties([]); // Reset parties
        console.log('Election saved successfully!');
      } else {
        console.error('Failed to save election:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving election:', error);
    }
  };

  return (
    <div className="create-election78">
      <h2>Create New Election</h2>
      <form onSubmit={handleSubmit}>
        {/* Election Name Input */}
        <div className="form-group78">
          <label htmlFor="electionName">Election Name</label>
          <input
            type="text"
            id="electionName"
            name="electionName"
            value={electionName}
            onChange={handleElectionNameChange}
            required
          />
        </div>

        {/* Election Date Input */}
        <div className="form-group78">
          <label htmlFor="electionDate">Election Date</label>
          <input
            type="date"
            id="electionDate"
            name="electionDate"
            value={electionDate}
            onChange={handleElectionDateChange}
            required
          />
        </div>

        {/* Add Party Button */}
        <div className="party-group78">
          <button type="button" className="add-party-button78" onClick={handleAddParty}>
            Add Party
          </button>

          {/* Display all added parties */}
          {parties.map((party, partyIndex) => (
            <div key={partyIndex} className="form-group78">
              <label>Party {partyIndex + 1}</label>

              {/* Party Name Field */}
              <input
                type="text"
                name={`partyName-${partyIndex}`}
                value={party.partyName}
                onChange={(e) => handlePartyNameChange(partyIndex, e)}
                placeholder="Enter party name"
                required
              />

              {/* Candidate Name Field */}
              <input
                type="text"
                name={`candidateName-${partyIndex}`}
                value={party.candidateName}
                onChange={(e) => handleCandidateNameChange(partyIndex, e)}
                placeholder="Enter candidate name"
                required
              />

              {/* Add Promise Section */}
              <div className="promise-category-group78">
                <button
                  type="button"
                  className="add-promise-button78"
                  onClick={() => handleAddPromise(partyIndex)}
                >
                  Add Promise
                </button>

                {/* Display multiple promise input fields */}
                {party.promises.map((promise, promiseIndex) => (
                  <div key={promiseIndex} className="promise-form78">
                    <label htmlFor={`categorySelect-${promiseIndex}`}>Category</label>
                    <select
                      id={`categorySelect-${promiseIndex}`}
                      value={promise.category}
                      onChange={(e) => handleCategorySelect(e, partyIndex, promiseIndex)}
                    >
                      <option value="">Select Category</option>
                      <option value="Education">Education</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Economy">Economy</option>
                      <option value="Other">Other</option>
                    </select>

                    {/* If "Other" is selected, show an input to specify category */}
                    {promise.category === 'Other' && (
                      <div>
                        <label htmlFor={`categoryInput-${promiseIndex}`}>Specify Category</label>
                        <input
                          type="text"
                          id={`categoryInput-${promiseIndex}`}
                          value={promise.customCategory}
                          onChange={(e) => handleCustomCategoryChange(e, partyIndex, promiseIndex)}
                          placeholder="Enter custom category"
                          required
                        />
                      </div>
                    )}

                    <label htmlFor={`promiseDetails-${promiseIndex}`}>Promise</label>
                    <input
                      type="text"
                      id={`promiseDetails-${promiseIndex}`}
                      value={promise.promise}
                      onChange={(e) => handlePromiseChange(e, partyIndex, promiseIndex)}
                      placeholder="Enter promise"
                      required
                    />

                    {/* Remove Promise Button */}
                    <button
                      type="button"
                      className="remove-promise-button78"
                      onClick={() => handleRemovePromise(partyIndex, promiseIndex)}
                    >
                      Remove Promise
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-button78">Submit</button>
      </form>

      {/* Success Message */}
      {isSubmitted && <p className="success-message78">Election submitted successfully!</p>}
    </div>
  );
};

export default CreateElection;

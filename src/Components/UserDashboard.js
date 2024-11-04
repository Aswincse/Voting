// // src/Components/UserDashboard.js
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './UserDashboard.css'; // Ensure you style your dashboard

// const UserDashboard = () => {
//   const navigate = useNavigate();
//   const [elections, setElections] = useState([]);
//   const [userId, setUserId] = useState('');

//   useEffect(() => {
//     // Retrieve logged-in user data from local storage
//     const user = JSON.parse(localStorage.getItem('user'));
//     if (user) {
//       setUserId(user.id);
//       fetchElections(user.id);
//     } else {
//       navigate('/login'); // Redirect to login if not logged in
//     }
//   }, [navigate]);

//   const fetchElections = async (userId) => {
//     try {
//       const response = await axios.get('http://localhost:8080/elections');
//       const userElections = response.data.filter(election =>
//         election.participants.includes(userId)
//       );
//       setElections(userElections);
//     } catch (error) {
//       console.error('Error fetching elections:', error);
//     }
//   };

//   const handleVoteNow = (electionId) => {
//     navigate(`/vote/${electionId}`); // Navigate to VotingPage with electionId
//   };
  

//   return (
//     <div className="user-dashboard">
//       <h1>User Dashboard</h1>
//       <h2>Your Elections</h2>
//       {elections.length > 0 ? (
//         <ul className="election-list">
//           {elections.map(election => (
//             <li key={election.id} className="election-item">
//               <h3>{election.name}</h3>
//               <p>Date: {new Date(election.date).toLocaleDateString()}</p>
//               <button onClick={() => handleVoteNow(election.id)} className="vote-button">
//                 Vote Now!
//               </button>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No elections available for you.</p>
//       )}
//     </div>
//   );
// };

// export default UserDashboard;

// src/Components/UserDashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserDashboard.css'; // Ensure you style your dashboard

const UserDashboard = () => {
  const navigate = useNavigate();
  const [elections, setElections] = useState([]);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    // Retrieve logged-in user data from local storage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUserId(user.id);
      fetchElections(user.id);
    } else {
      navigate('/login'); // Redirect to login if not logged in
    }
  }, [navigate]);

  const fetchElections = async (userId) => {
    try {
      const response = await axios.get('http://localhost:8080/elections');
      const userElections = response.data.filter(election =>
        election.participants.includes(userId)
      );
      setElections(userElections);
    } catch (error) {
      console.error('Error fetching elections:', error);
    }
  };

  const handleVoteNow = (electionId) => {
    navigate(`/vote/${electionId}`); // Navigate to VotingPage with electionId
  };

  return (
    <div className="user-dashboard">
      <h1>User Dashboard</h1>
      <h2>Your Elections</h2>
      <div className="election-container">
        {elections.length > 0 ? (
          elections.map(election => (
            <div key={election.id} className="election-card">
              <h3>{election.name}</h3>
              <p>Date: {new Date(election.date).toLocaleDateString()}</p>
              <button onClick={() => handleVoteNow(election.id)} className="vote-button">
                Vote Now!
              </button>
            </div>
          ))
        ) : (
          <p>No elections available for you.</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;


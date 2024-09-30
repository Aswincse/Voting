import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './Components/LoginPage';
import AdminDashboard from './Components/AdminDashboard';
import VotingPage from './Components/VotingPage';
import UserDashboard from './Components/UserDashboard';
import CreateElection from './Components/CreateElection';
import ManageElectionPage from './Components/ManageElectionPage';
import CreateUser from './Components/CreateUser'; // Import CreateUser
import PrivateRoute from './Components/PrivateRoute'; 

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create-election" element={<CreateElection />} />
          
          {/* Wrap admin routes with PrivateRoute */}
          <Route element={<PrivateRoute role="admin" />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/manage-election/:electionId" element={<ManageElectionPage />} />
            <Route path="/create-user" element={<CreateUser />} /> {/* Add Create User route */}
          </Route>

          {/* Wrap user routes with PrivateRoute */}
          <Route element={<PrivateRoute role="user" />}>
            <Route path="/vote" element={<VotingPage />} />
            <Route path="/user" element={<UserDashboard />} />
          </Route>

          <Route path="/" element={<LoginPage />} /> {/* Redirect to login page */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

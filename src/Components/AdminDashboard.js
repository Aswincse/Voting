import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css'; // Updated CSS file name

const AdminDashboard = () => { // Updated component name
  const [elections, setElections] = useState([]);

  useEffect(() => {
    const fetchElections = async () => {
      try {
        const response = await axios.get('http://localhost:8080/elections');
        setElections(response.data);
      } catch (error) {
        console.error('Failed to fetch elections:', error);
      }
    };

    fetchElections();
  }, []);

  return (
    <div id="admin-dashboard34"> {/* Updated ID */}
      <aside className="sidebar11">
        <h2 id="sidebar-title34">Admin Panel</h2> {/* Updated ID */}
        <ul id="sidebar-menu34"> {/* Updated ID */}
          <li id="menu-item34"> {/* Updated ID */}
            <Link to="/create-election" id="menu-link34"> {/* Updated ID */}
              Create Election
            </Link>
          </li>
          <li id="menu-item34"> {/* Updated ID */}
            <h3 id="section-title34">Manage Elections</h3> {/* Updated ID */}
            <ul id="submenu34"> {/* Updated ID */}
              {elections.map((election) => (
                <li key={election.id} id="submenu-item34"> {/* Updated ID */}
                  <Link to={`/manage-election/${election.id}`} id="submenu-link34"> {/* Updated ID */}
                    {election.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li id="menu-item34"> {/* Updated ID */}
            <Link to="/create-user" id="menu-link34"> {/* Updated ID */}
              Create User
            </Link>
          </li>
          <li id="menu-item34"> {/* Updated ID */}
            <Link to="/view-results" id="menu-link34"> {/* Updated ID */}
              View Election Results
            </Link>
          </li>
        </ul>
      </aside>
      <main id="content34"> {/* Updated ID */}
        <h1 id="content-title34">Welcome to the Admin Dashboard</h1> {/* Updated ID */}
        <p id="content-description34">Manage elections, create new elections, and oversee ongoing activities.</p> {/* Updated ID */}
      </main>
    </div>
  );
};

export default AdminDashboard; // Updated export

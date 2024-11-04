// // src/Components/LoginPage.js
// import React, { useState } from 'react';
// import axios from 'axios';
// import Popup from './Popup'; // Import Popup for success/failure messages
// import { useNavigate } from 'react-router-dom';
// import './LoginPage.css'; // Ensure you style your login page

// const LoginPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isAdmin, setIsAdmin] = useState(false); // State to toggle between user and admin
//   const [popupVisible, setPopupVisible] = useState(false);
//   const [popupMessage, setPopupMessage] = useState('');
//   const navigate = useNavigate();

//   // Handles user/admin login
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const endpoint = isAdmin ? 'http://localhost:8080/admins' : 'http://localhost:8080/users';
      
//       // Fetch data from respective endpoint (users or admins)
//       const response = await axios.get(endpoint);
//       const users = response.data;
      
//       // Check if the entered email and password match any user/admin
//       const user = users.find(u => u.email === email && u.password === password);
      
//       if (user) {
//         // Successful login
//         setPopupMessage('Login Successful!');
//         localStorage.setItem('user', JSON.stringify(user)); // Save user/admin info in local storage
//         navigate(isAdmin ? '/admin' : '/userdashboard'); // Redirect to UserDashboard for users
//       } else {
//         // Invalid email or password
//         setPopupMessage('Login Failed: Invalid email or password.');
//       }
//     } catch (error) {
//       // Handle error during login
//       setPopupMessage('Login Failed: An error occurred. Please try again.');
//     } finally {
//       // Show the popup with the result message
//       setPopupVisible(true);
//     }
//   };

//   // Closes the popup
//   const closePopup = () => {
//     setPopupVisible(false);
//   };

//   // Toggles between user and admin login mode
//   const toggleLoginType = () => {
//     setIsAdmin(!isAdmin);
//   };

//   return (
//     <div className="login-page">
//       <div className="login-container">
//         {/* Main message based on user/admin mode */}
//         <h2 className="login-title">{isAdmin ? 'Welcome back Admin' : 'Welcome back User'}</h2>
        
//         {/* Login form */}
//         <form onSubmit={handleLogin} className="login-form">
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             className="login-input"
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             className="login-input"
//           />
//           <button type="submit" className="login-button">Login</button>
//         </form>

//         {/* Show popup on login result */}
        // {popupVisible && <Popup message={popupMessage} onClose={closePopup} />}
        
        // {/* Toggle link to switch between user/admin */}
        // <div className="toggle-option">
        //   <p onClick={toggleLoginType} className="login-toggle-link">
        //     {isAdmin ? "Are you a user? Click here" : "Are you an admin? Click here"}
        //   </p>
        // </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;




import React, { useState } from 'react';
import axios from 'axios';
import Popup from './Popup';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isAdmin ? 'http://localhost:8080/admins' : 'http://localhost:8080/users';
      const response = await axios.get(endpoint);
      const users = response.data;
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        setPopupMessage('Login Successful!');
        localStorage.setItem('user', JSON.stringify(user));
        navigate(isAdmin ? '/admin' : '/userdashboard');
      } else {
        setPopupMessage('Login Failed: Invalid email or password.');
      }
    } catch (error) {
      setPopupMessage('Login Failed: An error occurred. Please try again.');
    } finally {
      setPopupVisible(true);
    }
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  const toggleLoginType = () => {
    setIsAdmin(!isAdmin);
  };

  return (
    <div className='loginbody'>
    <div className="login-wrapper">
      <div className="login-container">
        <form className="login" onSubmit={handleLogin}>
      <h2 className="login-title">{isAdmin ? 'Welcome back Admin' : 'Welcome back User'}</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        <p onClick={toggleLoginType} className="toggle-link">
          {isAdmin ? "Are you a user? Click here" : "Are you an admin? Click here"}
        </p>
        </form>
        {popupVisible && <Popup message={popupMessage} onClose={closePopup} />}

      </div>
    </div>
    </div>
  );
};

export default LoginPage;

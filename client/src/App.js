import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Home from './components/Home';
import Chats from './components/Chats';
import SideBar from './components/SideBar';
import About from './components/About';
import './App.css';

function App() {
  const [User, setUser] = useState([])
  const { getAccessTokenSilently } = useAuth0();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = await getAccessTokenSilently();

        const response = await fetch('/current_user', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('User Data:', data);

        } else {
          console.error('Error:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, [getAccessTokenSilently]);

  return (
    <div className="App">
      <SideBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/chats' element={<Chats />} />
        <Route path='/about' element={<About />} />
      </Routes>
    </div>
  );
}

export default App;
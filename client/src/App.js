import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Home from './components/Home';
import Chats from './components/Chats';
import SideBar from './components/SideBar';
import About from './components/About';
import Profile from './components/Profile';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const { getAccessTokenSilently, isAuthenticated } = useAuth0();

  // console.log("CURRENT USER APP", currentUser);




  // gets all posts
  useEffect(() => {
    fetch('/posts')
      .then(resp => {
        if (!resp.ok) {
          throw new Error('Error retrieving posts');
        }
        return resp.json();
      })
      .then(data => {
        setPosts(data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }, []);

  // console.log('POST DATA', posts);

  // console.log("CYRRENT USER", currentUser);






  return (
    <div className="App">
      <SideBar currentUser={currentUser} setCurrentUser={setCurrentUser} />
      <Routes>
        <Route path="/" element={<Home posts={posts} setPosts={setPosts} currentUser={currentUser} />} />
        <Route path="/chats" element={<Chats currentUser={currentUser} setPosts={setPosts} />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile currentUser={currentUser} posts={posts} setPosts={setPosts} />} />
      </Routes>
    </div>
  );
}

export default App;













  // const fetchUserInfo = async () => {
  //   try {
  //     const accessToken = await getAccessTokenSilently();
  //     await fetchCurrentUser(accessToken);
  //     // console.log('ACCESS TOKEN', accessToken);
  //   } catch (error) {
  //     console.error('Error retrieving user information:', error);
  //   }
  // };

  // const fetchCurrentUser = async () => {
  //   try {
  //     if (isAuthenticated) {
  //       const accessToken = await getAccessTokenSilently();
  //       const response = await fetch('/current_user', {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       });

  //       if (response.ok) {
  //         const userData = await response.json();
  //         setCurrentUser(userData);
  //         // console.log('USER DATA:', userData);
  //       } else {
  //         console.error('Error:', response.statusText);
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error:', error);
  //   }
  // };

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     fetchUserInfo();
  //   }
  // }, [getAccessTokenSilently, isAuthenticated]);



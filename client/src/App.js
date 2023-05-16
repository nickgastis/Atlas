import React, { } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Chats from './components/Chats';
import SideBar from './components/SideBar';
import './App.css';

function App() {
  return (
    <div className="App">
      <SideBar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/chats' element={<Chats />} />
      </Routes>
    </div>
  );
}

export default App;
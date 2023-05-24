import React from 'react';
import './styles/Home.css';
import Post from './Post';
import SearchBar from './SearchBar';

function Home({ posts }) {
    return (
        <div className="home">
            <h1 className='welcome-title'>Welcome to Atlas!</h1>
            <div className="search-bar">
                <SearchBar />
            </div>
            <div className="post-list">
                <Post posts={posts} />

                {/* Each post component goes here */}
            </div>
        </div>
    );
}

export default Home;
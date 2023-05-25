import React, { useState, useEffect } from 'react';
import './styles/Home.css';
import Post from './Post';
import SearchBar from './SearchBar';

function Home({ posts }) {
<<<<<<< HEAD
=======
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPosts, setFilteredPosts] = useState([]);

    console.log("HOME POSTS", posts);

    useEffect(() => {
        setFilteredPosts(posts);
    }, [posts]);

    const handleSearchQueryChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        filterPosts(query);
    };

    const filterPosts = (query) => {
        const filtered = posts.filter((post) => {
            const title = post.title.toLowerCase();
            const lowerQuery = query.toLowerCase();
            return title.includes(lowerQuery);
        });

        setFilteredPosts(filtered);
    };
    //COMMENT
>>>>>>> wednesday11
    return (
        <div className="home">
            <h1 className="welcome-title">Welcome to Atlas!</h1>
            <div className="search-bar">
                <SearchBar value={searchQuery} onChange={handleSearchQueryChange} />
            </div>
            <div className="post-list">
<<<<<<< HEAD
                <Post posts={posts} />

                {/* Each post component goes here */}
=======
                {filteredPosts.map((post) => (
                    <Post key={post.id} post={post} />
                ))}
>>>>>>> wednesday11
            </div>
        </div>
    );
}

export default Home;

import React from 'react';
import "./styles/SearchBar.css";

function SearchBar() {
    return (
        <div className="search-bar">
            <div className="input-container">
                <input id="input" type="text" required />
                <label className="label" htmlFor="input">Search...</label>
                <div className="underline"></div>
                <div className="sideline"></div>
                <div className="upperline"></div>
                <div className="line"></div>
            </div>
        </div>
    );
}

export default SearchBar;




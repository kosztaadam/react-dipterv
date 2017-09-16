import React from 'react';
import SearchBar from "./SearchBar";

const Nav = () => (
    <nav className="navbar navbar-toggleable-md navbar-light bg-faded">
        <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse"
                data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false"
                aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"/>
        </button>
        <a className="navbar-brand" href="#">Zenei adatbázis</a>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                    <a className="nav-link" href="#">Kezdőlap <span className="sr-only">(current)</span></a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#">Előadók</a>
                </li>
            </ul>
            <SearchBar />
        </div>
    </nav>
);

export default Nav;
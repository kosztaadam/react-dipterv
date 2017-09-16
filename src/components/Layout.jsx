import React from 'react';
import {Nav, Footer} from '/';
import ArtistDetails from "../containers/ArtistDetails";
import ArtistGraph from "../containers/ArtistGraph";

const Layout = () => {
    return (
        <div>
            <Nav />
            <ArtistDetails/>
            <ArtistGraph/>
            <Footer />
        </div>
    );
};

export default Layout;
import React from "react";
import $ from 'jquery';

export default class ArtistGraph extends React.Component {

    constructor(props) {
        super(props);
        // Set the videoList to empty array
        this.state = {
            entries: []
        };
    }

    componentDidMount() {
        $.get('http://localhost:5000/json/artist/The Killers', function (res) {
                let parsedRes = JSON.parse(res);
                let similarArtist = JSON.parse(parsedRes.similarArtistsList);
                this.setState({entries: similarArtist.nodes});

                let embedCode = '<script type="text/javascript">let simart = JSON.stringify(' + parsedRes.similarArtistsList + ');renderGraph(simart, false, false); </script>';
                $('#graph').append(embedCode);
            }.bind(this)
        )
    }

    render() {
        return (
            <div>
                <svg id="graph" width="500" height="500"/>
            </div>
        )
    }
}





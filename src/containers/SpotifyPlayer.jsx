import React from "react";
import $ from 'jquery';

export default class SpotifyPlayer extends React.Component {

    constructor(props) {
        super(props);
        // Set the videoList to empty array
        this.state = {
            iframe: ""
        };
    }

    componentDidMount() {
        $.get('/spotify', function (res) {
                console.log(res);
                //var parsedRes = JSON.parse(res);
                //var url = "https://embed.spotify.com/?uri=spotify:album:";
                this.setState({iframe: res});
            }.bind(this)
        )
    }

    iframe() {
        return {
            __html: this.state.iframe
        }
    }

    render() {
        return (
            <div>
                <div dangerouslySetInnerHTML={ this.iframe() }/>
            </div>
        )
    }
}
import React from "react";
import $ from 'jquery';

export default class ArtistDetails extends React.Component {

    constructor(props) {
        super(props);
        // Set the videoList to empty array
        this.state = {
            artist: "",
            topAlbum: "",
            entries: []
        };
    }

    componentDidMount() {
        this.getArtist('The Killers');
    }

    shouldComponentUpdate(artist) {
        this.setState(artist);
        $(".artistdetails").fadeIn();
        $(".spinner").hide();
        return true;
    }

    getArtist(artist) {
        $.ajax({
            url: 'http://localhost:5000/json/artist/' + artist,
            beforeSend: function () {
                $(".artistdetails").hide();
                $(".spinner").fadeIn();
            }
        })
            .done(function (res) {
                let parsedRes = JSON.parse(res);
                let similarArtist = JSON.parse(parsedRes.similarArtistsList);
                let artist = parsedRes.artist;
                let topAlbum = parsedRes.artistTopAlbum;
                this.setState({artist, topAlbum, entries: similarArtist.nodes});
            }.bind(this))
            .fail(function (e) {
                console.log("getArtist ajax error");
                console.log(e);
            });
    }

    render() {
        return (
            <div className="artistdetails m-3">
                Előadó: {this.state.artist} <br />
                Legismertebb album: {this.state.topAlbum} <br />
                Hasonló előadók:
                <ul>
                    {this.state.entries.map(function (listValue) {
                        return <li key={listValue.id}
                                   onClick={event => this.getArtist(listValue.id)}>{listValue.id}</li>;
                    }, this)}
                </ul>
            </div>
        )
    }
}
import React from "react";
import ArtistDetails from '../containers/ArtistDetails';

export default class SearchBar extends React.Component {

    constructor(props) {
        super(props);
        // Set the videoList to empty array
        this.props = {
            artist: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        //TODO: call other component
        this.props.getArtist("Queen");
    }

    handleChange(event) {
        this.setState({artist: event.target.value});
        console.log(event.target.value);
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" value={this.state.artist} onChange={this.handleChange}/>
                </form>
            </div>
        )
    }
}
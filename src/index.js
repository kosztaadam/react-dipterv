import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom';
import Layout from './components';

// App routes
export default class Router extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <BrowserRouter>
                <div>
                    <Route exact path="/" component={Layout}/>
                    <Route exact path="/home" component={Layout}/>
                </div>
            </BrowserRouter>
        )
    }
}

ReactDOM.render(<Router />, document.getElementById('app'));
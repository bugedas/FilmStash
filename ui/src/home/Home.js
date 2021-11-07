import React, { Component } from 'react';
import './Home.css';

class Home extends Component {
    render() {
        return (
            <div className="home-container">
                <div className="container">
                    <img src={require('../img/FilmstashLogo.png')} alt="Logo" className={'logoImg'}/>
                </div>
            </div>
        )
    }
}

export default Home;
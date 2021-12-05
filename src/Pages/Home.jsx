import React from 'react';
import logo from '../Images/FilmstashLogo.png';
import './Home.css';
import {isLoggedIn} from "../Utils/APIUtils";
import HomeLoggedIn from "./HomeLoggedIn";

export default function Home () {

    if(isLoggedIn()){
        return (
            <HomeLoggedIn/>
        )
    }

    return (
        <div className="home-container">
            <div className="container">
                <img src={logo} alt="Logo" className={'logoImg'}/>
            </div>
        </div>
    )
}
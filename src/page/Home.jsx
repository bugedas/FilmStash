import React from 'react';
import logo from '../image/FilmstashLogo.png';
import './Home.scss';
import HomeLoggedIn from "./HomeLoggedIn";
import {isLoggedIn} from "../util/axiosUtils";

export default function Home () {

    if(isLoggedIn()){
        return (
            <HomeLoggedIn/>
        )
    }

    return (
        <div className="home-container">
            <img src={logo} alt="Logo" className={'home-logoImg'}/>
        </div>
    )
}
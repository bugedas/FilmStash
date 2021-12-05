import React from 'react';
import filmPlaceholder from '../image/film-placeholder.png';
import './FilmCard.css';
import {useNavigate} from "react-router-dom";

export default function FilmCard(props) {
    const navigate = useNavigate();
    return (
        <div className={'film-card'} onClick={(e) => navigate(`/film/${props.filmId}`)}>
            <img src={props.image ? props.image : '../Images/film-placeholder.png'} alt={props.fullTitle} className={'film-card-image'}/>
            {/*<img src={filmPlaceholder} width={'200px'} height={'120px'} alt={props.fullTitle} className={'film-card-image'}/>*/}
            <h1 className={'film-card-title'}>{props.fullTitle}</h1>
        </div>
    )
}
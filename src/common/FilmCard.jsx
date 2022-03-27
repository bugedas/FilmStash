import React from 'react';
import './FilmCard.scss';
import {useNavigate} from "react-router-dom";
import {filmTvLink} from "../util/BaseUtils";

export default function FilmCard(props) {
    const navigate = useNavigate();
    return (
        <div className={'film-card'} onClick={(e) => navigate(`/${filmTvLink(props.filmType)}/${props.filmId}`)}>
            <img src={props.image ? props.image : '../Images/film-placeholder.png'} alt={props.title} className={'film-card-image'}/>
            <h1 className={'film-card-title'}>{props.title}</h1>
        </div>
    )
}
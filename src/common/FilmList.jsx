import React, {useEffect, useState} from 'react';
import './FilmList.css';
import {deleteRequest, getRequest} from "../axios-wrapper";
import {useNavigate} from "react-router-dom";
import {hasPermissions} from "../util/axiosUtils";

export default function FilmList(props) {
    const [filmsInList, setFilmsInList] = useState(null);
    const [hasPerm, setHasPerm] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const getUserData = async () => {
            const filmsInListData = await getRequest(`/api/films/${props.userId}`);
            setFilmsInList(filmsInListData.data);
            const perm = await hasPermissions(props.userId);
            setHasPerm(perm);
        }

        getUserData();
    }, []);

    const removeFilmFromList = (fId) => {
        deleteRequest(`/api/films/${fId}`);
        const deletedList = filmsInList.filter(f => {
            return f.id !== fId;
        })
        setFilmsInList(deletedList);
    }

    if(filmsInList === null){
        return null;
    }

    return (
        <div className={'film-list-section'}>
            <div className={'film-list-section-header'}>My films list</div>
            {filmsInList.map(f => {
                return(
                    <div key={f.id}>
                        {hasPerm && <div className={'film-in-a-list-delete'} onClick={() => removeFilmFromList(f.id)}>X</div>}
                        <div className={'film-in-a-list'} onClick={() => navigate(`/film/${f.filmId}`)}>
                            <img src={f.image} className={'film-in-a-list-image'} alt={'film in a list'}/>
                            <div className={'film-in-a-list-title'}>{f.fullTitle}</div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
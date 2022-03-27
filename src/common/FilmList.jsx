import React, {useEffect, useState} from 'react';
import './FilmList.scss';
import {deleteRequest, getRequest, tmdbGetRequest} from "../axios-wrapper";
import {useNavigate} from "react-router-dom";
import {hasPermissions} from "../util/axiosUtils";
import {tmdbImageLink} from "../constant/constants";
import {filmTvLink} from "../util/BaseUtils";
import ClearIcon from '@mui/icons-material/Clear';

export default function FilmList(props) {
    const [filmsInList, setFilmsInList] = useState(null);
    const [hasPerm, setHasPerm] = useState(false);
    const [lists, setLists] = useState(null);

    useEffect(() => {
        const getUserData = async () => {
            const filmsInListData = await getRequest(`/api/films/film/${props.userId}`);
            setFilmsInList(filmsInListData.data);
            const listsData = await getRequest(`/api/films/list/${props.userId}`);
            console.log(listsData);
            setLists(listsData.data);
            const perm = await hasPermissions(props.userId);
            setHasPerm(perm);
        }

        getUserData();
    }, []);

    const removeFilmFromList = async (fId) => {
        await deleteRequest(`/api/films/film/${fId}`);
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
                    <ListFilm key={f.filmId} remove={removeFilmFromList} id={f.filmId} deletePermission={hasPerm} filmType={f.type} dbId={f.id}/>
                )
            })}
        </div>
    )
}

function ListFilm (props) {
    const navigate = useNavigate();
    const [film, setFilm] = useState(null);

    useEffect(() => {
        const getUserData = async () => {
            const tmdbData = await tmdbGetRequest(`${props.filmType}/${props.id}?`);
            setFilm(tmdbData.data);
        }

        getUserData();
    }, []);

    if(!film) {
        return null;
    }

    return(
        <div>
            {props.deletePermission && <div className={'film-in-a-list-delete'} onClick={() => props.remove(props.dbId)}><ClearIcon/></div>}
            <div className={'film-in-a-list'} onClick={() => navigate(`/${filmTvLink(props.filmType)}/${props.id}`)}>
                <img src={tmdbImageLink(film?.poster_path, 'w300')} className={'film-in-a-list-image'} alt={'film in a list'}/>
                <div className={'film-in-a-list-title'}>{film.title || film.name}</div>
            </div>
        </div>
    )
}
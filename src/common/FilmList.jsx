import React, {useEffect, useState} from 'react';
import './FilmList.scss';
import {deleteRequest, getRequest, putRequest, tmdbGetRequest} from "../axios-wrapper";
import {useNavigate} from "react-router-dom";
import {hasPermissions} from "../util/axiosUtils";
import {LIST_TYPES, tmdbImageLink} from "../constant/constants";
import {filmTvLink, selectStylesOnDark} from "../util/BaseUtils";
import Select from "react-select";
import ActionButton from "./buttons/ActionButton";
import {FilmListDialog} from "./Dialogs";
import DeleteIcon from '@mui/icons-material/Delete';
import Fab from "@mui/material/Fab";
import {Tooltip} from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function FilmList(props) {
    const [filmsInList, setFilmsInList] = useState(null);
    const [hasPerm, setHasPerm] = useState(false);
    const [listType, setListType] = useState(LIST_TYPES[0].value);
    const [listDialog, setListDialog] = useState(false);

    useEffect(() => {
        const getUserData = async () => {
            const filmsInListData = await getRequest(`/api/films/film/${props.userId}`);
            setFilmsInList(filmsInListData.data.reverse());
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

    const moveToAnotherList = async (film) => {
        const data = {
            ...film,
            listType: film.listType === 'watched' ? 'watch_later' : 'watched',
        }
        await putRequest(`/api/films/film/${film.id}`, data);
        const deletedList = filmsInList.filter(f => {
            return f.id !== film.id;
        })
        setFilmsInList([...deletedList, data]);
    }

    if (filmsInList === null) {
        return null;
    }

    return (
        <div className={'film-list-section'}>
            <div className={'film-list-section-header'}>My films list</div>
            <Select styles={selectStylesOnDark}
                    options={LIST_TYPES}
                    defaultValue={LIST_TYPES[0]}
                    onChange={e => setListType(e.value)}/>
            {filmsInList?.filter(f => f.listType === listType)?.slice(0, 3)?.map(f => {
                return (
                    <ListFilm key={f.filmId} remove={removeFilmFromList} id={f.filmId} deletePermission={hasPerm}
                              filmType={f.type} dbFilm={f} moveList={moveToAnotherList}/>
                )
            })}
            <ActionButton sx={{marginTop: '20px'}} onClick={() => setListDialog(true)}>View All</ActionButton>
            <FilmListDialog allFilms={filmsInList} open={listDialog} onClose={setListDialog}
                            deleteFilm={removeFilmFromList} moveFilm={moveToAnotherList} permissions={hasPerm}/>
        </div>
    )
}

function ListFilm(props) {
    const navigate = useNavigate();
    const [film, setFilm] = useState(null);

    useEffect(() => {
        const getUserData = async () => {
            const tmdbData = await tmdbGetRequest(`${props.filmType}/${props.id}?`);
            setFilm(tmdbData.data);
        }

        getUserData();
    }, []);

    if (!film) {
        return null;
    }

    return (
        <div className="film-in-a-list-wrapper">
            {props.deletePermission &&
            <>
                <Tooltip title={props.dbFilm.listType === 'watched' ? 'NOT WATCHED' : 'WATCHED'}>
                    <Fab sx={{marginLeft: '10px'}} className={'film-in-a-list-move'}
                         onClick={() => props.moveList(props.dbFilm)} size="small">
                        {props.dbFilm.listType === 'watched' ?
                            <VisibilityOffIcon/> :
                            <VisibilityIcon/>
                        }
                    </Fab>
                </Tooltip>
                <Tooltip title="Delete">
                    <Fab sx={{marginLeft: '10px'}} className={'film-in-a-list-delete'} size="small"
                         onClick={() => props.remove(props.dbFilm.id)}><DeleteIcon/>
                    </Fab>
                </Tooltip>
            </>
            }
            <div className={'film-in-a-list'} onClick={() => navigate(`/${filmTvLink(props.filmType)}/${props.id}`)}>
                <div className={'film-in-a-list-type'}>{props.filmType}</div>
                <img src={tmdbImageLink(film?.poster_path, 'w300')} className={'film-in-a-list-image'}
                     alt={'film in a list'}/>
                <div className={'film-in-a-list-title'}>{film.title || film.name}</div>
            </div>
            <hr className={'film-line-break'}/>
        </div>
    )
}
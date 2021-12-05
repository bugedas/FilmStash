import React, {useEffect, useState} from 'react';
import './Film.css';
import {useNavigate, useParams} from "react-router-dom";
import {getImdbRequest, getRequest, postRequest} from "../axios-wrapper";
import filmPlaceholder from "../image/film-placeholder.png";
import * as moment from "moment";
import {top250} from '../imdb/top250';

export default function Film() {
    const { id } = useParams()
    const [film, setFilm] = useState(null);
    const [user, setUser] = useState(null);
    const [shareOpen, setShareOpen] = useState(false);
    const [shareMessage, setShareMessage] = useState('');

    const  navigate = useNavigate();

    const addPost = (e) => {
            if(shareMessage.length > 0){
                const yourDate = new Date()
                const newDate = moment(yourDate, 'YYYY-MM-DD')
                const data = {
                    filmId: film.id,
                    userId: user.id,
                    message: shareMessage,
                    likes: 0,
                    date: newDate
                }

                postRequest('/api/posts/add', data);
                navigate('/profile');
            }
    }

    useEffect(() => {
        const getData = async () => {
            // const filmData = await getRequest(`/api/films/id/${id}`);
            // setFilm(filmData.data);
            const filmsData = top250.items;
            const thisFilm = filmsData.filter(f => {
                return f.id === id;
            })
            setFilm(thisFilm[0]);
            const userData = await getRequest(`/api/user/me`);
            setUser(userData.data);
        }

        getData();
    }, []);

    if(film === null){
        return null;
    }

    return (
        <div className={'film-page'}>
            <div className={'film-page-header'}>
                {film.fullTitle}
            </div>
            <div className={'film-page-data'}>
                <span className={'film-page-year'}>Year: {film.year}</span>
                <span className={'film-page-imdb'}>IMDB Rating: {film.imdbRating}</span>
            </div>
            <img src={film.image ? film.image : '../Images/film-placeholder.png'} alt={film.fullTitle} className={'film-page-image'}/>
            {/*<img src={filmPlaceholder} width={'100%'} alt={film.fullTitle} className={'film-page-image'}/>*/}
            <div className={'film-page-bottom-row'}>
                <div className={'film-page-crew'}>
                    Film crew: {film.crew}
                </div>
                <div className={'film-page-share-button'} onClick={() => setShareOpen(!shareOpen)}>
                    SHARE
                </div>
            </div>
            {shareOpen &&
                <div className={'film-page-sharing-section'}>
                    <textarea className={'film-page-share-input'} rows={5} value={shareMessage}
                              onChange={(e) => setShareMessage(e.target.value)}
                              placeholder={'Write a post...'}
                    />
                    <div className={'film-page-post-button'} onClick={addPost}>
                        POST
                    </div>
                </div>
            }
        </div>
    )
}
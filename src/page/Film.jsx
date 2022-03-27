import React, {useEffect, useState} from 'react';
import './Film.scss';
import {useNavigate, useParams} from "react-router-dom";
import { getRequest, postRequest, tmdbGetRequest} from "../axios-wrapper";
import filmPlaceholder from "../image/film-placeholder.png";
import * as moment from "moment";
import {tmdbImageLink} from "../constant/constants";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export default function Film() {
    const { id } = useParams()
    const [film, setFilm] = useState(null);
    const [filmImages, setFilmImages] = useState(null);
    const [user, setUser] = useState(null);
    const [shareOpen, setShareOpen] = useState(false);
    const [shareMessage, setShareMessage] = useState('');
    const [mainImage, setMainImage] = useState(filmPlaceholder);
    const [imageFrom, setImageFrom] = useState(0);
    const [providers, setProviders] = useState(null);
    const [cast, setCast] = useState(null);

    const  navigate = useNavigate();

    const addPost = async (e) => {
            if(shareMessage.length > 0){
                const yourDate = new Date()
                const newDate = moment(yourDate, 'YYYY-MM-DD')
                const data = {
                    filmId: id,
                    userId: user.id,
                    message: shareMessage,
                    likes: 0,
                    date: newDate
                }

                await postRequest('/api/posts/add', data);
                navigate('/profile');
            }
    }

    const addFilmToList = () => {
        const data = {
            filmId: id,
            userId: user.id,
            userRated: 0,
            listType: 'watched',
            type: 'movie',
        }

        postRequest('/api/films/film/add', data);
    }

    useEffect(() => {
        const getData = async () => {
            const tmdbData = await tmdbGetRequest(`movie/${id}?`);
            setFilm(tmdbData.data);
            setMainImage(tmdbImageLink(tmdbData.data.poster_path));
            const tmdbImageData = await tmdbGetRequest(`movie/${id}/images?language=en-US&include_image_language=en,null`);
            setFilmImages(tmdbImageData.data.backdrops);
            const providersData = await tmdbGetRequest(`movie/${id}/watch/providers?`)
            setProviders(providersData.data.results);
            const castData = await tmdbGetRequest(`/movie/${id}/credits?`)
            setCast(castData.data?.cast);
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
                {film?.title}
            </div>
            <div className={'film-page-data'}>
                <span className={'film-page-year'}>Year: {film?.release_date}</span>
                <span className={'film-page-imdb'}>IMDB Rating: {film.vote_average}</span>
            </div>
            <img src={mainImage} alt={film?.title} className={'film-page-image'}/>
            <div className={'film-page-bottom-row'}>
                <div className={'film-page-bottom-image-container'}>
                    <div className={'film-page-bottom-arrow-container'}>
                        <ArrowBackIosIcon className={`film-page-bottom-image-arrow ${imageFrom === 0 && 'hidden'}`} onClick={() => setImageFrom(imageFrom-3)}/>
                    </div>
                    {filmImages?.slice(imageFrom, imageFrom+3).map(image => {
                        return (
                            <img key={image?.file_path} src={tmdbImageLink(image?.file_path, 'w300')} onClick={() => setMainImage(tmdbImageLink(image?.file_path))} className={'film-page-bottom-image'} alt={'film-image'}/>
                        )
                    })}
                    <div className={'film-page-bottom-arrow-container'}>
                        <ArrowForwardIosIcon className={`film-page-bottom-image-arrow ${imageFrom + 3 >= filmImages?.length && 'hidden'}`} onClick={() => setImageFrom(imageFrom+3)}/>
                    </div>
                </div>
                <div className={'film-page-share-button'} onClick={() => setShareOpen(!shareOpen)}>
                    SHARE
                </div>
                <div className={'film-page-share-button'} onClick={addFilmToList}>ADD TO LIST</div>
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
                <div className={'film-page-about'}>
                    <div className={'film-page-about-header'}>Plot:</div>
                    <div className={'film-page-about-content'}>{film?.overview}</div>
                </div>
                <div className={'film-page-watch-header'}>Where to watch?</div>
                <div className={'film-page-watch-container'}>
                    {providers?.GB?.flatrate?.slice(0, 3).map( provider => {
                        return <img key={provider.provider_name} className={'film-page-watch-provider-image'} src={tmdbImageLink(provider.logo_path)} alt={provider.provider_name} />
                    })}
                </div>
                <div className={'film-page-cast-header'}>Cast</div>
                <div className={'film-page-bottom-cast-container'}>
                    {cast?.slice(0, 5).map(person => {
                        return (
                            <div key={person.name} className={'film-page-bottom-cast-person'}>
                                <img className={'film-page-bottom-cast-person-image'} src={ tmdbImageLink(person.profile_path, 'w200')} alt={person.name}/>
                                <div className={'film-page-bottom-cast-person-name'}>{person.name}</div>
                                <div className={'film-page-bottom-cast-person-character'}>{(person.character)}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
import React, {useContext, useEffect, useState} from 'react';
import './Film.scss';
import {useNavigate, useParams} from "react-router-dom";
import {postRequest, tmdbGetRequest} from "../axios-wrapper";
import filmPlaceholder from "../image/film-placeholder.png";
import * as moment from "moment";
import {tmdbImageLink} from "../constant/constants";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {UserContext} from "../contexts/UserContext";
import Fab from "@mui/material/Fab";
import MessageIcon from "@mui/icons-material/Message";
import {Tooltip} from "@mui/material";
import {PostsDialog} from "../common/Dialogs";
import Alert from "@mui/material/Alert";

export default function Film() {
    const {id} = useParams()
    const {user} = useContext(UserContext);
    const [shareOpen, setShareOpen] = useState(false);
    const [shareMessage, setShareMessage] = useState('');
    const [mainImage, setMainImage] = useState(filmPlaceholder);
    const [imageFrom, setImageFrom] = useState(0);
    const [movie, setMovie] = useState(null);
    const [showPostsDialog, setShowPostsDialog] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    const navigate = useNavigate();

    const addPost = async (e) => {
        if (shareMessage.length > 0) {
            const yourDate = new Date()
            const newDate = moment(yourDate, 'YYYY-MM-DD')
            const data = {
                filmId: id,
                userId: user.id,
                message: shareMessage,
                likes: 0,
                date: newDate,
                type: 'movie'
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
            listType: 'watch_later',
            type: 'movie',
        }

        setShowSuccessAlert(true);
        setTimeout(() => {
            setShowSuccessAlert(false);
        }, 3000);

        postRequest('/api/films/film/add', data);
    }

    useEffect(() => {
        const getData = async () => {
            const movieData = await tmdbGetRequest(`/movie/${id}?language=en-US&include_image_language=en,null&append_to_response=watch/providers,credits,images&`)
            setMovie(movieData.data);
            setMainImage(tmdbImageLink(movieData.data.poster_path));
        }

        if (user) {
            getData();
        }
    }, [user]);

    const showImageNumber = () => {
        if (window.innerWidth > 768) {
            return 3;
        }
        return 1;
    }

    if (movie === null) {
        return null;
    }

    return (
        <div className={'film-page'}>
            <Alert className={`signup-alert ${!showSuccessAlert && 'hidden'}`} severity="success">Successfully added to
                your list</Alert>
            <div className={'film-page-header'}>
                {movie?.title}
            </div>
            <div className={'film-page-data'}>
                <span className={'film-page-year'}>Release date: {movie?.release_date}</span>
                <span className={'film-page-imdb'}>IMDB Rating: {movie.vote_average}</span>
                <Tooltip title="View user reviews">
                    <Fab sx={{marginLeft: '20px'}}
                         size="small"
                         onClick={() => setShowPostsDialog(true)}><MessageIcon/>
                    </Fab>
                </Tooltip>
                <PostsDialog filmId={id} open={showPostsDialog} onClose={setShowPostsDialog} fType="movie"/>
            </div>
            <img src={mainImage} alt={movie?.title} className={'film-page-image'}/>
            <div className={'film-page-bottom-row'}>
                <div className={'film-page-bottom-image-container'}>
                    <div className={'film-page-bottom-arrow-container'}>
                        <ArrowBackIosIcon className={`film-page-bottom-image-arrow ${imageFrom === 0 && 'hidden'}`}
                                          onClick={() => setImageFrom(imageFrom - showImageNumber())}/>
                    </div>
                    {movie?.images?.backdrops?.slice(imageFrom, imageFrom + showImageNumber()).map(image => {
                        return (
                            <img key={image?.file_path} src={tmdbImageLink(image?.file_path, 'w300')}
                                 onClick={() => setMainImage(tmdbImageLink(image?.file_path))}
                                 className={'film-page-bottom-image'} alt={'film-image'}/>
                        )
                    })}
                    <div className={'film-page-bottom-arrow-container'}>
                        <ArrowForwardIosIcon
                            className={`film-page-bottom-image-arrow ${imageFrom + showImageNumber() >= movie?.images?.backdrops?.length && 'hidden'}`}
                            onClick={() => setImageFrom(imageFrom + showImageNumber())}/>
                    </div>
                </div>
                <div className={'film-page-share-button'} onClick={() => setShareOpen(!shareOpen)}>
                    WRITE REVIEW
                </div>
                <div className={'film-page-share-button'} onClick={addFilmToList}>WATCH LATER</div>
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
                    <div className={'film-page-about-content'}>{movie?.overview}</div>
                </div>
                <div className={'film-page-watch-header'}>Where to watch?</div>
                <div className={'film-page-watch-container'}>
                    {movie['watch/providers']?.results?.GB?.flatrate?.slice(0, 3).map(provider => {
                        return <img key={provider.provider_name} className={'film-page-watch-provider-image'}
                                    src={tmdbImageLink(provider.logo_path)} alt={provider.provider_name}/>
                    })}
                </div>
                <div className={'film-page-cast-header'}>Cast</div>
                <div className={'film-page-bottom-cast-container'}>
                    {movie?.credits?.cast?.slice(0, 5).map(person => {
                        return (<CastPerson key={person.name} person={person}/>)
                    })}
                </div>
            </div>
        </div>
    )
}

export function CastPerson({person}) {
    const [personExternals, setPersonExternals] = useState(null);

    useEffect(async () => {
        const personExternalsData = await tmdbGetRequest(`/person/${person.id}/external_ids?`);
        setPersonExternals(personExternalsData.data);
    }, []);

    return (
        <a href={`https://www.imdb.com/name/${personExternals?.imdb_id}`} className={'film-page-bottom-cast-person'}>
            <img className={'film-page-bottom-cast-person-image'}
                 src={tmdbImageLink(person.profile_path, 'w200')} alt={person.name}/>
            <div className={'film-page-bottom-cast-person-name'}>{person.name}</div>
            <div className={'film-page-bottom-cast-person-character'}>{(person.character)}</div>
        </a>
    );
}
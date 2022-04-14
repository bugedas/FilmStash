import './TvSeries.scss';
import {useNavigate, useParams} from "react-router-dom";
import React, {useContext, useEffect, useState} from "react";
import tvPlaceholder from "../image/film-placeholder.png";
import * as moment from "moment";
import {deleteRequest, getRequest, postRequest, tmdbGetRequest} from "../axios-wrapper";
import {tmdbImageLink} from "../constant/constants";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import {UserContext} from "../contexts/UserContext";
import {PostsDialog} from "../common/Dialogs";
import MessageIcon from '@mui/icons-material/Message';
import Fab from "@mui/material/Fab";
import {Tooltip} from "@mui/material";
import Alert from "@mui/material/Alert";
import {CastPerson} from "./Film";

export default function TvSeries() {

    const {id} = useParams()
    const [tv, setTv] = useState(null);
    const {user} = useContext(UserContext);
    const [shareOpen, setShareOpen] = useState(false);
    const [shareMessage, setShareMessage] = useState('');
    const [mainImage, setMainImage] = useState(tvPlaceholder);
    const [imageFrom, setImageFrom] = useState(0);
    const [watching, setWatching] = useState(false);
    const [watchingTvData, setWatchingTvData] = useState(false);
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
                type: 'tv'
            }

            await postRequest('/api/posts/add', data);
            navigate('/profile');
        }
    }

    const addtvToList = () => {
        const data = {
            filmId: id,
            userId: user.id,
            userRated: 0,
            listType: 'watch_later',
            type: 'tv',
        }

        setShowSuccessAlert(true);
        setTimeout(() => {
            setShowSuccessAlert(false);
        }, 3000);

        postRequest('/api/films/film/add', data);
    }

    const handleWatchingClick = () => {
        if (watching) {
            deleteRequest(`/api/watching-now/${watchingTvData?.id}`);
            setWatching(false);
            setWatchingTvData(null);
        } else {
            const data = {
                tvId: id,
                userId: user.id,
                seasonNr: 0,
                episodeNr: 0,
                finished: false,
                stillWatching: true,
            }
            setWatching(true);
            postRequest('/api/watching-now/add', data);
        }
    }

    useEffect(() => {
        const getData = async () => {
            const tvData = await tmdbGetRequest(`/tv/${id}?language=en-US&include_image_language=en,null&append_to_response=watch/providers,credits,images&`);
            setTv(tvData.data);
            setMainImage(tmdbImageLink(tvData.data.poster_path));
            const watchingData = await getRequest(`/api/watching-now/${user.id}/${id}`);
            setWatching(watchingData?.data?.stillWatching || watchingData?.data?.finished);
            setWatchingTvData(watchingData?.data);
        }

        if (user) {
            getData();
        }
    }, [user]);

    if (tv === null) {
        return null;
    }

    return (
        <div className={'tv-page'}>
            <Alert className={`signup-alert ${!showSuccessAlert && 'hidden'}`} severity="success">Successfully added to
                your list</Alert>
            <div className={'tv-page-header'}>
                {tv?.name}
            </div>
            <div className={'tv-page-data'}>
                <span className={'tv-page-year'}>Year: {tv?.first_air_date}</span>
                <span className={'tv-page-imdb'}>IMDB Rating: {tv?.vote_average}</span>
                <Tooltip title="View user reviews">
                    <Fab sx={{marginLeft: '20px'}}
                         size="small"
                         onClick={() => setShowPostsDialog(true)}><MessageIcon/>
                    </Fab>
                </Tooltip>
            </div>
            <PostsDialog filmId={id} open={showPostsDialog} onClose={setShowPostsDialog} fType="tv"/>
            <img src={mainImage} alt={tv?.name} className={'tv-page-image'}/>
            <div className={'tv-page-bottom-row'}>
                <div className={'tv-page-bottom-image-container'}>
                    <div className={'tv-page-bottom-arrow-container'}>
                        <ArrowBackIosIcon className={`tv-page-bottom-image-arrow ${imageFrom === 0 && 'hidden'}`}
                                          onClick={() => setImageFrom(imageFrom - 3)}/>
                    </div>
                    {tv?.images?.backdrops?.slice(imageFrom, imageFrom + 3).map(image => {
                        return (
                            <img key={image?.file_path} src={tmdbImageLink(image?.file_path, 'w300')}
                                 onClick={() => setMainImage(tmdbImageLink(image?.file_path))}
                                 className={'tv-page-bottom-image'} alt={'tv-image'}/>
                        )
                    })}
                    <div className={'tv-page-bottom-arrow-container'}>
                        <ArrowForwardIosIcon
                            className={`tv-page-bottom-image-arrow ${imageFrom + 3 >= tv?.images?.backdrops.length && 'hidden'}`}
                            onClick={() => setImageFrom(imageFrom + 3)}/>
                    </div>
                </div>
                <div className={'tv-page-share-button'} onClick={() => setShareOpen(!shareOpen)}>
                    WRITE REVIEW
                </div>
                <div className={'tv-page-share-button'} onClick={addtvToList}>ADD TO LIST</div>
                <div className={`tv-page-share-button ${watching && 'watching'}`}
                     onClick={handleWatchingClick}>{watching ? 'STOP WATCHING' : 'START WATCHING'}</div>
                {shareOpen &&
                <div className={'tv-page-sharing-section'}>
                    <textarea className={'tv-page-share-input'} rows={5} value={shareMessage}
                              onChange={(e) => setShareMessage(e.target.value)}
                              placeholder={'Write a post...'}
                    />
                    <div className={'tv-page-post-button'} onClick={addPost}>
                        POST
                    </div>
                </div>
                }
                <div className={'tv-page-about'}>
                    <div className={'tv-page-about-season-count'}><span
                        className={'tv-page-about-season-count-header'}>Seasons:</span> {tv?.number_of_seasons}</div>
                    <div className={'tv-page-about-header'}>Plot:</div>
                    <div className={'tv-page-about-content'}>{tv?.overview}</div>
                </div>
                <div className={'tv-page-watch-header'}>Where to watch?</div>
                <div className={'tv-page-watch-container'}>
                    {tv['watch/providers']?.results?.GB?.flatrate?.slice(0, 3).map(provider => {
                        return <img key={provider.provider_name} className={'tv-page-watch-provider-image'}
                                    src={tmdbImageLink(provider.logo_path)} alt={provider.provider_name}/>
                    })}
                </div>
                <div className={'tv-page-cast-header'}>Cast</div>
                <div className={'tv-page-bottom-cast-container'}>
                    {tv?.credits?.cast?.slice(0, 5).map(person => {
                        return (<CastPerson key={person.name} person={person}/>)
                    })}
                </div>
            </div>
        </div>
    )
}
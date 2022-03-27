import './TvSeries.scss';
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import tvPlaceholder from "../image/film-placeholder.png";
import * as moment from "moment";
import {getRequest, postRequest, tmdbGetRequest} from "../axios-wrapper";
import {tmdbImageLink} from "../constant/constants";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

export default function TvSeries() {

    const { id } = useParams()
    const [tv, setTv] = useState(null);
    const [tvImages, setTvImages] = useState(null);
    const [user, setUser] = useState(null);
    const [shareOpen, setShareOpen] = useState(false);
    const [shareMessage, setShareMessage] = useState('');
    const [mainImage, setMainImage] = useState(tvPlaceholder);
    const [imageFrom, setImageFrom] = useState(0);
    const [providers, setProviders] = useState(null);
    const [cast, setCast] = useState(null);
    const [watching, setWatching] = useState(false);

    const  navigate = useNavigate();

    const addPost = async (e) => {
        if(shareMessage.length > 0){
            const yourDate = new Date()
            const newDate = moment(yourDate, 'YYYY-MM-DD')
            const data = {
                tvId: id,
                userId: user.id,
                message: shareMessage,
                likes: 0,
                date: newDate
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
            listType: 'watched',
            type: 'tv',
        }

        postRequest('/api/films/film/add', data);
    }

    const startWatching = () => {
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

    useEffect(() => {
        const getData = async () => {
            const tmdbData = await tmdbGetRequest(`tv/${id}?`);
            setTv(tmdbData.data);
            setMainImage(tmdbImageLink(tmdbData.data.poster_path));
            const tmdbImageData = await tmdbGetRequest(`tv/${id}/images?language=en-US&include_image_language=en,null`);
            setTvImages(tmdbImageData.data.backdrops);
            const providersData = await tmdbGetRequest(`tv/${id}/watch/providers?`)
            setProviders(providersData.data.results);
            const castData = await tmdbGetRequest(`/tv/${id}/credits?`)
            setCast(castData.data?.cast);
            const userData = await getRequest(`/api/user/me`);
            setUser(userData.data);
            const watchingData = await getRequest(`/api/watching-now/${userData.data.id}/${id}`);
            setWatching(watchingData?.data?.stillWatching);
        }

        getData();
    }, []);

    if(tv === null){
        return null;
    }

    return (
        <div className={'tv-page'}>
            <div className={'tv-page-header'}>
                {tv?.name}
            </div>
            <div className={'tv-page-data'}>
                <span className={'tv-page-year'}>Year: {tv?.first_air_date}</span>
                <span className={'tv-page-imdb'}>IMDB Rating: {tv?.vote_average}</span>
            </div>
            <img src={mainImage} alt={tv?.name} className={'tv-page-image'}/>
            <div className={'tv-page-bottom-row'}>
                <div className={'tv-page-bottom-image-container'}>
                    <div className={'tv-page-bottom-arrow-container'}>
                        <ArrowBackIosIcon className={`tv-page-bottom-image-arrow ${imageFrom === 0 && 'hidden'}`} onClick={() => setImageFrom(imageFrom-3)}/>
                    </div>
                    {tvImages?.slice(imageFrom, imageFrom+3).map(image => {
                        return (
                            <img key={image?.file_path} src={tmdbImageLink(image?.file_path, 'w300')} onClick={() => setMainImage(tmdbImageLink(image?.file_path))} className={'tv-page-bottom-image'} alt={'tv-image'}/>
                        )
                    })}
                    <div className={'tv-page-bottom-arrow-container'}>
                        <ArrowForwardIosIcon className={`tv-page-bottom-image-arrow ${imageFrom + 3 >= tvImages?.length && 'hidden'}`} onClick={() => setImageFrom(imageFrom+3)}/>
                    </div>
                </div>
                <div className={'tv-page-share-button'} onClick={() => setShareOpen(!shareOpen)}>
                    SHARE
                </div>
                <div className={'tv-page-share-button'} onClick={addtvToList}>ADD TO LIST</div>
                <div className={'tv-page-share-button'} onClick={startWatching}>{watching ? 'STOP WATCHING' : 'START WATCHING'}</div>
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
                    <div className={'tv-page-about-season-count'}><span className={'tv-page-about-season-count-header'}>Seasons:</span> {tv?.number_of_seasons}</div>
                    <div className={'tv-page-about-header'}>Plot:</div>
                    <div className={'tv-page-about-content'}>{tv?.overview}</div>
                </div>
                <div className={'tv-page-watch-header'}>Where to watch?</div>
                <div className={'tv-page-watch-container'}>
                    {providers?.GB?.flatrate?.slice(0, 3).map( provider => {
                        return <img key={provider.provider_name} className={'tv-page-watch-provider-image'} src={tmdbImageLink(provider.logo_path)} alt={provider.provider_name} />
                    })}
                </div>
                <div className={'tv-page-cast-header'}>Cast</div>
                <div className={'tv-page-bottom-cast-container'}>
                    {cast?.slice(0, 5).map(person => {
                        return (
                            <div key={person.name} className={'tv-page-bottom-cast-person'}>
                                <img className={'tv-page-bottom-cast-person-image'} src={ tmdbImageLink(person.profile_path, 'w200')} alt={person.name}/>
                                <div className={'tv-page-bottom-cast-person-name'}>{person.name}</div>
                                <div className={'tv-page-bottom-cast-person-character'}>{(person.character)}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
import {useContext, useEffect, useState} from "react";
import {getRequest, putRequest, tmdbGetRequest} from "../axios-wrapper";
import {tmdbImageLink} from "../constant/constants";
import './WatchingNow.scss';
import Select from 'react-select';
import {getMatchingTvs, selectStylesOnDark} from "../util/BaseUtils";
import ActionButton from "../common/buttons/ActionButton";
import {UserContext} from "../contexts/UserContext";

export default function WatchingNow() {
    const {user} = useContext(UserContext);
    const [myWatching, setMyWatching] = useState(null);
    const [friends, setFriends] = useState(null);
    const [selectedFriendTvs, setSelectedFriendTvs] = useState(null);
    const [myMatching, setMyMatching] = useState([]);
    const [friendMatching, setFriendMatching] = useState([]);
    const [friendSelected, setFriendSelected] = useState([]);

    useEffect(() => {
        const getData = async () => {
            const watchingData = await getRequest(`/api/watching-now/${user.id}`);
            setMyWatching(watchingData.data);
            const friendsData = await getRequest(`/api/friends/user/full/${user.id}`);
            const friendsMapped = friendsData.data.map(fr => {
                return {value: fr, label: fr.name}
            })
            setFriends(friendsMapped);
        }

        if (user) {
            getData();
        }
    }, [user]);

    const onChangeFriend = async (e) => {
        const watchingFriendData = await getRequest(`/api/watching-now/${e.value.id}`);
        const watchingData = await getRequest(`/api/watching-now/${user.id}`);
        setMyWatching(watchingData.data);

        setFriendSelected(e.value.name);
        const {
            myMatchingTvs,
            friendMatchingTvs
        } = getMatchingTvs(watchingData.data.filter(watching => !watching.finished), watchingFriendData.data.filter(watching => !watching.finished));
        // console.log(friendMatchingTvs);
        setMyMatching(myMatchingTvs);
        setFriendMatching(friendMatchingTvs);

        const myFilteredAll = watchingData.data.filter(watching => !myMatchingTvs.find(match => watching === match));
        setMyWatching(myFilteredAll);
        const friendFilteredAll = watchingFriendData.data.filter(watching => !friendMatchingTvs.find(match => watching === match));
        setSelectedFriendTvs(friendFilteredAll);
    }

    if (!myWatching) {
        return null;
    }
    return (
        <div className={'watching-now-container'}>
            <div className={'watching-now-title'}>TV Series I'm watching:</div>
            <div className={'watching-now-title'}>
                <span>Friend to compare:</span>
                <div className={'watching-now-dropdown-container'}>
                    <Select styles={selectStylesOnDark} options={friends} onChange={onChangeFriend}/>
                </div>
            </div>
            {friendMatching.length > 0 &&
            <>
                <div className={'watching-now-title-list'}>
                    Matching tv series
                </div>
                <div className={'watching-now-full-section-wrapper'}>
                    <div className={'watching-now-person-section'}>
                        <div className={'watching-now-person-name'}>My</div>
                        {myMatching?.filter(watching => !watching.finished)?.map(tv => {
                            return (
                                <WatchingTv key={tv.id} isMe={true} watching={tv}/>
                            )
                        })}
                    </div>
                    <div className={'watching-now-person-section'}>
                        <div className={'watching-now-person-name'}>{friendSelected}</div>
                        {friendMatching?.filter(watching => !watching.finished)?.map(tv => {
                            return (
                                <WatchingTv key={tv.id} isMe={false} watching={tv}/>
                            )
                        })}
                    </div>
                </div>
            </>}
            {selectedFriendTvs && <div style={{marginTop: '80px'}} className={'watching-now-title-list'}>
                All tv series
            </div>}
            <div className={selectedFriendTvs && 'watching-now-full-section-wrapper'}>
                <div className={`watching-now-person-section ${!selectedFriendTvs && 'alone'}`}>
                    {selectedFriendTvs && <div className={'watching-now-person-name'}>My</div>}
                    {myWatching.filter(watching => !watching.finished).map(tv => {
                        return (
                            <WatchingTv key={tv.id} isMe={true} watching={tv}/>
                        )
                    })}
                </div>
                {selectedFriendTvs &&
                <div className={'watching-now-person-section'}>
                    <div className={'watching-now-person-name'}>{friendSelected}</div>
                    {selectedFriendTvs.filter(watching => !watching.finished).map(tv => {
                        return (
                            <WatchingTv key={tv.id} isMe={false} watching={tv}/>
                        )
                    })}
                </div>
                }
            </div>
        </div>
    )
}

function WatchingTv({isMe, watching}) {
    const [tv, setTv] = useState();
    const [episodeState, setEpisodeState] = useState(watching.episodeNr);
    const [seasonState, setSeasonState] = useState(watching.seasonNr);

    useEffect(() => {
        const getData = async () => {
            const tmdbData = await tmdbGetRequest(`tv/${watching.tvId}?`);
            setTv(tmdbData.data);
        }
        getData();
    }, []);

    const nextSeasonEpisode = () => {
        if (seasonState === 0) {
            return {nextSeason: 1, nextEpisode: 1};
        }
        if (episodeState === tv?.seasons[seasonState]?.episode_count && seasonState === tv?.number_of_seasons) {
            return {nextSeason: 0, nextEpisode: 0};
        }
        if (episodeState === tv?.seasons[seasonState]?.episode_count) {
            return {nextSeason: seasonState + 1, nextEpisode: 1};
        }
        return {nextSeason: seasonState, nextEpisode: episodeState + 1};
    }

    const clickNextEpisode = () => {

        const thisIsLast = episodeState + 1 === tv?.seasons[seasonState]?.episode_count && seasonState === tv?.number_of_seasons;

        const data = {
            tvId: watching.tvId,
            userId: watching.userId,
            seasonNr: nextSeasonEpisode().nextSeason,
            episodeNr: nextSeasonEpisode().nextEpisode,
            finished: watching.finished || thisIsLast,
            stillWatching: !thisIsLast
        }

        setSeasonState(nextSeasonEpisode().nextSeason);
        setEpisodeState(nextSeasonEpisode().nextEpisode);
        putRequest(`/api/watching-now/${watching.id}`, data);
    }

    if (nextSeasonEpisode().nextSeason === 0) {
        return null;
    }

    return (
        <div className={'watching-now-list-item'}>
            <a href={`/tv/${tv?.id}`}><img className={'watching-now-tv-image'}
                                           src={tmdbImageLink(tv?.poster_path, 'w300')} alt={'image'}/></a>
            <div className={'watching-now-about'}>
                <div className={'watching-now-about-name'}>{tv?.name}</div>
                <div className={'watching-now-about-seasons'}>Seasons: {tv?.number_of_seasons}</div>
                {isMe ? <ActionButton sx={{marginTop: '20px'}} onClick={clickNextEpisode}>
                        I watched Season {nextSeasonEpisode().nextSeason} Episode {nextSeasonEpisode().nextEpisode}
                    </ActionButton> :
                    <div
                        className={'watching-now-about-friend-episodes'}>Season {watching.seasonNr} Episode {watching.episodeNr}</div>}
            </div>
        </div>
    )
}
import React, {useEffect, useState} from 'react';
import FilmCard from "../Common/FilmCard";
import './HomeLoggedIn.css';
import PostsByIds from "../Common/PostsByIds";
import {getRequest, getImdbRequest} from "../axios-wrapper";
import FriendsSidebar from "../Common/FriendsSidebar";

export default function HomeLoggedIn() {

    const [allFilms, setAllFilms] = useState(null);
    const [user, setUser] = useState(null);
    const [friends, setFriends] = useState(null);

    useEffect(() => {
        const getData = async () => {
            const filmsData = await getImdbRequest(`top250.json`);
            setAllFilms(filmsData.data.items);
            const userData = await getRequest(`/api/user/me`);
            setUser(userData.data);
            const friendsData = await getRequest(`/api/friends/user/${userData.data.id}`);
            const friendIds = friendsData.data.map(f => {
                return f.followedId;
            })
            setFriends(friendIds);
        }

        getData();
    }, []);

    if(allFilms === null || friends == null) {
        return null;
    }

    return (
        <div className={'home'}>
            <div className={'main-sections-wrapper'}>
                <div className={'recommended-section'}>
                    {allFilms.slice(0, 6).map(film => {
                        return (
                            <FilmCard key={film.id} image={film.image} fullTitle={film.fullTitle} filmId={film.id}/>
                        )
                    })}
                </div>

                <div className={'posts-section'}>
                    <PostsByIds userIds={friends}/>
                </div>
            </div>
            <div className={'friends-sidebar-section'}>
                <FriendsSidebar userId={user.id}/>
            </div>
        </div>
    )
}
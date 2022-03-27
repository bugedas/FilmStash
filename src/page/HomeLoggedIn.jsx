import React, {useEffect, useState} from 'react';
import FilmCard from "../common/FilmCard";
import './HomeLoggedIn.scss';
import PostsByIds from "../common/PostsByIds";
import {getRequest, getImdbRequest} from "../axios-wrapper";
import FriendsSidebar from "../common/FriendsSidebar";
import FilmList from "../common/FilmList";
import FilmCategory from "../common/FilmCategory";

export default function HomeLoggedIn() {

    const [allFilms, setAllFilms] = useState(null);
    const [user, setUser] = useState(null);
    const [friends, setFriends] = useState(null);

    useEffect(() => {
        const getData = async () => {
            const filmsData = await getImdbRequest(`top250.json`);
            setAllFilms(filmsData.data.items);
            const userData = await getRequest(`/api/user/me`);
            setUser(userData?.data);
            const friendsData = await getRequest(`/api/friends/user/${userData?.data?.id}`);
            const friendIds = friendsData?.data?.map(f => {
                return f.followedId;
            })
            setFriends(friendIds);
        };
        getData();
    }, []);

    if(allFilms === null || friends === null || user === null) {
        return null;
    }

    return (
        <div className={'home-l-home'}>
            <div className={'home-l-main-sections-wrapper'}>
                <div className={'home-l-recommended-section'}>
                    <FilmCategory category={'Trending this week'} url={'trending/all/week'}/>
                    <FilmCategory category={'Trending today'} url={'trending/all/day'}/>
                </div>

                <div className={'home-l-posts-section'}>
                    <PostsByIds userIds={friends}/>
                </div>
            </div>
            <div className={'home-l-sidebar-section'}>
                <FriendsSidebar userId={user?.id}/>
                <FilmList userId={user?.id}/>
            </div>
        </div>
    )
}
import React, {useContext, useEffect, useState} from 'react';
import './HomeLoggedIn.scss';
import PostsByIds from "../common/PostsByIds";
import {getRequest} from "../axios-wrapper";
import FriendsSidebar from "../common/FriendsSidebar";
import FilmList from "../common/FilmList";
import FilmCategory from "../common/FilmCategory";
import {UserContext} from "../contexts/UserContext";

export default function HomeLoggedIn() {
    const {user} = useContext(UserContext);
    const [friends, setFriends] = useState(null);

    useEffect(() => {
        const getData = async () => {
            const friendsData = await getRequest(`/api/friends/user/${user?.id}`);
            const friendIds = friendsData?.data?.map(f => {
                return f.followedId;
            })
            setFriends(friendIds);
        };
        if (user) {
            getData();
        }
    }, [user]);

    if (friends === null || user === null) {
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
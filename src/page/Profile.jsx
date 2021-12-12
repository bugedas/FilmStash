import React, {useEffect, useState} from 'react';
import './Profile.css';
import {getRequest} from "../axios-wrapper";
import PostsByIds from "../common/PostsByIds";
import FriendsSidebar from "../common/FriendsSidebar";
import FilmList from "../common/FilmList";

export default function Profile() {

    const [currentUser, setCurrentUser] = useState(null);
    const [friends, setFriends] = useState(null);

    useEffect(() => {

        const getUserData = async () => {
            const userData = await getRequest(`/api/user/me`);
            setCurrentUser(userData.data);
            const friendsData = await getRequest(`/api/friends/user/${userData?.data?.id}`);
            const friendIds = friendsData.data.map(f => {
                return f.followedId;
            })
            setFriends(friendIds);
        }

        getUserData();
    }, []);

    if(currentUser === null){
        return null;
    }

    return (

        <div className={'profile-wrapper'}>
            <div className="profile-container">
                <div className="container">
                    <div className="profile-info">
                        <div className="profile-avatar">
                            {
                                currentUser.imageUrl ? (
                                    <img src={currentUser.imageUrl} alt={currentUser.name}/>
                                ) : (
                                    <div className="text-avatar">
                                        <span>{currentUser.name}</span>
                                    </div>
                                )
                            }
                        </div>
                        <div className="profile-name">
                            <h2>{currentUser?.name}</h2>
                            <p className="profile-email">{currentUser.email}</p>
                        </div>
                    </div>
                </div>
                <div className={'posts-section'}>
                    <PostsByIds userIds={[currentUser.id]}/>
                </div>
            </div>
            <div className={'sidebar-section'}>
                <FriendsSidebar userId={currentUser.id}/>
                <FilmList userId={currentUser.id}/>
            </div>
        </div>
    );
}
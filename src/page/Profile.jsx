import React, {useEffect, useState} from 'react';
import './Profile.scss';
import {getRequest} from "../axios-wrapper";
import PostsByIds from "../common/PostsByIds";
import FriendsSidebar from "../common/FriendsSidebar";
import FilmList from "../common/FilmList";
import defaultUser from "../image/default-user.png";

export default function Profile() {

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const getUserData = async () => {
            const userData = await getRequest(`/api/user/me`);
            setCurrentUser(userData.data);
        }

        getUserData();
    }, []);

    if(currentUser === null){
        return null;
    }

    return (

        <div className={'profile-wrapper'}>
            <div className="profile-container">
                <div className="profile-info">
                    <div className="profile-avatar">
                        <img src={currentUser.imageUrl || defaultUser} alt={currentUser.name}/>
                    </div>
                    <div className="profile-name">
                        <h2>{currentUser?.name}</h2>
                        <p className="profile-email">{currentUser.email}</p>
                    </div>
                </div>
                <div className={'profile-posts-section'}>
                    <PostsByIds userIds={[currentUser.id]}/>
                </div>
            </div>
            <div className={'profile-sidebar-section'}>
                <FriendsSidebar userId={currentUser.id}/>
                <FilmList userId={currentUser.id}/>
            </div>
        </div>
    );
}
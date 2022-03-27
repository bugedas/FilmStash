import React, {useEffect, useState} from 'react';
import './User.scss';
import {deleteRequest, getRequest} from "../axios-wrapper";
import PostsByIds from "../common/PostsByIds";
import {useParams} from "react-router-dom";
import {addFriendForUser, isAdmin, isUserFriend, removeUser} from "../util/axiosUtils";
import FriendsSidebar from "../common/FriendsSidebar";
import FilmList from "../common/FilmList";
import defaultUser from "../image/default-user.png";

export default function Profile() {

    const {id} = useParams();

    const [currentUser, setCurrentUser] = useState(null);
    const [friend, setFriend] = useState(null);
    const [amIAdmin, setAmIAdmin] = useState(false);

    useEffect(() => {

        const getUserData = async () => {
            const userData = await getRequest(`/api/user/id/${id}`);
            setCurrentUser(userData.data);
            const isFriend = await isUserFriend(userData.data.id);
            setFriend(isFriend);
            const amAdmin = await isAdmin();
            setAmIAdmin(amAdmin);
        }

        getUserData();
    }, []);

    const removeFriend = () => {
        deleteRequest(`/api/friends/${friend.id}`);
        setFriend({...friend, isFriend: false});
    }

    const addFriend = async () => {
        const f = await addFriendForUser(currentUser.id);
        setFriend(f);
    }

    if(currentUser === null){
        return null;
    }

    return (
        <div className={'user-wrapper'}>
            <div className="user-container">
                <div className="user-container">
                    <div className="user-info">
                        <div className="user-avatar">
                            <img src={currentUser.imageUrl || defaultUser} alt={currentUser.name}/>
                        </div>
                        <div className="user-name">
                            <h2>{currentUser?.name}</h2>
                            <p className="user-email">{currentUser.email}</p>
                        </div>
                    </div>
                    {friend && <div className={'user-interactions-section'}>
                        {friend.isFriend ?
                            <button className={'user-interact-friend-button'} onClick={removeFriend}>REMOVE FRIEND</button> :
                            <button className={'user-interact-friend-button'} onClick={addFriend}>ADD FRIEND</button>
                        }
                        {amIAdmin && <button className={'user-interact-friend-button'} onClick={() => removeUser(currentUser.id)}>REMOVE USER</button>}
                    </div>}
                </div>
                <div className={'user-posts-section'}>
                    <PostsByIds userIds={[currentUser.id]}/>
                </div>
            </div>
            <div className={'user-section'}>
                <FriendsSidebar userId={currentUser.id}/>
                <FilmList userId={currentUser.id}/>
            </div>
        </div>
    );
}
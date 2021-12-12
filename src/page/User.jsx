import React, {useEffect, useState} from 'react';
import './User.css';
import {deleteRequest, getRequest, postRequest} from "../axios-wrapper";
import PostsByIds from "../common/PostsByIds";
import {useParams} from "react-router-dom";
import {addFriendForUser, isAdmin, isUserFriend, removeUser} from "../util/axiosUtils";
import FriendsSidebar from "../common/FriendsSidebar";
import FilmList from "../common/FilmList";

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
                    {friend && <div className={'user-interactions-section'}>
                        {friend.isFriend ?
                            <button className={'interact-friend-button'} onClick={removeFriend}>REMOVE FRIEND</button> :
                            <button className={'interact-friend-button'} onClick={addFriend}>ADD FRIEND</button>
                        }
                        {amIAdmin && <button className={'interact-friend-button'} onClick={() => removeUser(currentUser.id)}>REMOVE USER</button>}
                    </div>}
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
import React, {useEffect, useState} from 'react';
import './Profile.css';
import {getRequest} from "../axios-wrapper";
import PostsByIds from "../common/PostsByIds";
import {useParams} from "react-router-dom";

export default function Profile() {

    const {id} = useParams();

    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {

        const getUserData = async () => {
            const userData = await getRequest(`/api/user/id/${id}`);
            setCurrentUser(userData.data);
        }

        getUserData();
    }, []);

    if(currentUser === null){
        return null;
    }

    return (
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
    );
}
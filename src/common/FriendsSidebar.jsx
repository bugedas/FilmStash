import React, {useEffect, useState} from 'react';
import './FriendsSidebar.css';
import {getRequest} from "../axios-wrapper";

export default function FriendsSidebar(props) {
    const [friends, setFriends] = useState(null);

    useEffect(async () => {
        const friendsData = await getRequest(`/api/friends/user/${props.userId}`);
        setFriends(friendsData.data);
    }, []);

    if(friends === null){
        return null;
    }

    return (
        <div className={'friends-section'}>
            <div className={'friends-section-header'}>FRIENDS</div>
            {friends.map(f => {
                return (<FriendLine friendId={f.followedId}/>)
            })}
        </div>
    )
}

function FriendLine(props) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const getData = async () => {
            const userData = await getRequest(`/api/user/id/${props.friendId}`);
            setUser(userData.data);
        }
        getData();
    }, []);

    if(user === null){
        return null;
    }

    return (
        <div className={'friend-line'}>
            <a href={`/user/${user.id}`}>{user.name}</a>
        </div>
    )
}
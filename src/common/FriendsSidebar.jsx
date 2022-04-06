import React, {useEffect, useState} from 'react';
import './FriendsSidebar.scss';
import {getRequest} from "../axios-wrapper";
import {FriendsDialog} from "./Dialogs";
import ActionButton from "./buttons/ActionButton";

export default function FriendsSidebar(props) {
    const [friends, setFriends] = useState(null);
    const [friendsDialog, setFriendsDialog] = useState(false);

    useEffect(async () => {
        const friendsData = await getRequest(`/api/friends/user/full/${props.userId}`);
        setFriends(friendsData.data.reverse());
    }, []);

    if (friends === null) {
        return null;
    }

    return (
        <div className={'friends-section'}>
            <div className={'friends-section-header'}>Following</div>
            {friends.slice(0, 5).map(f => {
                return (<FriendLine key={f.id} friend={f}/>)
            })}
            <ActionButton sx={{marginTop: '20px'}} onClick={() => setFriendsDialog(true)}>View All</ActionButton>
            <FriendsDialog userId={props.userId} open={friendsDialog} onClose={setFriendsDialog}/>
        </div>
    )
}

function FriendLine({friend}) {

    return (
        <div className={'friend-line'}>
            <a href={`/user/${friend.id}`}>{friend.name}</a>
        </div>
    )
}
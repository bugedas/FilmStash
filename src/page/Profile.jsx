import React, {useContext, useEffect, useState} from 'react';
import './Profile.scss';
import {getRequest, putRequest} from "../axios-wrapper";
import PostsByIds from "../common/PostsByIds";
import FriendsSidebar from "../common/FriendsSidebar";
import FilmList from "../common/FilmList";
import defaultUser from "../image/default-user.png";
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import Fab from '@mui/material/Fab';
import {Switch, TextField} from "@mui/material";
import ClickAwayListener from '@mui/material/ClickAwayListener';
import {ChangeImageDialog, ChangePassDialog} from "../common/Dialogs";
import {UserContext} from "../contexts/UserContext";
import UserStatistics from "../common/UserStatistics";

export default function Profile() {
    const {user: currentUser, setUser: setCurrentUser} = useContext(UserContext);
    const [userEditing, setUserEditing] = useState(false);
    const [changedName, setChangedName] = useState('');
    const [showChangePass, setShowChangePass] = useState(false);
    const [showChangeImage, setShowChangeImage] = useState(false);
    const [userImg, setUserImg] = useState('');
    const [userMetrics, setUserMetrics] = useState(null);

    useEffect(async () => {
        if (currentUser) {
            const userMetricsData = await getRequest(`/api/user/metrics/${currentUser?.id}`);
            setUserMetrics(userMetricsData.data);
        }
    }, [currentUser]);


    const userEdit = async () => {
        if (userEditing && changedName.length >= 5) {
            const data = {...currentUser, name: changedName}
            const editedUser = await putRequest('api/user', data);
            setCurrentUser(editedUser.data);
        }
        setUserEditing(!userEditing);
    }

    const changeImg = async (value, imageLink) => {
        if (value) {
            const data = {...currentUser, imageUrl: imageLink}
            const editedUser = await putRequest('api/user', data);
            setCurrentUser(editedUser.data);
        }
        setUserImg('');
        setShowChangeImage(false);
    }

    const changePrivacy = async (value) => {
        const data = {...currentUser, userPrivate: value.target.checked}
        await putRequest('api/user', data);
    }

    if (currentUser === null) {
        return null;
    }

    return (
        <div className={'profile-wrapper'}>
            <div className="profile-container">
                <ChangeImageDialog open={showChangeImage} onClose={changeImg}/>
                <div className="profile-info">
                    <div className="profile-avatar">
                        <img style={{cursor: 'pointer'}} onClick={() => setShowChangeImage(true)}
                             src={userImg || currentUser?.imageUrl || defaultUser}
                             onError={() => setUserImg(defaultUser)}
                             alt={currentUser.name}/>
                    </div>
                    <div className="profile-name">
                        <h2>
                            {userEditing ? <ClickAwayListener onClickAway={() => setUserEditing(false)}>
                                <TextField
                                    hiddenLabel
                                    defaultValue={currentUser?.name}
                                    variant="filled"
                                    sx={{bgcolor: 'white'}}
                                    size="small"
                                    onChange={e => setChangedName(e.target.value)}
                                />
                            </ClickAwayListener> : currentUser?.name}
                            <Fab sx={{marginLeft: '10px'}} onClick={userEdit}
                                 size="small">{userEditing ?
                                <DoneIcon/> :
                                <EditIcon/>}
                            </Fab>
                        </h2>
                        <p className="profile-email">{currentUser.email}</p>
                        <div><Switch defaultChecked={currentUser.userPrivate} onChange={changePrivacy}/>Private profile
                        </div>
                        {currentUser.provider === 'local' &&
                        <p><span className="profile-change-password" onClick={() => setShowChangePass(true)}>Change password?</span>
                        </p>}
                    </div>
                </div>
                <div className={'profile-posts-section'}>
                    <UserStatistics userMetrics={userMetrics}/>
                    <PostsByIds userIds={[currentUser.id]}/>
                </div>
            </div>
            <div className={'profile-sidebar-section'}>
                <FriendsSidebar userId={currentUser.id}/>
                <FilmList userId={currentUser.id}/>
            </div>
            <ChangePassDialog open={showChangePass} onClose={setShowChangePass}/>
        </div>
    );
}
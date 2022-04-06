import React, {useContext, useState} from 'react';
import './Profile.scss';
import {putRequest} from "../axios-wrapper";
import PostsByIds from "../common/PostsByIds";
import FriendsSidebar from "../common/FriendsSidebar";
import FilmList from "../common/FilmList";
import defaultUser from "../image/default-user.png";
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import Fab from '@mui/material/Fab';
import {TextField} from "@mui/material";
import ClickAwayListener from '@mui/material/ClickAwayListener';
import {ChangePassDialog} from "../common/Dialogs";
import {UserContext} from "../contexts/UserContext";

export default function Profile() {
    const {user: currentUser, setUser: setCurrentUser} = useContext(UserContext);
    const [userEditing, setUserEditing] = useState(false);
    const [changedName, setChangedName] = useState('');
    const [showChangePass, setShowChangePass] = useState(false);

    const userEdit = async () => {
        if (userEditing && changedName.length >= 5) {
            const data = {...currentUser, name: changedName}
            const editedUser = await putRequest('api/user', data);
            setCurrentUser(editedUser.data);
        }
        setUserEditing(!userEditing);
    }

    if (currentUser === null) {
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
                        {currentUser.provider === 'local' &&
                        <p><span className="profile-change-password" onClick={() => setShowChangePass(true)}>Change password?</span>
                        </p>}
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
            <ChangePassDialog open={showChangePass} onClose={setShowChangePass}/>
        </div>
    );
}
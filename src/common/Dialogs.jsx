import React, {useEffect, useState} from 'react';
import './Dialogs.scss';
import {Dialog, DialogContent, DialogTitle, IconButton, TextField, Tooltip} from "@mui/material";
import {deleteRequest, getRequest, postRequest, putRequest, tmdbGetRequest} from "../axios-wrapper";
import {SearchResult, UserResult} from "./AppHeaderNew";
import ClearIcon from "@mui/icons-material/Clear";
import ActionButton from "./buttons/ActionButton";
import {LIST_TYPES} from "../constant/constants";
import {selectStylesOnWhite} from "../util/BaseUtils";
import Select from "react-select";
import Fab from "@mui/material/Fab";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import DeleteIcon from "@mui/icons-material/Delete";

export function DeleteDialog(props) {
    const {onClose, open} = props;

    const handleClose = (value) => {
        onClose(value);
    };

    return (
        <Dialog onClose={() => handleClose(false)} open={open}>
            <DialogTitle>Are you sure you want to delete this post?
                <IconButton sx={{float: 'right'}}>
                    <ClearIcon onClick={() => handleClose(false)}/>
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <div className={'dialog-content'}>
                    <ActionButton onWhite onClick={() => handleClose(true)}>YES</ActionButton>
                    <ActionButton onWhite onClick={() => handleClose(false)}>NO</ActionButton>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export function ChangePassDialog(props) {
    const {onClose, open} = props;
    const [oldPass, setOldPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [newPassRepeat, setNewPassRepeat] = useState('');
    const [error, setError] = useState('');

    const getError = () => {
        if (newPass !== newPassRepeat) {
            return 'Passwords do not match!'
        }
        if (newPass < 7) {
            return 'Password is too short!'
        }
        return '';
    }

    const handleClose = async (value) => {
        if (value) {
            setError(getError());
            const {data: isOldPassCorrect} = await postRequest('auth/user/checkpass', oldPass);
            console.log(isOldPassCorrect);
            if (isOldPassCorrect && newPass === newPassRepeat) {
                const data = {password: newPass}
                await putRequest('api/user', data);
            }
        }
        onClose(value);
    };

    return (
        <Dialog onClose={() => handleClose(false)} open={open}>
            <DialogTitle>
                Want to change your password?
            </DialogTitle>
            <DialogContent>
                <div>
                    <TextField
                        variant="filled"
                        sx={{bgcolor: 'white', display: 'block', margin: 3}}
                        size="small"
                        onChange={e => setOldPass(e.target.value)}
                        type="password"
                        label="Current password"
                        required
                    />
                    <TextField
                        variant="filled"
                        sx={{bgcolor: 'white', display: 'block', margin: 3}}
                        size="small"
                        onChange={e => setNewPass(e.target.value)}
                        type="password"
                        label="New password"
                        required
                    />
                    <TextField
                        variant="filled"
                        sx={{bgcolor: 'white', display: 'block', margin: 3}}
                        size="small"
                        onChange={e => setNewPassRepeat(e.target.value)}
                        type="password"
                        label="Repeat new password"
                        required
                    />
                </div>
                <div className={'dialog-content'}>
                    <ActionButton onWhite onClick={() => handleClose(true)}>Change</ActionButton>
                </div>
                <div className={'password-dialog-error'}>{error}</div>
            </DialogContent>
        </Dialog>
    );
}

export function FriendsDialog(props) {
    const {onClose, open, userId} = props;
    const [friends, setFriends] = useState(null);

    const handleClose = (value) => {
        onClose(value);
    };

    useEffect(async () => {
        const friendsData = await getRequest(`/api/friends/user/full/${userId}`);
        setFriends(friendsData.data);
    }, []);

    return (
        <Dialog onClose={() => handleClose(false)} open={open}>
            <DialogTitle>
                Following:
                <IconButton sx={{float: 'right'}}>
                    <ClearIcon onClick={() => handleClose(false)}/>
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <div className={'dialog-repeating-content'}>{friends?.map(friend =>
                    <UserResult userId={friend.id} result={friend}/>)}
                </div>
            </DialogContent>
        </Dialog>
    );
}

export function FilmListDialog(props) {
    const {onClose, open, allFilms, userId, deleteFilm, moveFilm} = props;
    const [films, setFilms] = useState(null);
    const [listType, setListType] = useState(LIST_TYPES[0].value);

    const handleClose = (value) => {
        onClose(value);
    };

    useEffect(async () => {
        if (!allFilms) {
            const friendsData = await getRequest(`/api/films/film/${userId}`);
            setFilms(friendsData.data.reverse());
        } else {
            setFilms(allFilms);
        }

    }, []);

    useEffect(() => {
        setFilms(allFilms);
    }, [allFilms]);

    const removeFilmFromList = async (fId) => {
        await deleteRequest(`/api/films/film/${fId}`);
        const deletedList = films.filter(f => {
            return f.id !== fId;
        })
        setFilms(deletedList);
    }

    const moveToAnotherList = async (film) => {
        const data = {
            ...film,
            listType: film.listType === 'watched' ? 'watch_later' : 'watched',
        }
        await putRequest(`/api/films/film/${film.id}`, data);
        const deletedList = films.filter(f => {
            return f.id !== film.id;
        })
        setFilms([...deletedList, data]);
    }

    return (
        <Dialog onClose={() => handleClose(false)} open={open}>
            <DialogTitle>
                My Films List:
                <IconButton sx={{float: 'right'}}>
                    <ClearIcon onClick={() => handleClose(false)}/>
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{minHeight: '150px', minWidth: '250px'}}>
                <div className={'dialog-select-wrapper'}>
                    <Select styles={selectStylesOnWhite}
                            options={LIST_TYPES}
                            defaultValue={LIST_TYPES[0]}
                            onChange={e => setListType(e.value)}/>
                </div>
                <div className={'dialog-repeating-content'}>{films?.filter(f => f.listType === listType)?.map(film =>
                    <ListFilmResult result={film} deleteFilm={deleteFilm ? deleteFilm : removeFilmFromList}
                                    moveFilm={moveFilm ? moveFilm : moveToAnotherList}/>)}</div>
            </DialogContent>
        </Dialog>
    );

    function ListFilmResult({result, deleteFilm, moveFilm}) {
        const [film, setFilm] = useState(null);
        useEffect(async () => {
            const filmData = await tmdbGetRequest(`${result.type}/${result.filmId}?`);
            setFilm({...filmData.data, media_type: result.type});
        }, []);

        if (!film) {
            return null;
        }

        return (
            <div className={'film-in-a-list-dialog-wrapper'}>
                <div className={'film-in-a-list-film'}>
                    <SearchResult result={film}/>
                </div>
                <div className={'film-in-a-list-actions'}>
                    <div className={'film-in-a-list-move'}>
                        <Tooltip title={result.listType === 'watched' ? 'Move back to WATCH LATER' : 'Move to WATCHED'}>
                            <Fab sx={{marginLeft: '10px', transform: result.listType === 'watched' && 'rotate(180deg)'}}
                                 onClick={() => moveFilm(result)} size="small"><DoubleArrowIcon/></Fab>
                        </Tooltip>
                    </div>
                    <div className={'film-in-a-list-delete'}>
                        <Tooltip title="Delete">
                            <Fab sx={{marginLeft: '10px'}}
                                 size="small"
                                 onClick={() => deleteFilm(result.id)}><DeleteIcon/>
                            </Fab>
                        </Tooltip>
                    </div>
                </div>
            </div>
        )
    }
}
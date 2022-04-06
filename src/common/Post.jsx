import React, {useContext, useEffect, useState} from 'react';
import filmPlaceholder from "../image/film-placeholder.png";
import './Post.scss';
import * as moment from 'moment'
import {deleteRequest, getRequest, postRequest, putRequest, tmdbGetRequest} from "../axios-wrapper";
import {useNavigate} from "react-router-dom";
import {DeleteDialog} from "./Dialogs";
import {admins} from "../constant/admins";
import {hasPermissions} from "../util/axiosUtils";
import {tmdbImageLink} from "../constant/constants";
import {filmTvLink, parseTime} from "../util/BaseUtils";
import {UserContext} from "../contexts/UserContext";
import {Tooltip} from "@mui/material";
import Fab from "@mui/material/Fab";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Post(props) {
    const [film, setFilm] = useState(null);
    const [user, setUser] = useState(null);
    const {user: currUser} = useContext(UserContext);
    const [showWriteComment, setShowWriteComment] = useState(false);
    const [likeCount, setLikeCount] = useState(props.likes);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [userLiked, setUserLiked] = useState(false);
    const [expandMessage, setExpandMessage] = useState(false);

    const navigate = useNavigate();

    const likeAmountChange = async (amount) => {
        const data = {
            filmId: props.filmId,
            userId: props.userId,
            message: props.message,
            likes: props.likes + amount,
            date: props.date,
            type: props.type
        }

        await putRequest(`/api/posts/${props.id}`, data)
        setLikeCount(likeCount + amount);
    }

    const addLike = async () => {
        if (!userLiked) {
            const likeData = {
                id: `${props.type}${props.filmId}U${props.userId}`,
                filmId: props.filmId,
                userId: props.userId,
            }
            await postRequest('/api/likes/add', likeData);
            await likeAmountChange(1);
        } else {
            await deleteRequest(`/api/likes/${props.type}${props.filmId}U${props.userId}`);
            await likeAmountChange(-1);
        }
        setUserLiked(!userLiked);
    }

    const handleDeleteDialogClose = (value) => {
        setDeleteDialog(false);
        if (value) {
            deleteRequest(`/api/posts/${props.id}`);
            setFilm(null);
        }
    }

    useEffect(() => {
        const getData = async () => {
            const tmdbData = await tmdbGetRequest(`${props.type}/${props.filmId}?`);
            setFilm(tmdbData.data);
            const userData = await getRequest(`/api/user/id/${props.userId}`);
            setUser(userData.data);
            const userLikedData = await getRequest(`/api/likes/${props.type}${props.filmId}U${props.userId}`);
            setUserLiked(userLikedData?.data);
        }

        getData();
    }, []);

    if (film === null || user === null || currUser === null) {
        return null;
    }

    return (
        <div className={'post-card'}>
            <div className={'post-card-header'}>
                <a href={`/user/${user.id}`} className={'post-card-name'}>{user.name}</a>
                <div className={'post-card-date'}>{parseTime(props.date)}
                    {(user.id === currUser.id || admins.includes(currUser.email)) &&
                    <>
                        <div className={'post-card-delete-button'}>
                            <Tooltip title="Delete">
                                <Fab sx={{marginLeft: '10px'}}
                                     size="small"
                                     onClick={() => setDeleteDialog(true)}><DeleteIcon/>
                                </Fab>
                            </Tooltip></div>
                        <DeleteDialog
                            open={deleteDialog}
                            onClose={handleDeleteDialogClose}
                        />
                    </>}
                </div>
            </div>
            <div className={'post-card-film-section'}
                 onClick={(e) => navigate(`/${filmTvLink(props.type)}/${props.filmId}`)}>
                <img src={tmdbImageLink(film?.poster_path) || filmPlaceholder} alt={film?.title}
                     className={'post-card-image'}/>
                <div className={'post-card-film-name'}>{film?.title}</div>
            </div>
            <div
                className={'post-card-message'}>{expandMessage ? props.message : props.message.slice(0, 300)}{!expandMessage && props.message.length > 300 &&
            <>...<span className={'post-card-message-more'} onClick={() => setExpandMessage(true)}>Read more</span></>}
            </div>
            <div className={'post-card-statistics-section'}>
                <div className={'post-card-likes'}>{likeCount} Likes</div>
            </div>
            <div className={'post-card-buttons-section'}>
                <button className={`post-card-button ${userLiked && 'pressed'}`} onClick={addLike}>Like</button>
                <button className={'post-card-button'} onClick={() => setShowWriteComment(!showWriteComment)}>Comment
                </button>
                <button className={'post-card-button'}>Share</button>
            </div>
            <PostCommentSection currentUserId={currUser.id} thisUserId={props.userId}
                                showWriteComment={showWriteComment} postId={props.id}/>
        </div>
    )
}

function PostCommentSection(props) {
    const [comments, setComments] = useState(null);
    const [writtenComment, setWrittenComment] = useState('');
    const [showCommentsAmount, setShowCommentsAmount] = useState(1);

    const moreComments = () => {
        setShowCommentsAmount(showCommentsAmount + 5);
    }

    const handleDeleteComment = (id) => {
        deleteRequest(`/api/comments/${id}`);
        setComments(comments.filter(c => {
            return c.id !== id
        }));
    }

    useEffect(() => {
        getRequest(`/api/comments/post/${props.postId}`).then(res => setComments(res.data))
    }, []);

    const addComment = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            if (writtenComment.length > 0) {
                const yourDate = new Date()
                const NewDate = moment(yourDate, 'YYYY-MM-DD')
                const data = {
                    postId: props.postId,
                    userId: props.currentUserId,
                    message: writtenComment,
                    likes: 0,
                    date: NewDate,
                }

                postRequest('/api/comments/add', data)
                    .then(response => {
                        setComments(comments => [...comments, response.data]);
                        setWrittenComment('');
                    })
            }
        }
    }

    return (
        <div className={'post-comment-section'}>
            <div className={props.showWriteComment ? 'comment' : 'no-display'}>
                <textarea className={'comment-input'} rows={5} value={writtenComment}
                          onChange={(e) => setWrittenComment(e.target.value)}
                          placeholder={'Write a comment...'}
                          onKeyDown={addComment}
                />
            </div>
            {comments && showCommentsAmount > 1 &&
            <div className={'collapse-comments'} onClick={() => setShowCommentsAmount(1)}>Hide comments...</div>
            }
            {comments && comments.slice(0, showCommentsAmount).map(comment => {
                return (<Comment handleDeleteComment={handleDeleteComment} key={comment.id} {...comment}/>);
            })}
            {comments && comments.length > showCommentsAmount &&
            <div className={'show-more-comments'} onClick={moreComments}>Show more comments...</div>
            }
        </div>
    )
}

function Comment(props) {
    const [user, setUser] = useState(null);
    const [hasPerm, setHasPerm] = useState(false);
    const [editComment, setEditComment] = useState(false);
    const [writtenComment, setWrittenComment] = useState(props.message);
    const [currComment, setCurrComment] = useState(props.message);

    const editCommentHandler = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
            if (writtenComment.length > 0) {
                const yourDate = new Date()
                const NewDate = moment(yourDate, 'YYYY-MM-DD')
                const data = {
                    postId: props.postId,
                    userId: props.currentUserId,
                    message: writtenComment,
                    likes: 0,
                    date: NewDate,
                }

                putRequest(`/api/comments/${props.id}`, data)
                    .then(response => {
                        setCurrComment(data.message);
                        setEditComment(false);
                    });
            }
        }
    }

    useEffect(() => {
        const getData = async () => {
            const userData = await getRequest(`/api/user/id/${props.userId}`);
            setUser(userData.data);
            const perm = await hasPermissions(props.userId);
            setHasPerm(perm);
        }

        getData();
    }, []);

    if (user === null) {
        return null;
    }

    return (
        <div className={'comment'}>
            <div className={'comment-header'}>
                <div className={'comment-name'}>{user.name}</div>
                {hasPerm &&
                <>
                    <div className={'comment-delete'} onClick={() => props.handleDeleteComment(props.id)}>DELETE</div>
                    <div className={'comment-delete'}
                         onClick={() => setEditComment(!editComment)}>{editComment ? 'CLOSE EDIT' : 'EDIT'}</div>
                </>
                }
                <div className={'comment-date'}>{parseTime(props.date)}</div>
            </div>
            <div className={'comment-message'}>
                {editComment ?
                    <textarea className={'comment-input'} rows={5} value={writtenComment}
                              onChange={(e) => setWrittenComment(e.target.value)}
                              placeholder={'Write a comment...'}
                              onKeyDown={editCommentHandler}
                    />
                    :
                    currComment
                }
            </div>
        </div>
    )
}
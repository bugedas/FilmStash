import React, {useEffect, useState} from 'react';
import {editPost, getCommentsByPostId, getUserById, postComment} from "../util/APIUtils";
import filmPlaceholder from "../image/film-placeholder.png";
import './Post.css';
import Alert from "react-s-alert";
import * as moment from 'moment'
import {getRequest, deleteRequest, putRequest} from "../axios-wrapper";
import {useNavigate} from "react-router-dom";
import {top250} from "../imdb/top250";
import DeleteDialog from "./DeleteDialog";
import {admins} from "../constant/admins";
import {hasPermissions} from "../util/axiosUtils";

export default function Post(props){
    const [film, setFilm] = useState(null);
    const [user, setUser] = useState(null);
    const [currUser, setCurrUser] = useState(null);
    const [showWriteComment, setShowWriteComment] = useState(false);
    const [likeCount, setLikeCount] = useState(props.likes);
    const [deleteDialog, setDeleteDialog] = useState(false);

    const navigate = useNavigate();

    const addLike = () => {
        const data = {
            filmId: props.filmId,
            userId: props.userId,
            message: props.message,
            likes: props.likes + 1,
            date: props.date
        }

        editPost(props.id, data)
            .then(response => {
                setLikeCount(likeCount + 1);
            }).catch(error => {
            Alert.error((error && error.message) || 'Oops! Something went wrong. Please try again!');
        });
    }

    const handleDeleteDialogClose = (value) => {
        setDeleteDialog(false);

        if(value){
            deleteRequest(`/api/posts/${props.id}`);
            setFilm(null);
        }
    }

    useEffect(() => {
        const getData = async () => {
            const filmsData = top250.items;
            const thisFilm = filmsData.filter(f => {
                return f.id === props.filmId;
            })
            setFilm(thisFilm[0]);
            const userData = await getRequest(`/api/user/id/${props.userId}`);
            setUser(userData.data);
            const currUserData = await getRequest(`/api/user/me`);
            setCurrUser(currUserData.data);
        }

        getData();
    }, []);

    if(film === null || user === null || currUser ===null){
        return null;
    }

    return (
        <div className={'post-card'}>
            {(user.id === currUser.id || admins.includes(currUser.email)) &&
                <>
                    <div className={'post-card-delete-button'} onClick={() => setDeleteDialog(true)}>DELETE</div>
                    <DeleteDialog
                    open={deleteDialog}
                    onClose={handleDeleteDialogClose}
                    />
                </>
            }
            <div className={'post-card-header'}>
                <div className={'post-card-name'}>{user.name}</div>
                <div className={'post-card-date'}>{props.date}</div>
            </div>
            <div className={'post-card-film-section'} onClick={(e) => navigate(`/film/${props.filmId}`)}>
                <img src={film.image ? film.image : filmPlaceholder} alt={film.fullTitle} className={'post-card-image'}/>
                <div className={'post-card-film-name'}>{film.fullTitle}</div>
            </div>
            <div className={'post-card-message'}>{props.message}</div>
            <div className={'post-card-statistics-section'}>
                <div className={'post-card-likes'}>{likeCount} Likes</div>
            </div>
            <div className={'post-card-buttons-section'}>
                <button className={'post-card-button'} onClick={addLike}>Like</button>
                <button className={'post-card-button'} onClick={() => setShowWriteComment(!showWriteComment)}>Comment</button>
                <button className={'post-card-button'}>Share</button>
            </div>
            <PostCommentSection currentUserId={currUser.id} thisUserId={props.userId} showWriteComment={showWriteComment} postId={props.id}/>
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
        setComments(comments.filter(c => {return c.id !== id}));
    }

    useEffect(() => {
        getCommentsByPostId(props.postId)
            .then(response => {
                setComments(response);
            }).catch(error => {
            setComments(null);
        });
    }, []);

    const addComment = (e) => {
        if(e.keyCode === 13){
            e.preventDefault();
            if(writtenComment.length > 0){
                const yourDate = new Date()
                const NewDate = moment(yourDate, 'YYYY-MM-DD')
                const data = {
                    postId: props.postId,
                    userId: props.currentUserId,
                    message: writtenComment,
                    likes: 0,
                    date: NewDate,
                }

                postComment(data)
                    .then(response => {
                        setComments(comments => [...comments, response]);
                        setWrittenComment('');
                    }).catch(error => {
                    Alert.error((error && error.message) || 'Oops! Something went wrong. Please try again!');
                });
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
            console.log(props.userId);
            const userData = await getRequest(`/api/user/id/${props.userId}`);
            setUser(userData.data);
            const perm = await hasPermissions(props.userId);
            setHasPerm(perm);
        }

        getData();
    }, []);

    if(user === null) {
        return null;
    }

    return (
        <div className={'comment'}>
            <div className={'comment-header'}>
                <div className={'comment-name'}>{user.name}</div>
                {hasPerm &&
                    <>
                        <div className={'comment-delete'} onClick={() => props.handleDeleteComment(props.id)}>DELETE</div>
                        <div className={'comment-delete'} onClick={() => setEditComment(!editComment)}>{editComment ? 'CLOSE EDIT' : 'EDIT'}</div>
                    </>
                }
                <div className={'comment-date'}>{props.date}</div>
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
import React, {useEffect, useState} from 'react';
import Post from "./Post";
import {getRequest} from "../axios-wrapper";
import './PostsByIds.scss';

export default function PostsByIds(props) {

    const [posts, setPosts] = useState(null);
    const [amountViewing, setAmountViewing] = useState(5);

    useEffect(() => {
        const getPostOfUser = async (thisId) => {
            const {data} = await getRequest(`/api/posts/user/${thisId}`);
            return data;
        }

        const getAllPostsOfIds = async () => {
            return await props.userIds?.map(getPostOfUser);
        }

        const getAll = async () => {
            const x = await getAllPostsOfIds();
            Promise.all(x).then((data) => {
                setPosts(data.flat().sort(function compare(a, b) {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    return dateB - dateA;
                }));
            });
        }

        getAll();

    }, []);

    if (posts === null) {
        return null;
    }

    return (

        <>
            {posts?.slice(0, amountViewing).map(post => {
                return (
                    <Post key={post.id} {...post}/>
                )
            })}
            {posts.length > amountViewing &&
            <div className={'posts-by-ids-more-button'} onClick={() => setAmountViewing(amountViewing + 5)}>
                Load more posts...
            </div>}
        </>
    )
}
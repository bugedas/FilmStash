import React, {useEffect, useState} from 'react';
import Post from "./Post";
import {getRequest} from "../axios-wrapper";

export default function PostsByIds(props) {

    const [posts, setPosts] = useState(null);

    useEffect(() => {

        const getPostOfUser = async (thisId) => {
            const {data} = await getRequest(`/api/posts/user/${thisId}`);
            return data;
        }

        const getAllPostsOfIds = async () => {
            return await props.userIds.map(getPostOfUser);
        }

        const getAll = async () => {
            const x = await getAllPostsOfIds();
            Promise.all(x).then((data) => {
                setPosts(data.flat().sort(function compare(a, b) {
                    const dateA = new Date(a.date);
                    const dateB = new Date(b.date);
                    return dateA - dateB;
                }));
            });
        }

        getAll();

    }, []);

    if(posts === null){
        return null;
    }

    return (
        <>
            {posts.map(post => {
                return (
                    <Post key={post.id} {...post}/>
                )
            })}
        </>
    )
}
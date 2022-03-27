import {deleteRequest, getRequest, postRequest} from "../axios-wrapper";
import {admins} from '../constant/admins';
import {ACCESS_TOKEN} from "../constant/constants";

export const isUserFriend = async (id) => {
    const meData = await getRequest(`/api/user/me`);
    const friendsData = await getRequest(`/api/friends/user/${meData?.data?.id}`);
    const friends = friendsData.data;
    const filteredFriends = friends.filter((f) => {
        return f.followedId === id;
    })

    if(filteredFriends.length > 0){
        return {id: filteredFriends[0].id, followingId: filteredFriends[0].followingId, followedId: filteredFriends[0].followedId, isFriend: true}
    }

    return {id: null, followingId: meData.data.id, followedId: id, isFriend: false}
}

export const addFriendForUser = async (id) => {
    const meData = await getRequest(`/api/user/me`);
    const o = {
        followingId: meData.data.id,
        followedId: id
    }
    const friend = await postRequest(`/api/friends/add`, o);
    return {...friend, isFriend: true}
}

export const hasPermissions = async (id) => {
    const meData = await getRequest(`/api/user/me`);
    return (meData.data.id === id || admins.includes(meData.data.email));
}

export const isAdmin = async () => {
    const meData = await getRequest(`/api/user/me`);
    return admins.includes(meData.data.email);
}

export const removeUser = async (id) => {
    const posts = await getRequest(`/api/posts/user/${id}`);
    posts.data.map(p => {
        deleteRequest(`/api/posts/${p.id}`);
    })
    const friends = await getRequest(`/api/friends/user/${id}`);
    friends.data.map(f => {
        deleteRequest(`/api/friends/${f.id}`);
    })
    const films = await getRequest(`/api/films/film/${id}`)
    films.data.map(fi => {
        deleteRequest(`/api/films/film/${fi.id}`);
    })
    await deleteRequest(`/api/user/${id}`);
}

export function isLoggedIn() {
    return !!localStorage.getItem(ACCESS_TOKEN);
}
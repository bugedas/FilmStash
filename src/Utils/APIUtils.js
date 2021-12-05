import {ACCESS_TOKEN, API_BASE_URL} from "../Constants/constants";

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
    })

    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN))
    }

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
        .then(response =>
            response.json().then(json => {
                if(!response.ok) {
                    return Promise.reject(json);
                }
                return json;
            })
        );
};


export function getCurrentUser() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/api/user/me",
        method: 'GET'
    });
}

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/login",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function isLoggedIn(){
    if(localStorage.getItem(ACCESS_TOKEN)) {
        return true;
    }
    return false;
}

export function getAllFilms() {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/api/films",
        method: 'GET'
    });
}

export function getFilmById(id) {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/api/films/id/" + id,
        method: 'GET'
    });
}

export function getAllPostsByUserId(id) {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/api/posts/user/" + id,
        method: 'GET'
    });
}

export function getUserById(id) {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/api/user/id/" + id,
        method: 'GET'
    });
}

export function getCommentsByPostId(id) {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/api/comments/post/" + id,
        method: 'GET'
    });
}

export function postComment(commentRequest) {
    return request({
        url: API_BASE_URL + "/api/comments/add",
        method: 'POST',
        body: JSON.stringify(commentRequest)
    });
}

export function editPost(postId, postRequest) {
    return request({
        url: API_BASE_URL + "/api/posts/" + postId,
        method: 'PUT',
        body: JSON.stringify(postRequest)
    });
}

export function getFriendsByUserId(id) {
    if(!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/api/friends/user/" + id,
        method: 'GET'
    });
}

export function getApiResult(fn) {
    return fn.then(response => {
        return response;
    }).catch(error => {
        return null;
    })
}
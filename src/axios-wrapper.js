import axios from 'axios';
import {ACCESS_TOKEN, API_BASE_URL} from "./constant/constants";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 1000,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
    }
})

const axiosPublicInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 1000,
    headers: {
        'Content-Type': 'application/json',
    }
})

const axiosImdbInstance = axios.create({
    baseURL: './',
    timeout: 1000,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
    }
})

axiosInstance.interceptors.request.use((config) => {
    if(localStorage.getItem(ACCESS_TOKEN)) {
        return config;
    }
    return Promise.reject("No Access Token Set");
}, (error) => {
    return Promise.reject(error);
});

axiosImdbInstance.interceptors.request.use((config) => {
    if(localStorage.getItem(ACCESS_TOKEN)) {
        return config;
    }
    return Promise.reject("No Access Token Set");
}, (error) => {
    return Promise.reject(error);
});

const axiosRequest = (config) => {
    return axiosInstance.request(config).then(data=>{
        return Promise.resolve({data: data.data, error: null})
    }).catch(error=>{
        return Promise.resolve({error, data:null})
    })
}

const axiosPublicRequest = (config) => {
    return axiosPublicInstance.request(config).then(data=>{
        return Promise.resolve({data: data.data, error: null})
    }).catch(error=>{
        return Promise.resolve({error, data:null})
    })
}

const axiosImdbRequest = (config) => {
    return axiosImdbInstance.request(config).then(data=>{
        return Promise.resolve({data: data.data, error: null})
    }).catch(error=>{
        return Promise.resolve({error, data:null})
    })
}

const postPublicRequest = async (url, data) => {
    return await axiosPublicInstance.post(url, data);
}

const getPublicRequest = async (url, getConfig) => {
    return await axiosPublicRequest(makeRequestConfig(url, "GET", getConfig));
}

const getRequest = async (url, getConfig) => {
    return await axiosRequest(makeRequestConfig(url, "GET", getConfig));
}

const postRequest = async (url, data) => {
    return await axiosInstance.post(url, data);
}

const deleteRequest = async (url, getConfig) =>
    await axiosRequest(makeRequestConfig(url, "DELETE", getConfig));

const putRequest = async (url, data) =>
    await axiosInstance.put(url, data);

const getImdbRequest = async (url, getConfig) =>
    await axiosImdbRequest(makeRequestConfig(url, "GET", getConfig));

const makeRequestConfig = (url, method, config) => ({
    url,
    method,
    ...config
})

const imdbSearchSuggestions = async (searchInput) => {
    const firstLetter = searchInput[0];
    return axios.get(`https://v2.sg.media-imdb.com/suggestion/${firstLetter}/${searchInput}.json`);
}

const omdbGetRequest = async (url) => {
    return axios.get(`http://www.omdbapi.com/${url}&apikey=a0342762`);
}

const tmdbGetRequest = async (url) => {
    return axios.get(`https://api.themoviedb.org/3/${url}&api_key=fbb58cde5d772916b6746d31fb3b3844`);
}

export {
    getRequest,
    postRequest,
    getImdbRequest,
    deleteRequest,
    putRequest,
    postPublicRequest,
    imdbSearchSuggestions,
    omdbGetRequest,
    tmdbGetRequest
}
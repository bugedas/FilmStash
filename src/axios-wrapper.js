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
        console.log('config', config);
        console.log('error', error);
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

const getRequest = async (url, getConfig) =>
    await axiosRequest(makeRequestConfig(url, "GET", getConfig));

const postRequest = async (url, data) =>
    await axiosInstance.post(url, data);

const deleteRequest = async (url, getConfig) =>
    await axiosRequest(makeRequestConfig(url, "DELETE", getConfig));

const getImdbRequest = async (url, getConfig) =>
    await axiosImdbRequest(makeRequestConfig(url, "GET", getConfig));

const makeRequestConfig = (url, method, config) => ({
    url,
    method,
    ...config
})

export {
    getRequest,
    postRequest,
    getImdbRequest,
    deleteRequest
}
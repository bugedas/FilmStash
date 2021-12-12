import React from 'react';
import {ACCESS_TOKEN} from "../constant/constants";
import {useLocation, useNavigate} from "react-router-dom";

export default function OAuth2RedirectHandler() {

    const location = useLocation();
    const navigate = useNavigate();

    const getUrlParameter = (name) => {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');

        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    const token = getUrlParameter('token');

    if(token) {
        localStorage.setItem(ACCESS_TOKEN, token);
        navigate('/profile');
        return null;
    } else {
        navigate('/login');
        return null;
    }
}
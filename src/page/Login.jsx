import React, {useState} from 'react';
import Alert from '@mui/material/Alert';
import {ACCESS_TOKEN, FACEBOOK_AUTH_URL, GOOGLE_AUTH_URL} from "../constant/constants";
import fbLogo from '../image/fb-logo.png';
import googleLogo from '../image/google-logo.png';
import {Navigate, useLocation} from "react-router-dom";
import './Login.scss';
import {postPublicRequest} from "../axios-wrapper";
import {isLoggedIn} from "../util/axiosUtils";

export default function Login() {

    const location = useLocation();

    const [alertErr, setAlertErr] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    if(isLoggedIn()) {
        return <Navigate
            to={{
                pathname: "/",
                state: { from: location }
            }}/>;
    }

    return (
        <div className="login-container">
            <Alert className={`login-alert ${!showAlert && 'hidden'}`} severity="error">{alertErr}</Alert>
            <h1 className="login-title">Login to FilmStash</h1>
            <SocialLogin />
            <div className="login-or-separator">
                <span className="login-or-text">OR</span>
            </div>
            <LoginForm setAlertErr={setAlertErr} setShowAlert={setShowAlert}/>
            <span>New user? <a href="/signup" className={'login-signup-link'}>Sign up!</a></span>
        </div>
    );
}

function SocialLogin() {
    return (
        <div className="login-social">
            <a className="login-button" href={GOOGLE_AUTH_URL}>
                <img src={googleLogo} alt="Google" /><span>Log in with Google</span></a>
            <a className="login-button" href={FACEBOOK_AUTH_URL}>
                <img src={fbLogo} alt="Facebook" /><span>Log in with Facebook</span></a>
        </div>
    );
}


function LoginForm(props) {

    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');

    const getError = (errMsg) => {
        if(email.length === 0 || pass.length === 0) {
            return "Please fill all fields!";
        }
        else if(!email.includes('@')) {
            return "Please enter a valid email address!"
        }
        else {
            return errMsg;
        }
    }

    const handleSubmit = () => {
        const loginRequest = {email: email, password: pass};

        if(getError('') === '') {
            postPublicRequest('/auth/login', loginRequest)
                .then(response => {
                    localStorage.setItem(ACCESS_TOKEN, response.data.accessToken);
                    window.location.reload(false);
                }).catch(error => {
                    props.setAlertErr(getError(error.response.data.message));
                    props.setShowAlert(true);
                    setTimeout(() => {
                        props.setShowAlert(false);
                    }, 3000);
            });
        } else {
            props.setAlertErr(getError('Ooops! Something is wrong!'));
            props.setShowAlert(true);
            setTimeout(() => {
                props.setShowAlert(false);
            }, 3000);
        }
    }

    return (
        <div className="login-form">
            <input type="email" name="email"
                   className="login-form-input" placeholder="Email"
                   value={email} onChange={(e) => setEmail(e.target.value)} required/>
            <input type="password" name="password"
                   className="login-form-input" placeholder="Password"
                   value={pass} onChange={(e) => setPass(e.target.value)} required/>
            <button onClick={handleSubmit} className="login-form-button">Login</button>
        </div>
    );
}
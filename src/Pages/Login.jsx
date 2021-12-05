import React, {useEffect, useState} from 'react';
import Alert from "react-s-alert";
import {ACCESS_TOKEN, FACEBOOK_AUTH_URL, GITHUB_AUTH_URL, GOOGLE_AUTH_URL} from "../Constants/constants";
import fbLogo from '../Images/fb-logo.png';
import googleLogo from '../Images/google-logo.png';
import githubLogo from '../Images/github-logo.png';
import {isLoggedIn, login} from "../Utils/APIUtils";
import {Navigate, useNavigate, useLocation} from "react-router-dom";
import './Login.css';

export default function Login() {

    const location = useLocation();
    const history = useNavigate();

    useEffect(() => {
        // If the OAuth2 login encounters an error, the user is redirected to the /login page with an error.
        // Here we display the error and then remove the error query parameter from the location.
        if(location.state && location.state.error) {
            setTimeout(() => {
                Alert.error(location.state.error, {
                    timeout: 5000
                });
                history.replace({
                    pathname: location.pathname,
                    state: {}
                });
            }, 100);
        }
    }, []);

    if(isLoggedIn()) {
        return <Navigate
            to={{
                pathname: "/",
                state: { from: location }
            }}/>;
    }

    return (
        <div className="login-container">
            <div className="login-content">
                <h1 className="login-title">Login to FilmStash</h1>
                <SocialLogin />
                <div className="or-separator">
                    <span className="or-text">OR</span>
                </div>
                <LoginForm/>
                <span className="signup-link">New user? <a href="/signup">Sign up!</a></span>
            </div>
        </div>
    );
}

function SocialLogin() {
    return (
        <div className="social-login">
            <a className="btn btn-block social-btn google" href={GOOGLE_AUTH_URL}>
                <img src={googleLogo} alt="Google" /> Log in with Google</a>
            <a className="btn btn-block social-btn facebook" href={FACEBOOK_AUTH_URL}>
                <img src={fbLogo} alt="Facebook" /> Log in with Facebook</a>
            <a className="btn btn-block social-btn github" href={GITHUB_AUTH_URL}>
                <img src={githubLogo} alt="Github" /> Log in with Github</a>
        </div>
    );
}


function LoginForm() {

    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');

    const handleSubmit = () => {
        const loginRequest = Object.assign({}, {email: email, password: pass});

        login(loginRequest)
            .then(response => {
                localStorage.setItem(ACCESS_TOKEN, response.accessToken);
                Alert.success("You're successfully logged in!");
                window.location.reload(false);
                // return <Navigate to={'/'} />
                // this.props.history.push("/");
            }).catch(error => {
            Alert.error((error && error.message) || 'Oops! Something went wrong. Please try again!');
        });
    }

    return (
        <div>
            <div className="form-item">
                <input type="email" name="email"
                       className="form-control" placeholder="Email"
                       value={email} onChange={(e) => setEmail(e.target.value)} required/>
            </div>
            <div className="form-item">
                <input type="password" name="password"
                       className="form-control" placeholder="Password"
                       value={pass} onChange={(e) => setPass(e.target.value)} required/>
            </div>
            <div className="form-item">
                <button onClick={handleSubmit} className="btn btn-block btn-primary">Login</button>
            </div>
        </div>
    );
}
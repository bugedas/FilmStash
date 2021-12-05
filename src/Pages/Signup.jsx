import React, {useState} from 'react';
import fbLogo from '../Images/fb-logo.png';
import googleLogo from '../Images/google-logo.png';
import githubLogo from '../Images/github-logo.png';
import {FACEBOOK_AUTH_URL, GITHUB_AUTH_URL, GOOGLE_AUTH_URL} from "../Constants/constants";
import {isLoggedIn, signup} from "../Utils/APIUtils";
import Alert from "react-s-alert";
import { Navigate } from 'react-router-dom';
import './Signup.css';

export default function Signup() {
    if(isLoggedIn()) {
        return <Navigate to={"/"}/>;
    }

    return (
        <div className="signup-container">
            <div className="signup-content">
                <h1 className="signup-title">Signup with FilmStash</h1>
                <SocialSignup />
                <div className="or-separator">
                    <span className="or-text">OR</span>
                </div>
                <SignupForm/>
                <span className="login-link">Already have an account? <a href="/login">Login!</a></span>
            </div>
        </div>
    );
}


function SocialSignup() {
    return (
        <div className="social-signup">
            <a className="btn btn-block social-btn google" href={GOOGLE_AUTH_URL}>
                <img src={googleLogo} alt="Google" /> Sign up with Google</a>
            <a className="btn btn-block social-btn facebook" href={FACEBOOK_AUTH_URL}>
                <img src={fbLogo} alt="Facebook" /> Sign up with Facebook</a>
            <a className="btn btn-block social-btn github" href={GITHUB_AUTH_URL}>
                <img src={githubLogo} alt="Github" /> Sign up with Github</a>
        </div>
    );
}

function SignupForm() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = () => {
        const signUpRequest = Object.assign({}, {name: name, email: email, password: password});

        signup(signUpRequest)
            .then(response => {
                Alert.success("You're successfully registered. Please login to continue!");
                return <Navigate to="/login" />
            }).catch(error => {
            Alert.error((error && error.message) || 'Oops! Something went wrong. Please try again!');
        });
    }

    return (
        <div>
            <div className="form-item">
                <input type="text" name="name"
                       className="form-control" placeholder="Name"
                       value={name} onChange={(e) => setName(e.target.value)} required/>
            </div>
            <div className="form-item">
                <input type="email" name="email"
                       className="form-control" placeholder="Email"
                       value={email} onChange={(e) => setEmail(e.target.value)} required/>
            </div>
            <div className="form-item">
                <input type="password" name="password"
                       className="form-control" placeholder="Password"
                       value={password} onChange={(e) => setPassword(e.target.value)} required/>
            </div>
            <div className="form-item">
                <button onClick={handleSubmit} className="btn btn-block btn-primary" >Sign Up</button>
            </div>
        </div>

    );
}
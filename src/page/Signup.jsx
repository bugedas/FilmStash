import React, {useState} from 'react';
import googleLogo from '../image/google-logo.png';
import {GOOGLE_AUTH_URL} from "../constant/constants";
import Alert from '@mui/material/Alert';
import {Navigate, useNavigate} from 'react-router-dom';
import './Signup.scss';
import {postPublicRequest} from "../axios-wrapper";
import {isLoggedIn} from "../util/axiosUtils";

export default function Signup() {

    const [alertErr, setAlertErr] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    if (isLoggedIn()) {
        return <Navigate to={"/"}/>;
    }

    return (
        <div className="signup-container">
            <Alert className={`signup-alert ${!showAlert && 'hidden'}`} severity="error">{alertErr}</Alert>
            <h1 className="signup-title">Signup with FilmStash</h1>
            <SocialSignup/>
            <div className="signup-or-separator">
                <span className="signup-or-text">OR</span>
            </div>
            <SignupForm setAlertErr={setAlertErr} setShowAlert={setShowAlert}/>
            <div>Already have an account? <a href="/login" className="signup-login-link">Login!</a></div>
        </div>
    );
}


function SocialSignup() {
    return (
        <div className="signup-social">
            <a className="signup-button" href={GOOGLE_AUTH_URL}>
                <img src={googleLogo} alt="Google"/><span>Sign up with Google</span></a>
        </div>
    );
}

function SignupForm(props) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const navigate = useNavigate();

    const getError = (errMsg) => {
        if (name.length === 0 || email.length === 0 || password.length === 0) {
            return "Please fill all fields!";
        } else if (!email.includes('@')) {
            return "Please enter a valid email address!"
        } else if (password.length < 6) {
            return "Please use a stronger password!"
        } else {
            return errMsg;
        }
    }

    const handleSubmit = () => {
        const signUpRequest = {name: name, email: email, password: password};
        if (getError('') === '') {
            postPublicRequest('/auth/signup', signUpRequest)
                .then(response => {
                    navigate("/login");
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
        <div className={'signup-form'}>
            <input type="text" name="name"
                   className="signup-form-input" placeholder="Name"
                   value={name} onChange={(e) => setName(e.target.value)} required/>
            <input type="email" name="email"
                   className="signup-form-input" placeholder="Email"
                   value={email} onChange={(e) => setEmail(e.target.value)} required/>
            <input type="password" name="password"
                   className="signup-form-input" placeholder="Password"
                   value={password} onChange={(e) => setPassword(e.target.value)} required/>
            <button onClick={handleSubmit} className="signup-form-button">Sign Up</button>
        </div>
    );
}
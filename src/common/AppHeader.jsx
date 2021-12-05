import React, {useEffect, useRef, useState} from 'react';
import {ACCESS_TOKEN} from "../constant/constants";
import Alert from "react-s-alert";
import logo from '../image/FilmstashLogo.png';
import './AppHeader.css';
import {isLoggedIn} from "../util/APIUtils";
import MenuIcon from '@mui/icons-material/Menu';

function useOutsideAlerter(ref, setShowMobileMenu) {
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                setShowMobileMenu(false);
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}

export default function AppHeader() {
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    return (
        <header className="app-header">
            <div className="container">
                <div className="app-branding">
                    <a href="/" className="app-title">
                        <img src={logo} alt="Logo" className={'logoNav'}/>
                    </a>

                </div>
                <div className={'hamburger'}>
                    <MenuIcon style={{fill: '#EE3232'}} onClick={() => setShowMobileMenu(!showMobileMenu)}/>
                </div>
                <MobileNav showMenu={showMobileMenu} setShowMobileMenu={setShowMobileMenu}/>
                <div className="app-options">
                    <nav className="app-nav">
                        <MenuList/>
                    </nav>
                </div>
            </div>
        </header>
    )
}

function MobileNav(props){
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, props.setShowMobileMenu);

    return (
        <div ref={wrapperRef} className={props.showMenu ? 'mobile-nav-show' : 'mobile-nav'}>
            <MenuList/>
        </div>
    )
}

function MenuList() {
    const handleLogout = () => {
        localStorage.removeItem(ACCESS_TOKEN);
        window.location.reload(false);
        Alert.success("You're safely logged out!");
    }

    return (
        <>
            { isLoggedIn() ? (
                <ul>
                    <li>
                        {}
                    </li>
                    <li>
                        <a href="/profile">Profile</a>
                    </li>
                    <li>
                        <a onClick={handleLogout}>Logout</a>
                    </li>
                </ul>
            ): (
                <ul>
                    <li>
                        <a href="/login">Login</a>
                    </li>
                    <li>
                        <a href="/signup">Signup</a>
                    </li>
                </ul>
            )}
        </>
    )
}
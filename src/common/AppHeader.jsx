import React, {useEffect, useRef, useState} from 'react';
import {ACCESS_TOKEN} from "../constant/constants";
import Alert from "react-s-alert";
import logo from '../image/FilmstashLogo.png';
import './AppHeader.css';
import {isLoggedIn} from "../util/APIUtils";
import MenuIcon from '@mui/icons-material/Menu';
import {getRequest} from "../axios-wrapper";

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
                    <div className={'mobile-search'}>
                        <Search/>
                    </div>
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
                        <div className={'menu-search'}>
                        {<Search />}
                        </div>
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

function Search() {
    const [search, setSearch] = useState('');
    const [showSearchDropdown, setShowSearchDropdown] = useState({});
    const [users, setUsers] = useState(null);

    useEffect(async () => {
        const usersData = await getRequest(`/api/user`);
        setUsers(usersData.data);
    }, []);

    return (
        <div className={'search-bar'}>
            <textarea className={'search-input'} rows={1} value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={'Search user...'}
                      onFocus={() => setShowSearchDropdown(true)}
                      onBlur={() => setShowSearchDropdown(false)}
            />
            {search.length > 0 &&
                <div className={'search-dropdown'}>
                    <ul className={'search-dropdown-list'}>
                        {users.filter(user => {return user.email.toLowerCase().includes(search.toLowerCase())})
                            .slice(0, 3).map(user => {
                            return(
                                <li className={'search-dropdown-list-item'} key={user.id}>
                                    <a href={`/user/${user.id}`}>{user.email}</a>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            }
        </div>
    )
}
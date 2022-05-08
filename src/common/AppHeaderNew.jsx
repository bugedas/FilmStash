import './AppHeaderNew.scss';
import logo from "../image/FilmstashLogo.png";
import defaultUser from "../image/default-user.png";
import React, {useContext, useEffect, useState} from "react";
import {isLoggedIn} from "../util/axiosUtils";
import {ACCESS_TOKEN, defaultImdbImg, tmdbImageLink} from "../constant/constants";
import {getRequest, tmdbGetRequest} from "../axios-wrapper";
import {useComponentVisible} from "../util/customHooks";
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import {filmTvLink, filmTypeString} from "../util/BaseUtils";
import {UserContext} from "../contexts/UserContext";
import {FilmListDialog, FriendsDialog} from "./Dialogs";
import LaunchIcon from '@mui/icons-material/Launch';
import {useNavigate} from "react-router-dom";

export default function AppHeaderNew() {
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [showFollowing, setShowFollowing] = useState(false);
    const [listDialog, setListDialog] = useState(false);
    const {user} = useContext(UserContext);
    const accessTk = localStorage.getItem(ACCESS_TOKEN);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem(ACCESS_TOKEN);
        navigate('/');
        window.location.reload(false);
    }

    if (!user && accessTk) {
        return null;
    }

    return (
        <header className={'header-container'}>
            <a href="/" className="header-title">
                <img src={logo} alt="Logo" className={'header-logo'}/>
            </a>
            {isLoggedIn() ? (
                <>
                    <Search showMobileSearch={showMobileSearch} setShowMobileSearch={setShowMobileSearch}/>
                    <div className={'header-mobile-menu'}>
                        <SearchIcon className={'header-mobile-search-icon'}
                                    onClick={() => {
                                        setShowMobileSearch(!showMobileSearch);
                                        setShowMobileMenu(false)
                                    }}/>
                        <MenuIcon className={'header-mobile-menu-icon'}
                                  onClick={() => {
                                      setShowMobileMenu(!showMobileMenu);
                                      setShowMobileSearch(false);
                                  }}/>
                    </div>
                    <div className={`header-menu ${showMobileMenu ? 'mobile' : ''}`}>
                        {showMobileMenu &&
                        <CloseIcon className={'header-mobile-close'} onClick={() => setShowMobileMenu(false)}/>}
                        <a href="/watching-now">Watching Now</a>
                        <a href="/profile">Profile</a>
                        <a className="menu-item-only-mobile" onClick={() => setShowFollowing(true)}>Following</a>
                        <a className="menu-item-only-mobile" onClick={() => setListDialog(true)}>My Lists</a>
                        <a onClick={handleLogout}>Logout</a>
                    </div>
                    <FriendsDialog userId={user.id} open={showFollowing} onClose={setShowFollowing}/>
                    <FilmListDialog userId={user.id} open={listDialog} onClose={setListDialog} permissions={true}/>
                </>
            ) : (
                <>
                    <div className={'header-mobile-menu'}>
                        <MenuIcon className={'header-mobile-menu-icon'}
                                  onClick={() => {
                                      setShowMobileMenu(!showMobileMenu);
                                  }}/>
                    </div>
                    <div className={`header-menu ${showMobileMenu ? 'mobile' : ''}`}>
                        {showMobileMenu &&
                        <CloseIcon className={'header-mobile-close'} onClick={() => setShowMobileMenu(false)}/>}
                        <a href="/login">Login</a>
                        <a href="/signup">Signup</a>
                    </div>
                </>
            )}
        </header>
    )
}

function Search(props) {
    const [search, setSearch] = useState('');
    const [users, setUsers] = useState([]);
    const [filmSuggestions, setFilmSuggestions] = useState(null);
    const {ref, isComponentVisible, setIsComponentVisible} = useComponentVisible(true);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (search !== '') {
                const tmdbSuggestionData = await tmdbGetRequest(`search/multi?language=en-US&query=${search.toLowerCase()}&page=1&include_adult=false`);
                setFilmSuggestions(tmdbSuggestionData?.data?.results.slice(0, 3));
                const usersData = await getRequest(`/api/user/${search}`);
                setUsers(usersData?.data);
            }
        }, 300)

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    return (
        <div className={`${props.showMobileSearch ? 'header-search-mobile-container' : ''}`}>
            {props.showMobileSearch &&
            <CloseIcon className={'header-mobile-close'} onClick={() => props.setShowMobileSearch(false)}/>}
            <div className={`header-search-container`} ref={ref}>
                <input className={'header-search-input'} rows={1} value={search}
                       onChange={(e) => setSearch(e.target.value)}
                       placeholder={'Search users, films or actors...'}
                       onClick={() => setIsComponentVisible(true)}
                />
                {filmSuggestions && isComponentVisible && search &&
                <div className={'header-search-results-dropdown'}>
                    {filmSuggestions?.map(result => {
                        return (
                            <SearchResult result={result}/>
                        )
                    })}
                    {users?.length > 0 && <div className={'hsr-users-title'}>Users</div>}
                    {users?.slice(0, 3)?.map(result => {
                        return (
                            <UserResult userId={result.followedId} result={result}/>
                        )
                    })}
                </div>
                }
            </div>
        </div>
    )
}

export function SearchResult({result}) {
    const [link, setLink] = useState('');

    useEffect(async () => {
        const getData = async () => {
            if (result.media_type === 'person') {
                const person = await tmdbGetRequest(`person/${result.id}?`);
                setLink(`https://www.imdb.com/name/${person.data.imdb_id}`);
            } else {
                setLink(`/${filmTvLink(result.media_type)}/${result.id}`);
            }
        }

        await getData();

    }, [result]);

    const resultImage = (result) => {
        if (result.poster_path) {
            return tmdbImageLink(result?.poster_path);
        }
        if (result.profile_path) {
            return tmdbImageLink(result?.profile_path);
        }
        return defaultImdbImg;
    }

    return (
        <a href={link} target={result.media_type === 'person' && '_blank'} className={'header-search-result'}>

            <img className={'hsr-image'} src={resultImage(result)} alt={`${result.name} image`}/>
            <div className={'hsr-info'}>
                <div className={'hsr-title'}>{result.name || result.title}</div>
                <div className={'hsr-type'}>{filmTypeString(result.media_type)}</div>
            </div>
            {result.media_type === 'person' && <LaunchIcon sx={{marginLeft: 'auto'}}/>}
        </a>
    )
}

export function UserResult({userId, result}) {
    const [userData, setUserData] = useState(null);
    const [userImg, setUserImg] = useState('');

    useEffect(async () => {
        if (!result) {
            const {data} = await getRequest(`/api/user/id/${userId}`);
            setUserData(data);
        } else {
            setUserData(result);
        }
    }, []);

    if (!userData) {
        return null;
    }

    return (
        <a href={`/user/${userData.id}`} className={'header-search-result'}>
            <img className={'hsr-image'} src={userImg || userData?.imageUrl || defaultUser}
                 onError={() => setUserImg(defaultUser)}
                 alt={`${userData.name} image`}/>
            <div className={'hsr-info'}>
                <div className={'hsr-title'}>{userData.name}</div>
            </div>
        </a>
    )
}
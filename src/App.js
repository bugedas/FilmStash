import './App.scss';
import {Route, Routes} from "react-router-dom";
import Home from "./page/Home";
import Login from "./page/Login";
import Signup from "./page/Signup";
import OAuth2RedirectHandler from "./authentication/OAuth2RedirectHandler";
import NotFound from "./page/NotFound";
import Profile from "./page/Profile";
import HomeLoggedIn from "./page/HomeLoggedIn";
import Film from "./page/Film";
import User from "./page/User";
import AppFooter from "./common/AppFooter";
import AppHeaderNew from "./common/AppHeaderNew";
import TvSeries from "./page/TvSeries";
import WatchingNow from "./page/WatchingNow";
import {UserContext} from './contexts/UserContext';
import {useEffect, useMemo, useState} from "react";
import {getRequest} from "./axios-wrapper";
import {ACCESS_TOKEN} from "./constant/constants";

function App() {
    const [user, setUser] = useState(null);
    useEffect(async () => {
        const currUserData = await getRequest(`/api/user/me`);
        if (currUserData?.error?.response?.status === 401) {
            localStorage.removeItem(ACCESS_TOKEN);
            window.location.reload(false);
        } else {
            setUser(currUserData.data);
        }
    }, []);


    const providerUser = useMemo(() => ({user, setUser}), [user, setUser]);

    return (
        <div className="app">
            <UserContext.Provider value={providerUser}>
                <AppHeaderNew/>
                <div className="app-body">
                    <Routes>
                        <Route exact path="/" element={<Home/>}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/signup" element={<Signup/>}/>
                        <Route path="/profile" element={<Profile/>}/>
                        <Route path="/film/:id" element={<Film/>}/>
                        <Route path="/tv/:id" element={<TvSeries/>}/>
                        <Route path="/user/:id" element={<User/>}/>
                        <Route path="/watching-now" element={<WatchingNow/>}/>
                        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler/>}/>
                        <Route element={<NotFound/>}/>
                        <Route element={<HomeLoggedIn/>}/>
                    </Routes>
                </div>
                <AppFooter/>
            </UserContext.Provider>
        </div>
    );
}

export default App;

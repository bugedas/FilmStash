import logo from './logo.svg';
import './App.css';
import AppHeader from "./common/AppHeader";
import {Route, Router, Routes} from "react-router-dom";
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

function App() {

  return (
      <div className="app">
        <div className="app-top-box">
          <AppHeader/>
        </div>
        <div className="app-body">
          <Routes>
            <Route exact path="/" element={<Home/>}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/signup" element={<Signup />}/>
            <Route path="/profile" element={<Profile />}/>
            <Route path="/film/:id" element={<Film />}/>
            <Route path="/user/:id" element={<User />}/>
            <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler/>}/>
            <Route element={<NotFound/>}/>
            <Route element={<HomeLoggedIn/>}/>
          </Routes>
        </div>
          <AppFooter/>
      </div>
  );

}

export default App;

import logo from './logo.svg';
import './App.css';
import AppHeader from "./Common/AppHeader";
import {Route, Router, Routes} from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import OAuth2RedirectHandler from "./Auth/OAuth2RedirectHandler";
import NotFound from "./Pages/NotFound";
import Profile from "./Pages/Profile";
import HomeLoggedIn from "./Pages/HomeLoggedIn";
import Film from "./Pages/Film";
import User from "./Pages/User";
import AppFooter from "./Common/AppFooter";

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

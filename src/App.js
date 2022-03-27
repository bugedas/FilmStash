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

function App() {


  // <script>
  //   window.fbAsyncInit = function() {
  //   FB.init({
  //     appId      : '{your-app-id}',
  //     cookie     : true,
  //     xfbml      : true,
  //     version    : '{api-version}'
  //   });
  //
  //   FB.AppEvents.logPageView();
  //
  // };
  //
  //   (function(d, s, id){
  //   var js, fjs = d.getElementsByTagName(s)[0];
  //   if (d.getElementById(id)) {return;}
  //   js = d.createElement(s); js.id = id;
  //   js.src = "https://connect.facebook.net/en_US/sdk.js";
  //   fjs.parentNode.insertBefore(js, fjs);
  // }(document, 'script', 'facebook-jssdk'));
  // </script>

  return (
      <div className="app">
          <AppHeaderNew/>
            <div className="app-body">
              <Routes>
                <Route exact path="/" element={<Home/>}/>
                <Route path="/login" element={<Login />}/>
                <Route path="/signup" element={<Signup />}/>
                <Route path="/profile" element={<Profile />}/>
                <Route path="/film/:id" element={<Film />}/>
                <Route path="/tv/:id" element={<TvSeries />}/>
                <Route path="/user/:id" element={<User />}/>
                <Route path="/watching-now" element={<WatchingNow />}/>
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

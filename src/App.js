import './App.css';
import * as React from 'react'
import { BrowserRouter as Router, Route, Link, Routes, useNavigate } from "react-router-dom";
import LandingPage from './pages/LandingPage/langdingpage';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from "./pages/profile/profile";
import MyLinks from "./pages/Mylinks/Mylinks";
import InsertPage from "./pages/Insertpage/InsertPage";
import PreviewLink from './pages/Previewlink/PreviewLink';
import EditePage from './pages/EditePage/EditePage';


import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'

function App() {

  const [state, dispatch] = React.useContext(UserContext);
  let navigate = useNavigate();

  const [isLoading, setIsLoading] = React.useState(true);

  // Redirect Auth here ...
  React.useEffect(() => {
    // Redirect Auth
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    if (state.isLogin === false && !isLoading) {
      navigate("/");
    }
  }, [state]);

  const checkUser = async () => {
    try {
      const response = await API.get("/check-auth");
      console.log(response);
      // If the token incorrect
      if (response.status === 404) {
        return dispatch({
          type: "AUTH_ERROR",
        });
      }

      // Get user data
      let payload = response.data.data;
      console.log(payload);
      // Get token from local storage
      payload.token = localStorage.token;
      console.log(payload);
      // Send data to useContext
      dispatch({
        type: "USER_SUCCESS",
        payload,
      });
      console.log(state);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    checkUser();
  }, []);

  return (
    <Routes>
      <Route exact path="/" element={<LandingPage/>} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/my-link" element={<MyLinks  />} />
      <Route path="/insert-link/:template" element={<InsertPage />} />
      <Route path="/edite-link/:unique_link" element={<EditePage />} />
      <Route path="/wayslink/:unique_link" element={<PreviewLink/>} />
    </Routes>
  );
}

export default App;

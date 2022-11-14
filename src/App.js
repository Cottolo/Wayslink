import './App.css';
import * as React from 'react'
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import LandingPage from './pages/LandingPage/langdingpage';
import Dashboard from './pages/Dashboard/Dashboard';
import Profile from "./pages/profile/profile";
import MyLinks from "./pages/Mylinks/Mylinks";
import InsertPage from "./pages/Insertpage/InsertPage";
import PreviewLink from "./components/previewlink/PreviewLink";


import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'

function App() {

  return (
    <Routes>
      <Route exact path="/" element={<LandingPage/>} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/myLinks" element={<MyLinks  />} />
      <Route path="/insertLink/:template" element={<InsertPage />} />
      <Route path="/wayslink/:unique_link" element={<PreviewLink  />} />
    </Routes>
  );
}

export default App;

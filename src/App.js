import './App.css';
// import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import NoPage from "./pages/NoPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Post from "./pages/Post";
import Create from "./pages/Create";
import Update from "./pages/Update";
import Search from "./pages/Search";
import Profile from "./pages/Profile";
import ProfilePhoto from './pages/ProfilePhoto';
import User from './pages/User';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="post/:id" element={<Post />} />
            <Route path="update/:id" element={<Update />} />
            <Route path="create" element={<Create />} />
            <Route path="search" element={<Search />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile-photo" element={<ProfilePhoto />} />
            <Route path="user/:id" element={<User />} />
            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

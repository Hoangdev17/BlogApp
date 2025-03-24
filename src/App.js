import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Navbar from './pages/Navbar.jsx'
import PostDetail from './pages/PostDetail.jsx';
import CreatePost from './pages/createPost.jsx';
import EditPostPage from './pages/editPost.jsx';
import ProfilePage from './pages/profile.jsx';

function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/posts/create" element={<CreatePost />} />
        <Route path="/posts/:id" element={<EditPostPage />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

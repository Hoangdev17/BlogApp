import React from 'react';
import PostForm from './PostForm.jsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreatePostPage = () => {
  const navigate = useNavigate();

  const handleCreate = async (data) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.content);
      if (data.image) formData.append('image', data.image);

      await axios.post('http://localhost:5000/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, 
        },
      });

      navigate('/');
    } catch (err) {
      console.error('Lỗi khi tạo bài viết:', err);
    }
  };

  return <PostForm onSubmit={handleCreate} />;
};

export default CreatePostPage;

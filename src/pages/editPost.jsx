import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostForm from './PostForm.jsx';
import axios from '../services/axios.js';

const EditPostPage = () => {
  const { id } = useParams();
  const [postData, setPostData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`/posts/${id}`);
        setPostData(res.data);
      } catch (err) {
        console.error('Không tìm thấy bài viết:', err);
      }
    };

    fetchPost();
  }, [id]);

  const handleUpdate = async (data) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.content);
      formData.append('tags', data.tags);
      if (data.image) formData.append('image', data.image);

      await axios.put(`/api/posts/${id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      navigate(`/posts/${id}`);
    } catch (err) {
      console.error('Lỗi khi cập nhật bài viết:', err);
    }
  };

  return postData ? <PostForm postData={postData} onSubmit={handleUpdate} /> : <p>Đang tải...</p>;
};

export default EditPostPage;

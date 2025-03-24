import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Avatar, Card, List, Typography, Skeleton, Space, Modal, Form, Input, message, Button } from 'antd';
import PostForm from './PostForm';
import EditProfileForm from './EditProfileForm.jsx';

const { Title, Text, Paragraph } = Typography;

const ProfilePage = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editUserModal, setEditUserModal] = useState(false);
  const [form] = Form.useForm();

  const navigate = useNavigate();

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
    setEditUserModal(false); // cập nhật state user khi backend trả về user mới
  };

  const handleUpdate = async (data) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.content);
      formData.append('tags', data.tags);
      if (data.image) formData.append('image', data.image);
  
      const res = await axios.put(`http://localhost:5000/api/posts/${editingPost._id}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
  
      // Cập nhật danh sách bài viết sau khi sửa
      setPosts((prev) =>
        prev.map((p) => (p._id === editingPost._id ? res.data : p))
      );
  
      setEditModalOpen(false);
    } catch (err) {
      console.error('Lỗi khi cập nhật bài viết:', err);
    }
  };
  

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    const fetchData = async () => {
      try {
        if (!token) {
          navigate('/login');
          return;
        }

        setLoading(true);
        
        // Fetch user profile
        const userRes = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);
        console.log(userRes.data);

        // Fetch posts
        const postsRes = await axios.get(`http://localhost:5000/api/posts?author=${id}`);
        setPosts(postsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  return (
    <div style={{
      maxWidth: 1200,
      margin: '0 auto',
      padding: '24px',
      marginTop: '100px',
      minHeight: 'calc(100vh - 100px)',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: '32px',
        '@media (maxWidth: 768px)': {
          gridTemplateColumns: '1fr',
        },
      }}>
        {/* Left Column: User Info */}
        <div style={{ minWidth: 280 }}>
          {loading ? (
            <Skeleton avatar paragraph={{ rows: 2 }} active />
          ) : user ? (
            <Card
              style={{
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              }}
            >
              <Space
                direction="vertical"
                size="middle"
                style={{
                  width: '100%',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Avatar
                  size={120}
                  src={user.avatarUrl}
                  style={{
                    border: '2px solid #f0f0f0',
                    marginBottom: 16,
                  }}
                >
                  {user.username?.[0]?.toUpperCase() || 'U'}
                </Avatar>
                <Title level={3} style={{ margin: 0 }}>
                  {user.username}
                </Title>
                <Text type="secondary" style={{ fontSize: '14px' }}>
                  {user.email}
                </Text>
              </Space>
              <Button type="link" onClick={() => setEditUserModal(true)}>
                Chỉnh sửa thông tin
              </Button>

            </Card>
          ) : null}
        </div>

        {/* Right Column: Posts */}
        <div>
          <Title level={4} style={{ marginBottom: 24 }}>
            Posts
          </Title>
          <List
  dataSource={posts}
  loading={loading}
  locale={{ emptyText: 'No posts available.' }}
  style={{
    width: '100%', // Ensure the List takes full width
  }}
  renderItem={(post) => (
    <List.Item 
      style={{ 
        padding: '8px 0',
        width: '100%', // Ensure List.Item takes full width
      }}
    >
      <Card
        hoverable
        onClick={() => {
          setEditingPost(post);
          setEditModalOpen(true);
        }}
        style={{
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          width: '100%', // Make card full width
        }}
        bodyStyle={{ 
          padding: 16,
          width: '100%', // Ensure content takes full width
        }}
      >
        <div style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          width: '100%', // Ensure container takes full width
          alignItems: 'flex-start', // Align items at top
        }}>
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              style={{
                width: 150,
                height: 120,
                objectFit: 'cover',
                borderRadius: '6px',
                flexShrink: 0,
              }}
            />
          )}
          <div style={{ 
            flex: 1, 
            minWidth: 200,
            width: '100%', // Ensure content area expands fully
          }}>
            <Title 
              level={5} 
              style={{ 
                margin: '0 0 8px 0',
                wordBreak: 'break-word', // Handle long titles
              }}
            >
              {post.title}
            </Title>
            <Paragraph
              ellipsis={{ rows: 2 }}
              style={{ 
                margin: 0, 
                color: '#595959',
                wordBreak: 'break-word', // Handle long content
              }}
            >
              {post.content}
            </Paragraph>
          </div>
        </div>
      </Card>
    </List.Item>
  )}
/>         
        </div>
      </div>

      <Modal
  open={editModalOpen}
  title="Chỉnh sửa bài viết"
  onCancel={() => setEditModalOpen(false)}
  footer={null}
  width={800}
  destroyOnClose
>
  {editingPost ? (
    <PostForm postData={editingPost} onSubmit={handleUpdate} />
  ) : (
    <p>Đang tải...</p>
  )}
</Modal>

<Modal
  open={editUserModal}
  title="Chỉnh sửa thông tin người dùng"
  onCancel={() => setEditUserModal(false)}
  footer={null}
  destroyOnClose
>
  <EditProfileForm user={user} onClose={() => setEditUserModal(false)} onUpdate={handleProfileUpdate}/>
</Modal>


    </div>
  ); 
};

export default ProfilePage;
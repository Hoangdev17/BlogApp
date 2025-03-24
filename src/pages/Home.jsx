import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Button, Spin, Typography, Empty, Tag, Space } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import API from '../services/axios';
import { EyeOutlined } from '@ant-design/icons';
import queryString from 'query-string';
import SearchBar from './SearchBar';
import TagFilter from './TagFilter';
import { LikeOutlined, DislikeOutlined } from '@ant-design/icons';

const { Meta } = Card;
const { Title } = Typography;

const fallbackImage = 'https://via.placeholder.com/300x200?text=No+Image';

const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();

  const { search, tag } = queryString.parse(location.search);

  const user = JSON.parse(localStorage.getItem("user") || '{}');
  const currentUserId = user?._id;
;
  const fetchPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get('/posts', {
        params: { search, tag },
      });
      setPosts(response.data);
    } catch (err) {
      console.error('Lỗi khi tải bài viết:', err);
      setError('Không thể tải bài viết. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {    
    fetchPosts();
  }, [location.search]);

  return (
    <div
      style={{
        padding: '40px 20px',
        background: '#f0f2f5',
        minHeight: '100vh',
        marginTop: "50px"
      }}
    >
      <SearchBar />
      <TagFilter />
      <Title level={2} style={{ textAlign: 'center', marginBottom: '40px' }}>
        Danh Sách Bài Viết
      </Title>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" tip="Đang tải bài viết..." />
        </div>
      ) : error ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<span>{error}</span>}
          style={{ marginTop: '50px' }}
        />
      ) : posts.length === 0 ? (
        <Empty
          description={<span>Chưa có bài viết nào.</span>}
          style={{ marginTop: '50px' }}
        />
      ) : (
        <Row gutter={[16, 16]} justify="center">
          {posts.map((post) => (
            <Col xs={24} sm={12} md={8} lg={6} key={post._id}>
              <Card
                hoverable
                style={{
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                }}
                cover={
                  <img
                    alt={post.title}
                    src={post.image || fallbackImage}
                    style={{ height: '200px', objectFit: 'cover' }}
                    onError={(e) => (e.target.src = fallbackImage)}
                  />
                }
              >
                <Meta
                  title={post.title}
                  description={
                    <div>
                      <div style={{ minHeight: '60px' }}>
                        {post.content?.length > 100
                          ? post.content.substring(0, 100) + '...'
                          : post.content || 'Không có mô tả'}
                      </div>

                      {/* Tag list */}
                      <Space wrap style={{ marginTop: '10px' }}>
                        {post.tags?.map((tag) => (
                          <Tag key={tag} color="blue">
                            #{tag}
                          </Tag>
                        ))}
                      </Space>
                    </div>
                  }
                />

      <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
      <Button
          icon={<LikeOutlined />}
          onClick={async () => {
            try {
              const res = await API.put(`/posts/${post._id}/like`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
              });
              const updatedPost = res.data;

              setPosts((prev) =>
                prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
              );
            } catch (err) {
              console.error('Lỗi khi like:', err);
            }
          }}
          type={post.likes.includes(currentUserId) ? 'primary' : 'default'} // tô màu khi đã like
        >
          {post.likes?.length || 0}
        </Button>

        <Button
          icon={<DislikeOutlined />}
          onClick={async () => {
            try {
              const res = await API.put(`/posts/${post._id}/dislike`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
              });
              const updatedPost = res.data;

              setPosts((prev) =>
                prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
              );
            } catch (err) {
              console.error('Lỗi khi dislike:', err);
            }
          }}
          danger={post.dislikes.includes(currentUserId)} // tô màu khi đã dislike
        >
          {post.dislikes?.length || 0}
        </Button>



            </div>


                <Button
                  type="link"
                  icon={<EyeOutlined />}
                  style={{ marginTop: '10px', padding: 0 }}
                >
                  <Link to={`/posts/${post._id}`}>Xem chi tiết</Link>
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default HomePage;

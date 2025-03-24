import React, { useState, useEffect } from 'react';
import {
  Button,
  Input,
  List,
  Avatar,
  Form,
  Typography,
  Spin,
  Card,
  Empty,
  message,
} from 'antd';
import { useParams } from 'react-router-dom';
import { UserOutlined, SendOutlined } from '@ant-design/icons';
import API from '../services/axios';

const { TextArea } = Input;
const { Title, Paragraph } = Typography;

const PostDetail = () => {
  const { id } = useParams(); // Get post ID from URL
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form] = Form.useForm(); // Form instance for comment submission

  const fetchPost = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get(`/posts/${id}`); // Consistent endpoint
      setPost(response.data);
      setComments(response.data.comments || []);
      console.log(response.data.comments); // Default to empty array if no comments
    } catch (error) {
      console.error('Error fetching post details:', error);
      setError('Không thể tải bài viết. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      message.warning('Vui lòng nhập nội dung bình luận!');
      return;
    }
    setLoading(true);
    try {
      const response = await API.post(`/posts/${id}/comments`, {
        content: newComment,
      });
      setComments([...comments, response.data]);
      setNewComment('');
      form.resetFields();
      message.success('Bình luận đã được gửi thành công!');
    } catch (error) {
      console.error('Error submitting comment:', error);
      message.error(
        'Không thể gửi bình luận: ' +
          (error.response?.data?.message || 'Lỗi không xác định')
      );
    } finally {
      setLoading(false);
      fetchPost()
    }
  };

  const fallbackImage = 'a';

  return (
    <div
      style={{
        padding: '40px 20px',
        background: '#f0f2f5',
        minHeight: '100vh',
      }}
    >
      {loading && !post ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" tip="Đang tải bài viết..." />
        </div>
      ) : error ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<span>{error}</span>}
          style={{ marginTop: '50px' }}
        />
      ) : post ? (
        <>
          <Card
            style={{
              maxWidth: '800px',
              margin: '0 auto 24px auto',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              padding: '16px',
            }}
          >
            <Title level={2} style={{ marginBottom: '16px' }}>
              {post.title}
            </Title>
            <img
              src={post.image}
              alt={post.title}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '400px',
                objectFit: 'cover',
                borderRadius: '8px',
                marginBottom: '16px',
              }}
              onError={(e) => (e.target.src = fallbackImage)}
            />
            <Paragraph style={{ fontSize: '16px', lineHeight: '1.6' }}>
              {post.content}
            </Paragraph>
          </Card>

          <Card
            title={<Title level={3}>Bình luận ({comments.length})</Title>}
            style={{
              maxWidth: '800px',
              margin: '0 auto',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              padding: '16px',
            }}
          >
            {comments.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Chưa có bình luận nào."
              />
            ) : (
              <List
                dataSource={comments}
                renderItem={(comment) => (
                  <List.Item
                    style={{
                      borderBottom: '1px solid #f0f0f0',
                      padding: '12px 0',
                    }}
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          src={comment.user?.avatarUrl}
                          icon={!comment.user?.avatarUrl && <UserOutlined />}
                          alt={comment.user?.username}
                        />

                      }
                      title={
                        <span style={{ fontWeight: 'bold' }}>
                          {comment.user?.username || 'Ẩn danh'}
                        </span>
                      }
                      description={
                        <>
                          <Paragraph style={{ marginBottom: '4px' }}>
                            {comment.content}
                          </Paragraph>
                          {comment.createdAt && (
                            <span style={{ color: '#888', fontSize: '12px' }}>
                              {new Date(comment.createdAt).toLocaleString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          )}
                        </>
                      }
                    />

                  </List.Item>
                )}
              />
            )}

            <Form form={form} onFinish={handleCommentSubmit} style={{ marginTop: '16px' }}>
              <Form.Item name="comment">
                <TextArea
                  rows={4}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Viết bình luận của bạn..."
                  style={{ borderRadius: '6px' }}
                  disabled={loading}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SendOutlined />}
                  style={{
                    borderRadius: '6px',
                    background: '#1890ff',
                    borderColor: '#1890ff',
                  }}
                >
                  Gửi bình luận
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </>
      ) : (
        <Empty
          description="Bài viết không tồn tại."
          style={{ marginTop: '50px' }}
        />
      )}
    </div>
  );
};

export default PostDetail;
import { Form, Input, Button, Typography, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice.js';
import API from '../services/axios.js';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/login', values);
      dispatch(loginSuccess(res.data));
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      message.success('Đăng nhập thành công!');
      navigate('/'); 
    } catch (err) {
      if (err.response && err.response.data) {
        message.error(err.response.data.message || 'Sai tài khoản hoặc mật khẩu');
      } else {
        message.error('Đã xảy ra lỗi khi đăng nhập');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: '#f0f2f5', // Light background for contrast
      }}
    >
      <Card
        style={{
          width: 400,
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          padding: '20px',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Title level={3}>Đăng Nhập</Title>
        </div>
        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Email"
              size="large"
              style={{ borderRadius: '4px' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }, { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              size="large"
              style={{ borderRadius: '4px' }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              style={{
                width: '100%',
                borderRadius: '4px',
                background: '#1890ff',
                borderColor: '#1890ff',
              }}
            >
              Đăng nhập
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <a href="/register" style={{ color: '#1890ff' }}>
              Chưa có tài khoản? Đăng ký ngay!
            </a>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;

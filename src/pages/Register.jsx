import { Form, Input, Button, Typography, Card, message } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice.js';
import API from '../services/axios.js';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm(); // For form instance control

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/register', {
        username: values.username,
        email: values.email,
        password: values.password,
      });

      // Auto-login after successful registration
      dispatch(loginSuccess(res.data));
      localStorage.setItem('token', res.data.token);
      message.success('Đăng ký thành công! Đã tự động đăng nhập.');
      navigate('/'); // Redirect to homepage
    } catch (err) {
      message.error(
        'Đăng ký thất bại: ' + (err.response?.data?.message || 'Lỗi không xác định')
      );
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
        background: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)', // Gradient background
      }}
    >
      <Card
        style={{
          width: 450,
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
          borderRadius: '12px',
          padding: '24px',
          background: '#fff',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Title level={2} style={{ color: '#1890ff' }}>
            Tạo Tài Khoản
          </Title>
          <Text type="secondary">Đăng ký để bắt đầu hành trình của bạn!</Text>
        </div>
        <Form
          form={form}
          name="register_form"
          onFinish={onFinish}
          layout="vertical"
          scrollToFirstError
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: 'Vui lòng nhập tên người dùng!' },
              { min: 3, message: 'Tên người dùng phải có ít nhất 3 ký tự!' },
              { max: 20, message: 'Tên người dùng không được vượt quá 20 ký tự!' },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#1890ff' }} />}
              placeholder="Tên người dùng"
              size="large"
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: '#1890ff' }} />}
              placeholder="Email"
              size="large"
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#1890ff' }} />}
              placeholder="Mật khẩu"
              size="large"
              style={{ borderRadius: '6px' }}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#1890ff' }} />}
              placeholder="Xác nhận mật khẩu"
              size="large"
              style={{ borderRadius: '6px' }}
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
                borderRadius: '6px',
                background: '#1890ff',
                borderColor: '#1890ff',
                height: '40px',
              }}
            >
              Đăng ký
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Text>
              Đã có tài khoản?{' '}
              <a href="/login" style={{ color: '#1890ff', fontWeight: 'bold' }}>
                Đăng nhập
              </a>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
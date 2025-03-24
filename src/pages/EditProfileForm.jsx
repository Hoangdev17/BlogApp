import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Input, Button, Upload, message, Avatar } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const EditProfileForm = ({ user, onUpdate }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [selectedFile, setSelectedFile] = useState(null); // lưu file thực tế

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
      });
      setAvatarPreview(user.avatarUrl || '');
    }
  }, [user, form]);

  const handleFinish = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('username', values.username);
      formData.append('email', values.email);

      if (selectedFile) {
        formData.append('image', selectedFile); // 👈 phải là 'image' ở đây
      }

      const res = await axios.put('http://localhost:5000/api/auth/me', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      message.success('Cập nhật thành công!');
      onUpdate(res.data); 
    } catch (err) {
      console.error(err);
      message.error('Cập nhật thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      onFinish={handleFinish}
      layout="vertical"
      style={{ maxWidth: 500, margin: 'auto' }}
    >
      <Form.Item label="Ảnh đại diện" name="avatar">
        <Upload
          listType="picture"
          maxCount={1}
          beforeUpload={() => false} // không auto upload
          onChange={({ fileList }) => {
            const fileObj = fileList[0]?.originFileObj;
            if (fileObj) {
              const reader = new FileReader();
              reader.onload = () => setAvatarPreview(reader.result);
              reader.readAsDataURL(fileObj);
              setSelectedFile(fileObj); // 👈 lưu file để gửi lên server
            }
          }}
        >
          <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
        </Upload>
        {avatarPreview && (
          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <Avatar src={avatarPreview} size={100} />
          </div>
        )}
      </Form.Item>

      <Form.Item label="Tên người dùng" name="username" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
        <Input />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Lưu thay đổi
        </Button>
      </Form.Item>
    </Form>
  );
};

export default EditProfileForm;

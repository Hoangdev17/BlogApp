import React, { useEffect, useState } from 'react';
import { Form, Input, Upload, Button, Card, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const PostForm = ({ postData, onSubmit }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (postData) {
      form.setFieldsValue({
        title: postData.title,
        content: postData.content,
      });

      if (postData.image) {
        setFileList([
          {
            uid: '-1',
            name: 'image.png',
            status: 'done',
            url: postData.image,
          },
        ]);
      }
    }
  }, [postData]);

  const handleFinish = (values) => {
    const image = fileList[0]?.originFileObj;
    onSubmit({ ...values, image });
  };

  return (
    <Card title={postData ? 'Chỉnh sửa bài viết' : 'Tạo bài viết'}>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="content" label="Nội dung" rules={[{ required: true }]}>
          <TextArea rows={5} />
        </Form.Item>
        <Form.Item name="tags" label="Tags">
          <Select mode="tags" style={{ width: '100%' }} placeholder="Nhập tag">
            {/* Nếu muốn hiện danh sách gợi ý có thể thêm Option ở đây */}
          </Select>
        </Form.Item>
        <Form.Item label="Ảnh bìa">
          <Upload
            beforeUpload={() => false}
            listType="picture"
            maxCount={1}
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {postData ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default PostForm;

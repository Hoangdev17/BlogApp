import { Layout, Menu, Button, Avatar, Drawer, Typography } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, setUser } from '../store/authSlice.js';
import { useState, useEffect } from 'react';
import {
  HomeOutlined,
  PlusOutlined,

  MenuOutlined,
  LogoutOutlined,
  LoginOutlined,
  UserAddOutlined,
} from '@ant-design/icons';

const { Header } = Layout;
const { Title } = Typography;

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  // State for Drawer visibility and selected menu key
  const [visible, setVisible] = useState(false);
  const [selectedKey, setSelectedKey] = useState(location.pathname);

  // Update selected key when route changes
  useEffect(() => {
    console.log(user);
    setSelectedKey(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    // Kiểm tra xem token hoặc thông tin người dùng có trong localStorage không
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      dispatch(setUser(user)); // Đặt người dùng vào Redux store
    }
  }, [dispatch]);

  // Logout handler
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleNavigateProfile = () => {
    if (user && user._id) {
      navigate(`/profile/${user._id}`);
    }
  };

  // Drawer handlers
  const showDrawer = () => setVisible(true);
  const onClose = () => setVisible(false);

  return (
    <Layout>
      <Header
        style={{
          position: 'fixed',
          zIndex: 1,
          width: '100%',
          background: '#001529',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
        }}
      >
        {/* Logo */}
        <Title
          level={4}
          style={{ color: 'white', margin: 0, lineHeight: '64px' }}
        >
          Blog App
        </Title>

        {/* Hamburger button for mobile */}
        <Button
          type="primary"
          onClick={showDrawer}
          className="hamburger"
          style={{ display: 'none' }}
        >
          <MenuOutlined />
        </Button>

        {/* Horizontal Menu for Desktop */}
        <Menu
          theme="dark"
          mode="horizontal"
          onClick={(e) => setSelectedKey(e.key)}
          selectedKeys={[selectedKey]}
          style={{
            lineHeight: '64px',
            display: 'flex',
            justifyContent: 'flex-end',
            flex: 1,
            background: 'transparent',
          }}
        >
          <Menu.Item key="/" icon={<HomeOutlined />}>
            <Link to="/">Trang chủ</Link>
          </Menu.Item>
          {user ? (
            <>
              <Menu.Item key="/create-post" icon={<PlusOutlined />}>
                <Link to="/posts/create">Tạo bài viết</Link>
              </Menu.Item>
              <Menu.Item key="logout" icon={<LogoutOutlined />}>
                <Button
                  onClick={handleLogout}
                  type="link"
                  style={{ padding: 0, color: '#fff' }}
                >
                  Đăng xuất
                </Button>
              </Menu.Item>
              <Menu.Item
                key="avatar"
                onClick={handleNavigateProfile}
                style={{ cursor: 'pointer' }}
              >
                <Avatar
                  style={{ backgroundColor: '#1890ff' }}
                  src={user.avatarUrl || undefined}
                >
                  {user.avatarUrl ? null : (user.name ? user.name[0].toUpperCase() : 'U')}
                </Avatar>
                <span style={{ marginLeft: 8 }}>{user.name}</span>
              </Menu.Item>
            </>
          ) : (
            <>
              <Menu.Item key="/login" icon={<LoginOutlined />}>
                <Link to="/login">Đăng nhập</Link>
              </Menu.Item>
              <Menu.Item key="/register" icon={<UserAddOutlined />}>
                <Link to="/register">Đăng ký</Link>
              </Menu.Item>
            </>
          )}
        </Menu>
      </Header>

      {/* Drawer for Mobile */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={onClose}
        visible={visible}
        bodyStyle={{ padding: 0 }}
      >
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={(e) => {
            setSelectedKey(e.key);
            onClose();
          }}
        >
          <Menu.Item key="/" icon={<HomeOutlined />}>
            <Link to="/">Trang chủ</Link>
          </Menu.Item>
          {user ? (
            <>
              <Menu.Item key="/posts/create" icon={<PlusOutlined />}>
                <Link to="/posts/create">Tạo bài viết</Link>
              </Menu.Item>
              <Menu.Item
                key="logout"
                icon={<LogoutOutlined />}
                onClick={handleLogout}
              >
                Đăng xuất
              </Menu.Item>
              <Menu.Item
                key="avatar"
                onClick={handleNavigateProfile}
                style={{ cursor: 'pointer' }}
              >
                <Avatar
                  style={{ backgroundColor: '#1890ff' }}
                  src={user.avatarUrl || undefined}
                >
                  {user.avatarUrl ? null : (user.name ? user.name[0].toUpperCase() : 'U')}
                </Avatar>
                <span style={{ marginLeft: 8 }}>{user.name}</span>
              </Menu.Item>
            </>
          ) : (
            <>
              <Menu.Item key="/login" icon={<LoginOutlined />}>
                <Link to="/login">Đăng nhập</Link>
              </Menu.Item>
              <Menu.Item key="/register" icon={<UserAddOutlined />}>
                <Link to="/register">Đăng ký</Link>
              </Menu.Item>
            </>
          )}
        </Menu>
      </Drawer>
    </Layout>
  );
};

export default Navbar;
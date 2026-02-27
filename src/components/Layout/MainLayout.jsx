import React, { useState, useEffect } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space, Drawer, Badge, Typography } from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  MenuOutlined,
  PlusOutlined,
  LogoutOutlined,
  SwapOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser, setCurrentUser, MOCK_USERS } from '../../store/storage';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;

const MainLayout = ({ children, currentUser, onUserChange, showCreateButton = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    {
      key: '/',
      icon: <FileTextOutlined />,
      label: 'Листы инвентаризации'
    }
  ];

  const userMenuItems = [
    ...MOCK_USERS.map(user => ({
      key: user.id,
      icon: user.role === 'master' ? <UserOutlined /> : <SwapOutlined />,
      label: `${user.name} (${user.role === 'master' ? 'Мастер' : 'Исполнитель'})`
    })),
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Сменить пользователя'
    }
  ];

  const handleUserMenuClick = ({ key }) => {
    if (key === 'logout') {
      onUserChange(null);
    } else {
      const user = MOCK_USERS.find(u => u.id === key);
      if (user) {
        onUserChange(user);
      }
    }
  };

  const renderSider = () => (
    <Sider
      width={240}
      className="main-sider"
      breakpoint="md"
      collapsedWidth={0}
      trigger={null}
    >
      <div className="logo-container">
        <Title level={4} className="logo-text">Инвентаризация</Title>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        className="main-menu"
      />
      {showCreateButton && currentUser?.role === 'master' && (
        <div className="sider-actions">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/create')}
            block
            size="large"
          >
            Создать лист
          </Button>
        </div>
      )}
    </Sider>
  );

  const renderHeader = () => (
    <Header className="main-header">
      <div className="header-left">
        {isMobile && (
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setMobileMenuOpen(true)}
            className="menu-toggle"
          />
        )}
        <Title level={4} className="header-title">
          {location.pathname === '/' && 'Реестр листов инвентаризации'}
          {location.pathname === '/create' && 'Создание листа инвентаризации'}
          {location.pathname.startsWith('/sheet/') && 'Лист инвентаризации'}
        </Title>
      </div>
      <div className="header-right">
        {currentUser && (
          <Dropdown
            menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button type="text" className="user-button">
              <Space>
                <Avatar size="small" icon={<UserOutlined />} />
                <span className="user-name">{currentUser.name}</span>
              </Space>
            </Button>
          </Dropdown>
        )}
      </div>
    </Header>
  );

  if (!currentUser) {
    return (
      <Layout className="user-select-layout">
        <Content className="user-select-content">
          <div className="user-select-card">
            <Title level={3}>Выберите пользователя</Title>
            <Text type="secondary" style={{ display: 'block', marginBottom: 24 }}>
              Для работы с системой необходимо выбрать роль
            </Text>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              {MOCK_USERS.map(user => (
                <Button
                  key={user.id}
                  size="large"
                  icon={user.role === 'master' ? <UserOutlined /> : <SwapOutlined />}
                  onClick={() => onUserChange(user)}
                  block
                >
                  {user.name}
                  <Text type="secondary"> ({user.role === 'master' ? 'Мастер' : 'Исполнитель'})</Text>
                </Button>
              ))}
            </Space>
          </div>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout className="main-layout">
      {!isMobile && renderSider()}
      <Layout>
        {renderHeader()}
        <Content className="main-content">
          {children}
        </Content>
      </Layout>
      
      <Drawer
        placement="left"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        width={280}
        bodyStyle={{ padding: 0 }}
      >
        <div className="mobile-logo-container">
          <Title level={4}>Инвентаризация</Title>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={({ key }) => {
            navigate(key);
            setMobileMenuOpen(false);
          }}
        />
        {showCreateButton && currentUser?.role === 'master' && (
          <div className="mobile-sider-actions">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                navigate('/create');
                setMobileMenuOpen(false);
              }}
              block
              size="large"
            >
              Создать лист
            </Button>
          </div>
        )}
      </Drawer>
    </Layout>
  );
};

export default MainLayout;

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import MainLayout from './components/Layout/MainLayout';
import SheetRegistry from './pages/SheetRegistry/SheetRegistry';
import CreateSheet from './pages/CreateSheet/CreateSheet';
import SheetDetail from './pages/SheetDetail/SheetDetail';
import { getCurrentUser, setCurrentUser } from './store/storage';
import './styles/index.css';

const App = () => {
  const [currentUser, setCurrentUserState] = useState(null);

  useEffect(() => {
    // Загружаем текущего пользователя из localStorage
    const user = getCurrentUser();
    if (user) {
      setCurrentUserState(user);
    }
  }, []);

  const handleUserChange = (user) => {
    if (user) {
      setCurrentUser(user);
    } else {
      localStorage.removeItem('current_user');
    }
    setCurrentUserState(user);
  };

  return (
    <ConfigProvider
      locale={ruRU}
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
        components: {
          Button: {
            borderRadius: 6,
          },
          Card: {
            borderRadius: 8,
          },
          Input: {
            borderRadius: 6,
          },
          Select: {
            borderRadius: 6,
          },
        },
      }}
    >
      <Router basename="/new_inventory">
        <MainLayout 
          currentUser={currentUser} 
          onUserChange={handleUserChange}
          showCreateButton={true}
        >
          <Routes>
            <Route path="/" element={
              currentUser ? (
                <SheetRegistry currentUser={currentUser} />
              ) : (
                <div style={{ textAlign: 'center', padding: 50 }}>
                  Выберите пользователя для начала работы
                </div>
              )
            } />
            <Route path="/create" element={
              currentUser?.role === 'master' ? (
                <CreateSheet currentUser={currentUser} />
              ) : (
                <div style={{ textAlign: 'center', padding: 50 }}>
                  У вас нет доступа к этой странице
                </div>
              )
            } />
            <Route path="/sheet/:id" element={
              currentUser ? (
                <SheetDetail currentUser={currentUser} />
              ) : (
                <div style={{ textAlign: 'center', padding: 50 }}>
                  Выберите пользователя для просмотра листа
                </div>
              )
            } />
          </Routes>
        </MainLayout>
      </Router>
    </ConfigProvider>
  );
};

export default App;

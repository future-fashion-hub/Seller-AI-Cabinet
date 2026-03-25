import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout, ConfigProvider, App as AntdApp, theme as antdTheme } from 'antd';
import ruRU from 'antd/locale/ru_RU';
import { ThemeProvider } from '../theme/ThemeProvider';
import { useTheme } from '../theme/ThemeContext';
import styles from './App.module.css';

import HomePage from '../pages/HomePage/HomePage';
import ItemViewPage from '../pages/ItemViewPage/ItemViewPage';
import ItemEditPage from '../pages/ItemEditPage/ItemEditPage';

const { Content } = Layout;

const AppContent: React.FC = () => {
  const { theme } = useTheme();

  return (
    <ConfigProvider
      locale={ruRU}
      theme={{
        algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      }}
    >
      <AntdApp>
        <Router>
          <Layout className={styles.layout}>
            <Content className={styles.content}>
              <Routes>
                <Route path="/" element={<Navigate to="/ads" replace />} />
                <Route path="/ads" element={<HomePage />} />
                <Route path="/ads/:id" element={<ItemViewPage />} />
                <Route path="/ads/:id/edit" element={<ItemEditPage />} />
              </Routes>
            </Content>
          </Layout>
        </Router>
      </AntdApp>
    </ConfigProvider>
  );
};

const App: React.FC = () => (
  <ThemeProvider>
    <AppContent />
  </ThemeProvider>
);

export default App;

import React from 'react';
import { Button } from 'antd';
import { BulbOutlined, MoonOutlined } from '@ant-design/icons';
import { useTheme } from '../../theme/ThemeContext';
import styles from './ThemeToggle.module.css';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <Button
      type="default"
      onClick={toggleTheme}
      className={styles.button}
      icon={isDark ? <BulbOutlined /> : <MoonOutlined />}
    >
      {isDark ? 'Светлая тема' : 'Темная тема'}
    </Button>
  );
};

export default ThemeToggle;

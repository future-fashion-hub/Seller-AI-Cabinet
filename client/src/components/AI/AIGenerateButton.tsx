import React, { useState } from 'react';
import { Button, Popover, Space, Typography } from 'antd';
import { BulbOutlined, SyncOutlined } from '@ant-design/icons';
import { useTheme } from '../../theme/ThemeContext';

const { Text } = Typography;

export type AIGenState = 'idle' | 'loading' | 'success' | 'error';

interface AIGenerateButtonProps {
  idleText: string;
  loadingText: string;
  retryText: string;
  onGenerate: () => Promise<string>;
  onApply?: (result: string) => void;
  showApply: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const AIGenerateButton: React.FC<AIGenerateButtonProps> = ({
  idleText,
  loadingText,
  retryText,
  onGenerate,
  onApply,
  showApply,
  className,
  style,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [status, setStatus] = useState<AIGenState>('idle');
  const [result, setResult] = useState<string>('');
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleGenerate = async () => {
    setStatus('loading');
    setPopoverOpen(false);
    try {
      const res = await onGenerate();
      setResult(res);
      setStatus('success');
      setPopoverOpen(true);
    } catch {
      setStatus('error');
      setPopoverOpen(true);
    }
  };

  const handleClose = () => {
    setPopoverOpen(false);
  };

  const handleApply = () => {
    if (onApply) {
      onApply(result);
    }
    setPopoverOpen(false);
  };

  const popoverContent = () => {
    if (status === 'success') {
      return (
        <Space orientation="vertical" style={{ maxWidth: 400 }}>
          <Text strong>Ответ AI:</Text>
          <Text style={{ whiteSpace: 'pre-wrap' }}>{result}</Text>
          <Space style={{ marginTop: 8 }}>
            {showApply && (
              <Button type="primary" onClick={handleApply}>
                Применить
              </Button>
            )}
            <Button onClick={handleClose}>Закрыть</Button>
          </Space>
        </Space>
      );
    }

    if (status === 'error') {
      return (
        <Space orientation="vertical" style={{ maxWidth: 300 }}>
          <Text strong style={{ color: '#cf1322' }}>Произошла ошибка при запросе к AI</Text>
          <Text style={{ color: '#262626' }}>Попробуйте повторить запрос или закройте уведомление</Text>
          <Button style={{ marginTop: 8, backgroundColor: '#ffa39e', color: 'black', border: 'none' }} onClick={handleClose}>
            Закрыть
          </Button>
        </Space>
      );
    }

    return null;
  };

  const getButtonText = () => {
    if (status === 'loading') return loadingText;
    if (status === 'success' || status === 'error') return retryText;
    return idleText;
  };

  const getIcon = () => {
    if (status === 'loading') return <SyncOutlined spin />;
    if (status === 'success' || status === 'error') return <SyncOutlined />;
    return <BulbOutlined />;
  };

  return (
    <Popover
      content={popoverContent()}
      open={popoverOpen}
      onOpenChange={(open) => {
        if (!open) {
          setPopoverOpen(false);
        }
      }}
      trigger="click"
      placement="topLeft"
      styles={{
        container:
          status === 'error'
            ? { backgroundColor: '#fff1f0' }
            : undefined,
      }}
    >
      <Button
        type="default"
        onClick={handleGenerate}
        icon={getIcon()}
        className={className}
        style={{
          backgroundColor: isDark ? '#2b1d0e' : '#fff7e6',
          color: isDark ? '#d87a16' : '#d46b08',
          border: 'none',
          boxShadow: 'none',
          ...style,
        }}
      >
        {getButtonText()}
      </Button>
    </Popover>
  );
};

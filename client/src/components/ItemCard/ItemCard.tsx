import React from 'react';
import { Card, Typography } from 'antd';
import { PictureOutlined } from '@ant-design/icons';
import styles from './ItemCard.module.css';

const { Title, Text } = Typography;

interface ItemCardProps {
  id: string;
  title: string;
  price: number;
  categoryLabel: string;
  needsRevision: boolean;
  onClick: () => void;
  viewMode: 'grid' | 'list';
}

const ItemCard: React.FC<ItemCardProps> = ({ title, price, categoryLabel, needsRevision, onClick, viewMode }) => {
  if (viewMode === 'grid') {
    return (
      <Card 
        hoverable 
        onClick={onClick}
        className={styles.gridCard}
        cover={
          <div className={styles.gridCover}>
            <PictureOutlined className={styles.coverIcon} />
          </div>
        }
      >
        <div className={styles.gridCategoryWrap}>
          <span className={styles.categoryBadge}>
            {categoryLabel}
          </span>
        </div>
        <Title level={5} className={styles.gridTitle} ellipsis={{ rows: 1 }}>{title}</Title>
        <div className={styles.gridFooter}>
          <Text className={`${styles.gridPrice} ${needsRevision ? styles.gridPriceWithBadge : ''}`}>{price} ₽</Text>
          
          {needsRevision && (
            <div className={styles.revisionBadge}>
              <div className={styles.revisionDot} />
              Требует доработок
            </div>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card 
      hoverable 
      onClick={onClick}
      className={styles.listCard}
    >
      <div className={styles.listCover}>
        <PictureOutlined className={styles.coverIcon} />
      </div>
      <div className={styles.listContent}>
        <div className={styles.listCategoryWrap}>
          <span className={styles.categoryBadge}>
            {categoryLabel}
          </span>
        </div>
        <Title level={5} className={styles.listTitle} >{title}</Title>
        <Text className={styles.listPrice}>{price} ₽</Text>
        <div className={styles.listBadgeSlot}>
          {needsRevision && (
            <div className={styles.listRevisionBadge}>
              <div className={styles.revisionDot} />
              Требует доработок
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ItemCard;

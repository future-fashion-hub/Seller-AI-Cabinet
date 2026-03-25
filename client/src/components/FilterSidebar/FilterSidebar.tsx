import React, { useState } from 'react';
import { Card, Typography, Checkbox, Switch, Button } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import styles from './FilterSidebar.module.css';

const { Title, Text } = Typography;

interface FilterSidebarProps {
  categories: string[];
  setCategories: (cats: string[]) => void;
  needsRevision: boolean;
  setNeedsRevision: (val: boolean) => void;
  onReset: () => void;
  categoryOptions: { value: string; label: string }[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  setCategories,
  needsRevision,
  setNeedsRevision,
  onReset,
  categoryOptions,
}) => {
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const categoriesSectionId = 'filters-categories';

  const toggleCategories = () => {
    setIsCategoryOpen((prev) => !prev);
  };

  return (
    <>
      <Card className={styles.card}>
        <Title level={4} className={styles.title} style={{fontWeight: 500}}>Фильтры</Title>
      
        <div className={styles.categorySection}>
          <div 
            onClick={toggleCategories}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                toggleCategories();
              }
            }}
            role="button"
            tabIndex={0}
            aria-expanded={isCategoryOpen}
            aria-controls={categoriesSectionId}
            className={`${styles.categoryHeader} ${isCategoryOpen ? styles.categoryHeaderOpen : styles.categoryHeaderClosed}`}
          >
            <Text className={styles.categoryLabel}>Категория</Text>
            {isCategoryOpen ? <UpOutlined className={styles.categoryIcon} /> : <DownOutlined className={styles.categoryIcon} />}
          </div>
          
          {isCategoryOpen && (
            <div id={categoriesSectionId}>
              <Checkbox.Group 
                name="categories"
                className={styles.checkboxGroup}
                options={categoryOptions.map(opt => ({ ...opt, style: { fontSize: 16 } }))} 
                value={categories} 
                onChange={(vals) => setCategories(vals as string[])} 
              />
            </div>
          )}
        </div>
        
        <div className={styles.divider} />
        
        <div className={styles.revisionRow}>
          <Text className={styles.revisionLabel}>
            Только требующие доработок
          </Text>
          <Switch checked={needsRevision} onChange={setNeedsRevision} />
        </div>
      </Card>
      
      <Button 
        onClick={onReset} 
        block 
        size="large"
        className={styles.resetBtn}
      >
        Сбросить фильтры
      </Button>
    </>
  );
};

export default FilterSidebar;

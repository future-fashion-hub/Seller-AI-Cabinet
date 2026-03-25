import React from 'react';
import { Input, Button, Select } from 'antd';
import { SearchOutlined, AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  search: string;
  setSearch: (val: string) => void;
  viewMode: 'grid' | 'list';
  setViewMode: (val: 'grid' | 'list') => void;
  sortOption: string;
  setSortOption: (val: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  search,
  setSearch,
  viewMode,
  setViewMode,
  sortOption,
  setSortOption,
}) => {
  return (
    <div className={styles.wrapper}>
      <Input 
        id="ads-search"
        name="adsSearch"
        placeholder="Найти объявление...." 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        suffix={<SearchOutlined style={{ color: '#8c8c8c', fontSize: 16 }} />} 
        className={styles.searchInput}
      />
      <div className={styles.controls}>
        <div className={styles.viewToggle} role="group" aria-label="Режим отображения объявлений">
          <Button 
            type="text"
            aria-label="Сетка"
            aria-pressed={viewMode === 'grid'}
            className={`${styles.viewBtn} ${viewMode === 'grid' ? styles.viewBtnActive : styles.viewBtnInactive}`}
            icon={<AppstoreOutlined style={{ fontSize: 14 }} />} 
            onClick={() => setViewMode('grid')}
          />
          <Button 
            type="text"
            aria-label="Список"
            aria-pressed={viewMode === 'list'}
            className={`${styles.viewBtn} ${viewMode === 'list' ? styles.viewBtnActive : styles.viewBtnInactive}`}
            icon={<BarsOutlined style={{ fontSize: 14 }} />} 
            onClick={() => setViewMode('list')}
          />
        </div>

        <div className={styles.sortContainer}>
          <Select 
            id="ads-sort"
            value={sortOption} 
            onChange={setSortOption} 
            className={styles.sortSelect}
            variant="borderless"
            options={[
              { value: 'title:asc', label: 'По названию (А → Я)' },
              { value: 'title:desc', label: 'По названию (Я → А)' },
              { value: 'createdAt:desc', label: 'По новизне (сначала новые)' },
              { value: 'createdAt:asc', label: 'По новизне (сначала старые)' },
              { value: 'price:asc', label: 'По цене (сначала дешевле)' },
              { value: 'price:desc', label: 'По цене (сначала дороже)' },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;

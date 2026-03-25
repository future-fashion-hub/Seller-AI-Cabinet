import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchAds } from '../../store/adsSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { CATEGORY_OPTIONS } from '../../constants';
import { Layout, Typography, Pagination, Spin, Alert, Button } from 'antd';
import styles from './HomePage.module.css';
import { HOME_PAGE_LIMIT, useHomeFilters } from '../../hooks/useHomeFilters';

import ItemCard from '../../components/ItemCard/ItemCard';
import FilterSidebar from '../../components/FilterSidebar/FilterSidebar';
import SearchBar from '../../components/SearchBar/SearchBar';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { list, total, loading, error } = useAppSelector((state) => state.ads);

  const {
    page,
    search,
    categories,
    needsRevision,
    sortOption,
    isMobile,
    effectiveViewMode,
    updateSearch,
    updateCategories,
    updateNeedsRevision,
    updateSortOption,
    updateViewMode,
    updatePage,
    resetFilters,
    fetchParams,
  } = useHomeFilters(searchParams, setSearchParams);

  useEffect(() => {
    const request = dispatch(fetchAds(fetchParams));

    return () => {
      request.abort();
    };
  }, [dispatch, fetchParams]);

  const categoryOptions = CATEGORY_OPTIONS;

  return (
    <Layout className={styles.layoutTransparent}>
      <div className={styles.headerBlock}>
        <div className={styles.titleArea}>
          <Title level={2} className={styles.pageTitle} style={{margin: 0}}>Мои объявления</Title>
          <Text type="secondary" className={styles.totalCount}>{total} объявления</Text>
        </div>
        <ThemeToggle />
      </div>

      <SearchBar 
        search={search}
        setSearch={updateSearch}
        viewMode={effectiveViewMode}
        setViewMode={updateViewMode}
        sortOption={sortOption}
        setSortOption={updateSortOption}
      />

      <Layout className={styles.layoutTransparent}>
        <Sider width={isMobile ? '100%' : 280} theme="light" className={styles.sider}>
          <FilterSidebar categories={categories} setCategories={updateCategories} needsRevision={needsRevision} setNeedsRevision={updateNeedsRevision} onReset={resetFilters} categoryOptions={categoryOptions} />
        </Sider>

        <Content className={styles.content}>
          {loading ? (
            <div className={styles.spinner}><Spin size="large" /></div>
          ) : error ? (
            <div className={styles.errorState}>
              <Alert
                type="error"
                showIcon
                message="Не удалось загрузить объявления"
                description={error}
                action={
                  <Button size="small" onClick={() => dispatch(fetchAds(fetchParams))}>
                    Повторить
                  </Button>
                }
              />
            </div>
          ) : (
            <>
              {effectiveViewMode === 'grid' ? (
                <div className={styles.grid}>
                  {list.map(ad => (
                    <ItemCard 
                      key={ad.id}
                      id={ad.id}
                      title={ad.title}
                      price={ad.price}
                      categoryLabel={categoryOptions.find(c => c.value === ad.category)?.label || ad.category}
                      needsRevision={ad.needsRevision || false}
                      onClick={() => navigate(`/ads/${ad.id}`)}
                      viewMode={effectiveViewMode}
                    />
                  ))}
                </div>
              ) : (
                <div className={styles.listView}>
                  {list.map(ad => (
                    <ItemCard 
                      key={ad.id}
                      id={ad.id}
                      title={ad.title}
                      price={ad.price}
                      categoryLabel={categoryOptions.find(c => c.value === ad.category)?.label || ad.category}
                      needsRevision={ad.needsRevision || false}
                      onClick={() => navigate(`/ads/${ad.id}`)}
                      viewMode={effectiveViewMode}
                    />
                  ))}
                </div>
              )}
              
              {list.length === 0 && !loading && (
                <div className={styles.emptyState}>Объявлений не найдено</div>
              )}
              {total > 0 && (
                <div className={styles.paginationWrapper}>
                  <Pagination
                    current={page}
                    pageSize={HOME_PAGE_LIMIT}
                    total={total} 
                    onChange={updatePage}
                    showSizeChanger={false}
                  />
                </div>
              )}
            </>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default HomePage;

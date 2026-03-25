import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCurrentItem } from '../../hooks/useCurrentItem';
import { Typography, Button, Spin, Alert, Layout, Row, Col } from 'antd';
import { EditOutlined, PictureOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import styles from './ItemViewPage.module.css';
import { getMissingFields } from '../../utils/itemRevision';
import { getCharacteristicEntries } from '../../utils/itemPresentation';
import { RevisionAlert } from '../../components/RevisionAlert/RevisionAlert';

dayjs.locale('ru');

const { Title, Paragraph, Text } = Typography;

const ItemViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentItem, currentItemLoading, currentItemError } = useCurrentItem(id);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [id]);

  if (currentItemLoading || (!currentItem && !currentItemError)) {
    return <div className={styles.spinnerContainer}><Spin size="large" /></div>;
  }

  if (currentItemError || !currentItem) {
    return (
      <div className={styles.errorContainer}>
        <Alert type="error" title="Ошибка" description={currentItemError || 'Такого объявления не существует'} />
        <Button className={styles.backButton} onClick={() => navigate('/ads')}>Назад</Button>
      </div>
    );
  }

  const item = currentItem;
  const images = item.images ?? [];
  const safeSelectedImageIndex = Math.min(selectedImageIndex, Math.max(images.length - 1, 0));
  const selectedImage = images[safeSelectedImageIndex] ?? images[0];

  const missingFields = getMissingFields(item);
  const characteristicEntries = getCharacteristicEntries(item);
  
  return (
    <Layout className={styles.pageLayout}>
      <Row justify="space-between" align="bottom" className={styles.headerRow}>
        <Col>
          <div className={styles.titleCol}>
            <Title level={2} className={styles.title} style={{margin: 0}}>{item.title}</Title>
            <Button 
              type="primary" 
              onClick={() => navigate(`/ads/${id}/edit`)}
              className={styles.editBtn}
            >
              Редактировать
              <EditOutlined />
            </Button>
          </div>
        </Col>
        <Col className={styles.metaCol}>
          <Text className={styles.priceText} style={{margin: 0}}>
            {item.price} ₽
          </Text>
          <Text type="secondary" className={styles.dateText}>
            Опубликовано: {item.createdAt ? dayjs(item.createdAt).format('DD MMMM YYYY, HH:mm') : 'Нет даты'}
          </Text>
          {item.updatedAt && item.createdAt !== item.updatedAt && (
             <Text type="secondary" className={styles.dateText}>
               Отредактировано: {dayjs(item.updatedAt).format('DD MMMM YYYY, HH:mm')}
             </Text>
          )}
        </Col>
      </Row>

      <div className={styles.headerDivider} />

      <Row gutter={[32, 32]} className={styles.contentRow}>
        <Col xs={24} lg={10}>
          {images.length === 0 ? (
            <div className={styles.imagePlaceholder}>
               <PictureOutlined className={styles.placeholderIcon} />
            </div>
          ) : (
            <>
              <div className={styles.mainImageContainer}>
                 <img src={selectedImage} alt="Главное фото" className={styles.mainImage} />
              </div>
              {images.length > 1 && (
                <div className={styles.thumbnailRow}>
                  {images.map((src: string, idx: number) => (
                    <button
                      key={`${src}-${idx}`}
                      type="button"
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`${styles.thumbnail} ${safeSelectedImageIndex === idx ? styles.thumbnailActive : ''}`}
                      aria-label={`Показать фото ${idx + 1}`}
                    >
                      <img src={src} alt={`Фото ${idx + 1}`} className={styles.thumbnailImg} />
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          <div className={styles.descriptionSection}>
            <Title level={4} className={styles.descriptionTitle}>Описание</Title>
            <div className={styles.descriptionScroll}>
              <Paragraph className={styles.descriptionText}>
                {item.description ? item.description : <Text type="secondary" italic>Описание отсутствует</Text>}
              </Paragraph>
            </div>
          </div>
        </Col>
        
        <Col xs={24} lg={10}>
          {item.needsRevision && <RevisionAlert missingFields={missingFields} />}

          <div>
            <Title level={4} className={styles.characteristicsTitle}>Характеристики</Title>
            {characteristicEntries.length === 0 ? (
              <Text type="secondary" className={styles.emptyChars}>Характеристики не указаны</Text>
            ) : (
              <div className={styles.characteristicsList}>
                {characteristicEntries.map((entry) => (
                  <div key={entry.key} className={styles.characteristicRow}>
                    <Text type="secondary" className={styles.characteristicKey}>
                      {entry.label}
                    </Text>
                    <Text className={styles.characteristicValue}>
                      {entry.value}
                    </Text>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Col>

        <Col xs={0} lg={4} className={styles.emptyDesktopCol} />
      </Row>
    </Layout>
  );
};

export default ItemViewPage;

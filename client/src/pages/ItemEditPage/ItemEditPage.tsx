import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Input, InputNumber, Select, Button, Spin, Alert, Layout, Space, App as AntdApp } from 'antd';
import { ItemsAPI } from '../../services/api';
import type { ItemCategory, ItemUpdateIn } from '../../types';
import { AIDescriptionButton } from '../../components/AI/AIDescriptionButton';
import { AIPriceButton } from '../../components/AI/AIPriceButton';
import styles from './ItemEditPage.module.css';
import { useCurrentItem } from '../../hooks/useCurrentItem';
import { normalizeItemUpdatePayload } from '../../utils/itemUpdate';
import { isNonEmptyString, isRequiredRevisionParamMissing } from '../../utils/itemEditValidation';

const { Content } = Layout;
const { TextArea } = Input;

const ItemEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { message, notification } = AntdApp.useApp();

  const { currentItem, currentItemLoading, currentItemError } = useCurrentItem(id);
  const category = Form.useWatch('category', form);
  const title = Form.useWatch('title', form);
  const price = Form.useWatch('price', form);
  const params = Form.useWatch('params', form) as Record<string, unknown> | undefined;
  const description = Form.useWatch('description', form);
  const isDescriptionEmpty = !description || description.trim() === '';
  const draftRestoreShownRef = useRef(false);

  const draftKey = `draft_ad_${id}`;

  useEffect(() => {
    draftRestoreShownRef.current = false;
  }, [id]);

  useEffect(() => {
    if (currentItem) {
      const draft = localStorage.getItem(draftKey);
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          form.setFieldsValue(parsed);

          if (!draftRestoreShownRef.current) {
            message.open({
              key: `draft-restored-${id ?? 'unknown'}`,
              type: 'info',
              content: 'Восстановлен несохранённый черновик',
            });
            draftRestoreShownRef.current = true;
          }
        } catch {
          form.setFieldsValue(currentItem);
        }
      } else {
        form.setFieldsValue(currentItem);
      }
    }
  }, [currentItem, form, draftKey, message, id]);

  const onValuesChange = (_: unknown, allValues: Record<string, unknown>) => {
    localStorage.setItem(draftKey, JSON.stringify(allValues));
  };

  const onFinish = async (values: ItemUpdateIn) => {
    const payload = normalizeItemUpdatePayload(values);

    try {
      await ItemsAPI.updateItem(id!, payload);
      localStorage.removeItem(draftKey);
      message.open({
        key: `item-saved-${id ?? 'unknown'}`,
        type: 'success',
        content: 'Изменения сохранены',
      });
      navigate(`/ads/${id}`);
    } catch {
      notification.error({
        message: 'Ошибка сохранения',
        description:
          'При попытке сохранить изменения произошла ошибка. Попробуйте ещё раз или зайдите позже.',
        placement: 'topRight',
      });
    }
  };

  const currentCategoryRaw = category || currentItem?.category;
  const currentCategory: ItemCategory | undefined =
    currentCategoryRaw === 'auto' ||
    currentCategoryRaw === 'real_estate' ||
    currentCategoryRaw === 'electronics'
      ? currentCategoryRaw
      : undefined;

  const isRequiredFieldMissing = (key: string): boolean => {
    return isRequiredRevisionParamMissing(currentCategory, key, params);
  };

  const getRevisionFieldProps = (key: string) => {
    if (!isRequiredFieldMissing(key)) {
      return undefined;
    }

    return {
      validateStatus: 'warning' as const,
      className: styles.needsRevisionField,
    };
  };

  const isSaveDisabled =
    !currentCategory ||
    !isNonEmptyString(title) ||
    typeof price !== 'number' ||
    Number.isNaN(price);

  if (currentItemLoading || (!currentItem && !currentItemError)) {
    return <div className={styles.spinner}><Spin size="large" /></div>;
  }

  if (currentItemError) {
    return (
      <div style={{ padding: 24 }}>
        <Alert type="error" title="Ошибка" description={currentItemError} />
        <Button style={{ marginTop: 16 }} onClick={() => navigate('/ads')}>Назад</Button>
      </div>
    );
  }

  return (
    <Content>
      <h2 className={styles.pageTitle}>Редактирование объявления</h2>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={onValuesChange}
        className={styles.form}
      >
        <Form.Item 
          className={`${styles.sectionLabelItem} ${styles.categoryNoAsterisk}`}
          name="category" 
          label="Категория" 
          rules={[{ required: true, message: 'Категория должна быть выбрана' }]}
          validateTrigger="onBlur"
          style={{ marginBottom: 0 }}
        >
          <Select
            placeholder="Категория"
            options={[
              { value: 'auto', label: 'Авто' },
              { value: 'real_estate', label: 'Недвижимость' },
              { value: 'electronics', label: 'Электроника' },
            ]}
          />
        </Form.Item>

        <div className={styles.sectionDivider} />

        <Form.Item 
          className={styles.sectionLabelItem}
          name="title" 
          label="Название объявления" 
          rules={[
            { required: true, whitespace: true, message: 'Название должно быть заполнено' },
          ]}
          validateTrigger="onBlur"
          style={{ marginBottom: 0 }}
        >
          <Input allowClear autoComplete="organization-title" />
        </Form.Item>

        <div className={styles.sectionDivider} />

        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <Form.Item 
            className={styles.sectionLabelItem}
            name="price" 
            label="Цена" 
            rules={[{ required: true, message: 'Цена должна быть указана' }]}
            validateTrigger="onBlur"
            style={{ flex: 1, marginBottom: 0 }}
          >
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>
          <div style={{ paddingTop: 30 }}>
            <AIPriceButton form={form} onApplyPrice={(price) => form.setFieldsValue({ price })} />
          </div>
        </div>

        <div className={styles.sectionDivider} />

        <div className={styles.paramsBlock}>
          <h3 className={styles.paramsTitle}>Характеристики товара</h3>
          
          {currentCategory === 'auto' && (
            <>
              <Form.Item name={['params', 'brand']} label="Марка" {...getRevisionFieldProps('brand')}><Input allowClear autoComplete="organization" /></Form.Item>
              <Form.Item name={['params', 'model']} label="Модель" {...getRevisionFieldProps('model')}><Input allowClear /></Form.Item>
              <Form.Item name={['params', 'yearOfManufacture']} label="Год выпуска" {...getRevisionFieldProps('yearOfManufacture')}><InputNumber style={{width: '100%'}} /></Form.Item>
              <Form.Item name={['params', 'transmission']} label="Коробка передач" {...getRevisionFieldProps('transmission')}>
                <Select
                  placeholder="Коробка передач"
                  options={[
                    { value: 'automatic', label: 'Автомат' },
                    { value: 'manual', label: 'Механика' },
                  ]}
                />
              </Form.Item>
              <Form.Item name={['params', 'mileage']} label="Пробег (км)" {...getRevisionFieldProps('mileage')}><InputNumber style={{width: '100%'}} /></Form.Item>
              <Form.Item name={['params', 'enginePower']} label="Мощность двигателя (л.с.)" {...getRevisionFieldProps('enginePower')}><InputNumber style={{width: '100%'}} /></Form.Item>
            </>
          )}

          {currentCategory === 'real_estate' && (
            <>
              <Form.Item name={['params', 'type']} label="Тип недвижимости" {...getRevisionFieldProps('type')}>
                <Select
                  placeholder="Тип недвижимости"
                  options={[
                    { value: 'flat', label: 'Квартира' },
                    { value: 'house', label: 'Дом' },
                    { value: 'room', label: 'Комната' },
                  ]}
                />
              </Form.Item>
              <Form.Item name={['params', 'area']} label="Площадь (м²)" {...getRevisionFieldProps('area')}><InputNumber style={{width: '100%'}} /></Form.Item>
              <Form.Item name={['params', 'floor']} label="Этаж" {...getRevisionFieldProps('floor')}><InputNumber style={{width: '100%'}} /></Form.Item>
              <Form.Item name={['params', 'address']} label="Адрес" {...getRevisionFieldProps('address')}><Input allowClear autoComplete="street-address" /></Form.Item>
            </>
          )}

          {currentCategory === 'electronics' && (
            <>
              <Form.Item name={['params', 'type']} label="Тип электроники" {...getRevisionFieldProps('type')}>
                <Select
                  placeholder="Тип электроники"
                  options={[
                    { value: 'phone', label: 'Телефон' },
                    { value: 'laptop', label: 'Ноутбук' },
                    { value: 'misc', label: 'Прочее' },
                  ]}
                />
              </Form.Item>
              <Form.Item name={['params', 'brand']} label="Бренд" {...getRevisionFieldProps('brand')}><Input allowClear autoComplete="organization" /></Form.Item>
              <Form.Item name={['params', 'model']} label="Модель" {...getRevisionFieldProps('model')}><Input allowClear /></Form.Item>
              <Form.Item name={['params', 'condition']} label="Состояние" {...getRevisionFieldProps('condition')}>
                <Select
                  placeholder="Состояние"
                  options={[
                    { value: 'new', label: 'Новое' },
                    { value: 'used', label: 'Б/у' },
                  ]}
                />
              </Form.Item>
              <Form.Item name={['params', 'color']} label="Цвет" {...getRevisionFieldProps('color')}><Input allowClear /></Form.Item>
            </>
          )}
        </div>

        <div className={styles.sectionDivider} />

        <Form.Item className={styles.sectionLabelItem} label="Описание" htmlFor="item-description">
          <Form.Item name="description" noStyle>
            <TextArea id="item-description" name="description" rows={6} showCount maxLength={1000} placeholder="Подробное описание объявления" style={{ resize: 'none' }} autoComplete="on" allowClear />
          </Form.Item>
          <div style={{ marginTop: 8 }}>
            <AIDescriptionButton 
              form={form} 
              isDescriptionEmpty={isDescriptionEmpty} 
              onApplyDescription={(text) => form.setFieldsValue({ description: text })} 
            />
          </div>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" disabled={isSaveDisabled}>
              Сохранить
            </Button>
            <Button 
              onClick={() => {
                localStorage.removeItem(draftKey);
                navigate(`/ads/${id}`);
              }}
            >
              Отменить
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Content>
  );
};

export default ItemEditPage;

import { describe, expect, it } from '@jest/globals';
import { getMissingFields } from './itemRevision';
import type { ItemWithRevision } from '../types';

describe('getMissingFields', () => {
  it('returns missing description and required auto params', () => {
    const item: ItemWithRevision = {
      id: '1',
      category: 'auto',
      title: 'Car',
      price: 100000,
      description: '',
      params: {
        brand: 'BMW',
        transmission: 'automatic',
      },
      needsRevision: true,
    };

    expect(getMissingFields(item)).toEqual([
      'Описание',
      'Модель',
      'Год выпуска',
      'Пробег',
      'Мощность двигателя',
    ]);
  });

  it('returns empty array for fully completed electronics item', () => {
    const item: ItemWithRevision = {
      id: '2',
      category: 'electronics',
      title: 'Phone',
      price: 50000,
      description: 'Отличное состояние',
      params: {
        type: 'phone',
        brand: 'Apple',
        model: 'iPhone',
        condition: 'used',
        color: 'black',
      },
      needsRevision: false,
    };

    expect(getMissingFields(item)).toEqual([]);
  });
});

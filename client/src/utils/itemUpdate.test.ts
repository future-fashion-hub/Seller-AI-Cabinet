import { describe, expect, it } from '@jest/globals';
import { normalizeItemUpdatePayload } from './itemUpdate';
import type { ItemUpdateIn } from '../types';

describe('normalizeItemUpdatePayload', () => {
  it('removes empty params and converts numeric fields', () => {
    const values = {
      category: 'auto',
      title: 'Test',
      price: 123,
      params: {
        brand: 'BMW',
        model: '',
        mileage: '120000',
        yearOfManufacture: '2018',
        enginePower: null,
      },
    } as unknown as ItemUpdateIn;

    const result = normalizeItemUpdatePayload(values);

    expect(result.params).toEqual({
      brand: 'BMW',
      mileage: 120000,
      yearOfManufacture: 2018,
    });
  });

  it('does not mutate the input object', () => {
    const values = {
      category: 'real_estate',
      title: 'Flat',
      price: 1,
      params: {
        area: '45.5',
      },
    } as unknown as ItemUpdateIn;

    normalizeItemUpdatePayload(values);

    expect(values.params).toEqual({ area: '45.5' });
  });
});

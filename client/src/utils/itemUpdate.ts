import type { ItemUpdateIn } from '../types';

const NUMBER_PARAM_KEYS = new Set([
  'yearOfManufacture',
  'mileage',
  'enginePower',
  'area',
  'floor',
]);

export const normalizeItemUpdatePayload = (values: ItemUpdateIn): ItemUpdateIn => {
  const payload = JSON.parse(JSON.stringify(values)) as ItemUpdateIn;

  if (!payload.params) {
    return payload;
  }

  const params = payload.params as Record<string, unknown>;
  Object.keys(params).forEach((key) => {
    if (params[key] === '' || params[key] === null || params[key] === undefined) {
      delete params[key];
      return;
    }

    if (NUMBER_PARAM_KEYS.has(key)) {
      params[key] = Number(params[key]);
    }
  });

  return payload;
};

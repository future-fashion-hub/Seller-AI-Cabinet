import type { ItemCategory } from '../types';

const REQUIRED_PARAMS_BY_CATEGORY: Record<ItemCategory, string[]> = {
  auto: ['brand', 'model', 'yearOfManufacture', 'transmission', 'mileage', 'enginePower'],
  real_estate: ['type', 'address', 'area', 'floor'],
  electronics: ['type', 'brand', 'model', 'condition', 'color'],
};

export const isNonEmptyString = (value: unknown): boolean =>
  typeof value === 'string' && value.trim().length > 0;

const isPositiveNumber = (value: unknown): boolean =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;

const isPositiveInteger = (value: unknown): boolean =>
  typeof value === 'number' && Number.isInteger(value) && value > 0;

const isEnumValue = (value: unknown, allowedValues: readonly string[]): boolean =>
  typeof value === 'string' && allowedValues.includes(value);

export const isRevisionFieldValid = (key: string, value: unknown): boolean => {
  if (key === 'yearOfManufacture' || key === 'enginePower' || key === 'floor') {
    return isPositiveInteger(value);
  }

  if (key === 'mileage' || key === 'area') {
    return isPositiveNumber(value);
  }

  if (key === 'transmission') {
    return isEnumValue(value, ['automatic', 'manual']);
  }

  if (key === 'type') {
    return isEnumValue(value, ['flat', 'house', 'room', 'phone', 'laptop', 'misc']);
  }

  if (key === 'condition') {
    return isEnumValue(value, ['new', 'used']);
  }

  return isNonEmptyString(value);
};

export const isRequiredRevisionParamMissing = (
  category: ItemCategory | undefined,
  key: string,
  params: Record<string, unknown> | undefined,
): boolean => {
  if (!category) {
    return false;
  }

  const requiredParams = REQUIRED_PARAMS_BY_CATEGORY[category];
  if (!requiredParams.includes(key)) {
    return false;
  }

  return !isRevisionFieldValid(key, params?.[key]);
};

import type { ItemWithRevision } from '../types';

type RevisionRule = {
  label: string;
  isValid: boolean;
};

const isNonEmptyString = (value: unknown): boolean =>
  typeof value === 'string' && value.trim().length > 0;

const isPositiveNumber = (value: unknown): boolean =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;

const isPositiveInteger = (value: unknown): boolean =>
  typeof value === 'number' && Number.isInteger(value) && value > 0;

const isEnumValue = (value: unknown, allowedValues: readonly string[]): boolean =>
  typeof value === 'string' && allowedValues.includes(value);

const getCategoryRevisionRules = (item: ItemWithRevision): RevisionRule[] => {
  const params = (item.params || {}) as Record<string, unknown>;

  if (item.category === 'auto') {
    return [
      { label: 'Марка', isValid: isNonEmptyString(params.brand) },
      { label: 'Модель', isValid: isNonEmptyString(params.model) },
      { label: 'Год выпуска', isValid: isPositiveInteger(params.yearOfManufacture) },
      {
        label: 'Коробка передач',
        isValid: isEnumValue(params.transmission, ['automatic', 'manual']),
      },
      { label: 'Пробег', isValid: isPositiveNumber(params.mileage) },
      { label: 'Мощность двигателя', isValid: isPositiveInteger(params.enginePower) },
    ];
  }

  if (item.category === 'real_estate') {
    return [
      {
        label: 'Тип недвижимости',
        isValid: isEnumValue(params.type, ['flat', 'house', 'room']),
      },
      { label: 'Адрес', isValid: isNonEmptyString(params.address) },
      { label: 'Площадь', isValid: isPositiveNumber(params.area) },
      { label: 'Этаж', isValid: isPositiveInteger(params.floor) },
    ];
  }

  return [
    {
      label: 'Тип устройства',
      isValid: isEnumValue(params.type, ['phone', 'laptop', 'misc']),
    },
    { label: 'Бренд', isValid: isNonEmptyString(params.brand) },
    { label: 'Модель', isValid: isNonEmptyString(params.model) },
    { label: 'Состояние', isValid: isEnumValue(params.condition, ['new', 'used']) },
    { label: 'Цвет', isValid: isNonEmptyString(params.color) },
  ];
};

export const getMissingFields = (item: ItemWithRevision): string[] => {
  const missingFields: string[] = [];

  if (!isNonEmptyString(item.description)) {
    missingFields.push('Описание');
  }

  getCategoryRevisionRules(item).forEach((rule) => {
    if (!rule.isValid) {
      missingFields.push(rule.label);
    }
  });

  return missingFields;
};

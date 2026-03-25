import { PARAM_NAMES, PARAM_VALUES } from '../constants';
import type { ItemWithRevision } from '../types';

export type CharacteristicEntry = {
  key: string;
  label: string;
  value: string;
};

const PARAM_UNITS: Record<string, string> = {
  area: ' м²',
  mileage: ' км',
  enginePower: ' л.с.',
};

const toPresentationString = (key: string, value: unknown): string => {
  if (typeof value === 'string' && PARAM_VALUES[value]) {
    return `${PARAM_VALUES[value]}${PARAM_UNITS[key] ?? ''}`;
  }

  return `${String(value)}${PARAM_UNITS[key] ?? ''}`;
};

const getParamLabel = (item: ItemWithRevision, key: string): string => {
  if (item.category === 'auto' && key === 'brand') {
    return 'Марка';
  }

  return PARAM_NAMES[key] || key;
};

export const getCharacteristicEntries = (item: ItemWithRevision): CharacteristicEntry[] => {
  return Object.entries(item.params || {})
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => ({
      key,
      label: getParamLabel(item, key),
      value: toPresentationString(key, value),
    }));
};

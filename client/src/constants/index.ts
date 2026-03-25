export const CATEGORY_NAMES: Record<string, string> = {
  auto: 'Авто',
  real_estate: 'Недвижимость',
  electronics: 'Электроника',
};

export const CATEGORY_OPTIONS = [
  { value: 'auto', label: 'Авто' },
  { value: 'electronics', label: 'Электроника' },
  { value: 'real_estate', label: 'Недвижимость' },
];

export const PARAM_NAMES: Record<string, string> = {
  brand: 'Бренд',
  model: 'Модель',
  yearOfManufacture: 'Год выпуска',
  transmission: 'Коробка передач',
  mileage: 'Пробег',
  enginePower: 'Мощность двигателя',
  type: 'Тип',
  address: 'Адрес',
  area: 'Площадь',
  floor: 'Этаж',
  condition: 'Состояние',
  color: 'Цвет',
};

export const PARAM_VALUES: Record<string, string> = {
  automatic: 'Автомат',
  manual: 'Механика',
  new: 'Новое',
  used: 'Б/у',
  flat: 'Квартира',
  house: 'Дом',
  room: 'Комната',
  phone: 'Смартфон',
  laptop: 'Ноутбук',
  misc: 'Другое',
};

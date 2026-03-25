import type { ItemCategory } from '../types';

type FormValues = {
  title?: string;
  price?: number | null;
  category?: ItemCategory;
  params?: Record<string, unknown>;
};

const fallback = (value: unknown, emptyValue = 'Не указано'): string => {
  if (value === undefined || value === null || value === '') {
    return emptyValue;
  }

  return String(value);
};

export const buildDescriptionPrompt = (values: FormValues): string => {
  let prompt =
    'Сгенерируй только текст описания для объявления о продаже. Без лишних слов, без кавычек и без вступлений. Напиши грамотно и привлекательно. Отвечай строго на русском языке.\n\n';

  prompt += `Название: ${fallback(values.title)}\n`;
  prompt += `Цена: ${values.price ? `${values.price} руб.` : 'Не указана'}\n`;

  if (values.category === 'auto') {
    prompt += `Марка: ${fallback(values.params?.brand, '')}, Модель: ${fallback(values.params?.model, '')}, Год: ${fallback(values.params?.yearOfManufacture, '')}\n`;
  } else if (values.category === 'real_estate') {
    prompt += `Тип: ${fallback(values.params?.type, '')}, Площадь: ${fallback(values.params?.area, '')} м2\n`;
  } else if (values.category === 'electronics') {
    prompt += `Бренд: ${fallback(values.params?.brand, '')}, Модель: ${fallback(values.params?.model, '')}, Состояние: ${fallback(values.params?.condition, '')}\n`;
  }

  return prompt;
};

export const buildPricePrompt = (values: FormValues): string => {
  let prompt =
    'Оцени рыночную стоимость данного товара в рублях. Укажи примерный диапазон цен. Форматируй ответ краткими пунктами (маркированный список) и укажи причину (состояние, год и т.д.). Пиши цены только целыми числами в рублях, без пробелов, точек и запятых внутри числа. Без длинных вступлений. Отвечай строго на русском языке.\n\n';

  prompt += `Название: ${fallback(values.title)}\n`;

  if (values.category === 'auto') {
    prompt += `Марка: ${fallback(values.params?.brand, '')}, Модель: ${fallback(values.params?.model, '')}, Год: ${fallback(values.params?.yearOfManufacture, '')}\n`;
  } else if (values.category === 'real_estate') {
    prompt += `Тип: ${fallback(values.params?.type, '')}, Площадь: ${fallback(values.params?.area, '')} м2, Этаж: ${fallback(values.params?.floor, '')}\n`;
  } else if (values.category === 'electronics') {
    prompt += `Бренд: ${fallback(values.params?.brand, '')}, Модель: ${fallback(values.params?.model, '')}, Состояние: ${fallback(values.params?.condition, '')}\n`;
  }

  return prompt;
};

export const parsePriceFromAIResponse = (result: string): number | null => {
  const matches = result.match(/\d[\d\s.,]*\d|\d/g);
  if (!matches || matches.length === 0) {
    return null;
  }

  const parsed = parseInt(matches[0].replace(/[\s.,]/g, ''), 10);
  return Number.isNaN(parsed) ? null : parsed;
};

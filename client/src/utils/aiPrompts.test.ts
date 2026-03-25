import { describe, expect, it } from '@jest/globals';
import { parsePriceFromAIResponse } from './aiPrompts';

describe('parsePriceFromAIResponse', () => {
  it('parses the first numeric price with spaces', () => {
    const result = parsePriceFromAIResponse('Рыночный диапазон: 120 000 - 150 000 руб.');
    expect(result).toBe(120000);
  });

  it('returns null when no numbers are present', () => {
    const result = parsePriceFromAIResponse('Цена не определена');
    expect(result).toBeNull();
  });
});

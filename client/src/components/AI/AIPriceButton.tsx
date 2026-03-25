import React from 'react';
import { AIGenerateButton } from './AIGenerateButton';
import { AIAPI } from '../../services/ai';
import type { FormInstance } from 'antd';
import { buildPricePrompt, parsePriceFromAIResponse } from '../../utils/aiPrompts';

interface AIPriceButtonProps {
  form: FormInstance;
  onApplyPrice: (price: number) => void;
}

export const AIPriceButton: React.FC<AIPriceButtonProps> = ({ form, onApplyPrice }) => {
  const handleGenerate = async () => {
    const values = form.getFieldsValue(true);
    return await AIAPI.generateText(buildPricePrompt(values));
  };

  const handleApply = (result: string) => {
    const parsedPrice = parsePriceFromAIResponse(result);
    if (parsedPrice !== null) {
      onApplyPrice(parsedPrice);
    }
  };

  return (
    <AIGenerateButton
      idleText="Узнать рыночную цену"
      loadingText="Выполняется запрос"
      retryText="Повторить запрос"
      onGenerate={handleGenerate}
      onApply={handleApply}
      showApply={true}
    />
  );
};

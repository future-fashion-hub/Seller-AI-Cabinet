import React from 'react';
import { AIGenerateButton } from './AIGenerateButton';
import { AIAPI } from '../../services/ai';
import type { FormInstance } from 'antd';
import { buildDescriptionPrompt } from '../../utils/aiPrompts';

interface AIDescriptionButtonProps {
  form: FormInstance;
  isDescriptionEmpty: boolean;
  onApplyDescription: (text: string) => void;
}

export const AIDescriptionButton: React.FC<AIDescriptionButtonProps> = ({ form, isDescriptionEmpty, onApplyDescription }) => {
  const handleGenerate = async () => {
    const values = form.getFieldsValue(true);
    return await AIAPI.generateText(buildDescriptionPrompt(values));
  };

  return (
    <AIGenerateButton
      idleText={isDescriptionEmpty ? "Придумать описание" : "Улучшить описание"}
      loadingText="Выполняется запрос"
      retryText="Повторить запрос"
      onGenerate={handleGenerate}
      onApply={onApplyDescription}
      showApply={true}
    />
  );
};

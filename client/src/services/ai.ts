import axios from 'axios';

const OLLAMA_URL = 'http://localhost:11434/api/generate';

export const AIAPI = {
  generateText: async (prompt: string, model: string = 'llama3'): Promise<string> => {
    const response = await axios.post(OLLAMA_URL, {
      model,
      prompt,
      stream: false,
    });

    return response.data.response;
  },
};

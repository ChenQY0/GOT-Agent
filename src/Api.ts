import axios from 'axios';
import useSWR from 'swr'

const INFO_API_PATH = "https://caiyun-beta.openai.azure.com/openai/deployments/dall-e-3/images/generations?api-version=2023-12-01-preview ";
const DAVINCI_API_PATH = "https://caiyun-beta.openai.azure.com/openai/deployments/gpt-35-turbo/completions?api-version=2023-03-15-preview";
const CHATGPT_API_PATH = "https://caiyun-beta.openai.azure.com/openai/deployments/gpt-35-turbo/chat/completions?api-version=2023-03-15-preview"

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer 646304f830184ad4a53ee71182c149ff`,
    'api-key': '646304f830184ad4a53ee71182c149ff',
};

export interface GptMessage {
  content: string;
  role: 'assistant' | 'user' | 'system';
}


export const postChatGpt = async (messages: GptMessage[]) : Promise<string> => {
  const payload = {
    model: "gpt-3.5-turbo",
    messages
  };

  try {
    console.log(`SEND "${prompt}"`);
    const response = await axios.post(CHATGPT_API_PATH, payload, { headers });
    const textResponse = response.data.choices[0].message.content as string;
    return textResponse;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const postChat = async (prompt: string) => {
  if (!prompt) return '';
  const data = {
    prompt,
    max_tokens: 30,
    n: 1,
    temperature: 0.7,
  };

  try {
    console.log(`SEND "${prompt}"`);

    const response = await axios.post(DAVINCI_API_PATH, data, { headers });
    const textReponse = response.data.choices[0].text;
    return textReponse;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const useChat = (prompt: string) => {
  const cacheKey = [CHATGPT_API_PATH, prompt];
  const { data, error, isLoading } = useSWR(cacheKey, () => postChat(prompt))
  return {
    chatResponse: data,
    isLoading,
    isError: error
  }
}
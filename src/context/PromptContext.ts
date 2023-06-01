import { createContext, useContext } from 'react';
import { ChatCompletionRequestMessage } from 'openai/api';
import { Prompt } from '@/app/prompts';

interface PromptContext {
  prompts: Prompt[],
  handleChangePrompts: (userId: string, newPrompts: ChatCompletionRequestMessage[]) => void;
  backToAdmin :boolean;
  handleSetBackToAdmin: (status: boolean) => void;
}

export const PromptContext = createContext<PromptContext>({
  prompts: [],
  backToAdmin: false,
  handleChangePrompts: (userId: string, newPrompts: ChatCompletionRequestMessage[]) => { return; },
  handleSetBackToAdmin: (status: boolean) => { return; }
})

export const usePromptContext= () => useContext(PromptContext)
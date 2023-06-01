import { PromptContext } from '@/context/PromptContext';
import { PropsWithChildren, useState } from 'react';
import { ChatCompletionRequestMessage } from 'openai/api';
import { ALL_PROMPTS, Prompt } from '@/app/prompts';


const PromptContextProvider = ({children}: PropsWithChildren) => {
  const [prompts, setPrompts] = useState<Prompt[]>(ALL_PROMPTS)
  const [backToAdmin, setBackToAdmin] = useState<boolean>(false)

  const handleChangePrompts = (userId: string, newPrompts: ChatCompletionRequestMessage[]) => {
    const promptsAux = [...prompts];
    const userIndex = promptsAux.findIndex((prompt) => prompt.id === userId);
    promptsAux[userIndex].prompts = newPrompts;

    setPrompts(promptsAux);
  }

  const handleSetBackToAdmin = (status: boolean) => {
    setBackToAdmin(status);
  }

  return <PromptContext.Provider
    value={{
      prompts,
      backToAdmin,
      handleChangePrompts,
      handleSetBackToAdmin
    }}
  >
    {children}
  </PromptContext.Provider>
}

export default PromptContextProvider;
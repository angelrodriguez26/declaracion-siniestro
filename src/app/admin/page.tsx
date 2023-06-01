"use client";
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Container, Typography } from '@mui/material';
import JSONInput from 'react-json-editor-ajrm';
import locale    from 'react-json-editor-ajrm/locale/en';
import { ALL_PROMPTS } from '@/app/prompts';
import { useState } from 'react';
import { usePromptContext } from '@/context/PromptContext';
import { useRouter } from 'next/navigation';
import { ChatCompletionRequestMessage } from 'openai';

const Admin = () => {
  const [hasError, setHasError] = useState(false);
  const {prompts, handleChangePrompts, handleSetBackToAdmin} = usePromptContext();
  const router = useRouter();

  const handleOnClick = (userId: string) => {
    handleSetBackToAdmin(true);
    router.push(`/?userId=${userId}`)
  }

  return <Container sx={{pt: 5, px: 3}}>
    {prompts.map(prompt => (
      <Accordion sx={{backgroundColor: "#343434", mb: 3}} key={prompt.id}>
        <AccordionSummary
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>{prompt.userName}</Typography>
          <Button variant={'contained'}
                  disabled={hasError}
                  onClick={() => handleOnClick(prompt.id)}
                  sx={{
                    backgroundColor: '#00FF68',
                    color: 'black',
                    fontSize: '18px',
                    height: '46px',
                    width: 200,
                    borderRadius: '50px',
                    marginLeft: 1
                  }}>Try Prompt</Button>
        </AccordionSummary>
        <AccordionDetails>
          <JSONInput
            locale={locale}
            // @ts-ignore
            onChange={(value) => {
              if(value.error) {
                setHasError(true);
              } else {
                setHasError(false);
                handleChangePrompts(prompt.id, value.jsObject as ChatCompletionRequestMessage[])
              }
            }}
            height={"300px"}
            width={"100%"}
            placeholder={prompt.prompts}
          />
        </AccordionDetails>
      </Accordion>
    ))}
  </Container>
}

export default Admin;
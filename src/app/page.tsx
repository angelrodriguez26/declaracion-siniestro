"use client";
import "./page.module.css";
import { Configuration, CreateChatCompletionResponse, OpenAIApi } from "openai";
import { useEffect, useRef, useState } from "react";
import { AxiosResponse } from "axios";
import { ChatCompletionRequestMessage } from "openai/api";
import Image from "next/image";
import { Button, Grid, Skeleton } from "@mui/material";
import { usePromptContext } from '@/context/PromptContext';
import { useRouter } from 'next/navigation';
import { ALL_PROMPTS } from '@/app/prompts';


const Home = ({searchParams}: { searchParams: { [key: string]: string | string[] | undefined };}) => {
  const [text, setText] = useState<string>("");
  const [messages, setMessages] =
    useState<ChatCompletionRequestMessage[]>([]);
  const [displayedMessages, setDisplayedMessages] = useState<
    ChatCompletionRequestMessage[]
    >([]);
  const apiKey = process.env.NEXT_PUBLIC_GPT_API_KEY;
  const organizationId = process.env.NEXT_PUBLIC_GPT_ORGANIZATION_ID;
  const containerRef = useRef<HTMLInputElement>(null);
  const {prompts, backToAdmin} = usePromptContext();
  const router = useRouter();

  useEffect(() => {
    const userPrompts = prompts.find(prompt => prompt.id === (searchParams.userId ?? "1"));
    const promptsToUse = userPrompts ??  ALL_PROMPTS[0];
    setMessages(promptsToUse.prompts);
    setDisplayedMessages([promptsToUse.prompts[promptsToUse.prompts.length - 1]]);
  }, [])

  useEffect(() => {
    if (containerRef && containerRef.current) {
      const element = containerRef.current;
      element.scroll({
        top: element.scrollHeight,
        left: 0,
        behavior: "smooth",
      });
    }
  }, [containerRef, displayedMessages]);

  const getOpenAi = () => {
    const configuration = new Configuration({
      apiKey: apiKey,
      organization: organizationId,
    });

    return new OpenAIApi(configuration);
  };

  const getCompletion = async () => {
    const newUserMessage: ChatCompletionRequestMessage = {
      content: text,
      role: "user",
    };
    const messagesAux = [...messages, newUserMessage];
    setDisplayedMessages((prev) => [
      ...prev,
      newUserMessage,
      { content: "loading...", role: "user" },
    ]);

    setText("");
    const openAi = getOpenAi();
    const completion = (await openAi.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messagesAux,
    })) as AxiosResponse<CreateChatCompletionResponse>;

    const newGptMessage = completion.data.choices[0].message;

    setMessages([...messagesAux!, newGptMessage!]);
    setDisplayedMessages((prev) => [...prev.slice(0, -1), newGptMessage!]);
  };

  return (
    <>
      <Image
        src={"/bg-2.svg"}
        fill={true}
        objectFit="cover"
        quality={100}
        alt={"image"}
        style={{ marginTop: "1px" }}
      />
      <div style={{ position: "relative" }}>
        <div className={"avatar"}>
          <Image src={"/avatar.png"} width={177} height={280} alt={"image"} />
        </div>
        { backToAdmin && (
          <Button
            variant={"contained"}
            onClick={() => {
              router.back();
            }}
            sx={{
              backgroundColor: "#00FF68",
              color: "#343434",
              fontSize: "18px",
              height: "46px",
              borderRadius: "50px",
              marginLeft: 1,
            }}
          >
            Volver al admin
          </Button>
        )}
        <section ref={containerRef}>
          <Grid
            container
            columns={{ xs: 12 }}
            justifyContent="center"
            alignItems="center"

          >
            {displayedMessages.map((message, i) => {
              if (message.content == "loading...") {
                return (
                  <Grid item xs={11} key={i}>
                    <Skeleton
                      className={`chat-bot`}
                      sx={{ bgcolor: "#343434" }}
                      key={i + "-message"}
                      variant="rounded"
                      height={60}
                      style={{width: "91%"}}
                    />
                  </Grid>
                );
              }
              return (
                <Grid item xs={11} key={i}>
                  <p
                    className={`chat-${message.role === "user" ? "user" : "bot"}`}
                    key={i + "-message"}
                  >
                    {message.content}
                  </p>
                </Grid>
              );
            })}
          </Grid>
        </section>
      </div>
      <Grid container spacing={1} className="text-chat">
        <Grid item xs={9}>
          <input
            type="text"
            placeholder="Escribe aqui..."
            required
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            variant={"contained"}
            onClick={getCompletion}
            sx={{
              backgroundColor: "#00FF68",
              color: "#343434",
              fontSize: "18px",
              height: "46px",
              borderRadius: "50px",
              marginLeft: 1,
            }}
          >
            Enviar
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default Home;
"use client";
import Image from 'next/image'
import styles from './page.module.css'
import { Configuration, CreateChatCompletionResponse, OpenAIApi } from 'openai';
import { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';

const Home = () => {

  const [text, setText] = useState<string>('');
  const [completionText, setCompletionText] = useState<string>('');

  const getOpenAi = () => {
    const configuration = new Configuration({
      apiKey: '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'
    });

    return new OpenAIApi(configuration);
  }


  const getCompletion = async () => {
    const openAi = getOpenAi();

    // const completion = await openAi.createCompletion(
    //   {
    //     model: "text-davinci-003",
    //     prompt: text,
    //   }
    // );

    const completion = await openAi.createChatCompletion(
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {"role": "system", "content": "You are a helpful assistant."},
          {"role": "user", "content": "Who won the world series in 2020?"},
          {"role": "assistant", "content": "The Los Angeles Dodgers won the World Series in 2020."},
          {"role": "user", "content": "Where was it played?"}
        ]
      }
    ) as AxiosResponse<CreateChatCompletionResponse>;

    console.log(completion)

    setCompletionText(completion.data.choices[0].message.content);
  }

  return (
    <main>
      <div>fake gpt</div>

      <input onChange={(e) => { setText(e.target.value)}} value={text}/>
      <button onClick={getCompletion}>completar</button>
      <div>
        {completionText}
      </div>
    </main>



  )
}

export default Home
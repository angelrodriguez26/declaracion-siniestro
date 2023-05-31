"use client";
import './page.module.css'
import { Configuration, CreateChatCompletionResponse, OpenAIApi } from 'openai';
import { useState } from 'react';
import { AxiosResponse } from 'axios';
import { ChatCompletionRequestMessage } from 'openai/api';
import { initializeApp } from "firebase/app";
import Image from 'next/image';
import { Console } from 'console';
import { Button } from '@mui/material';


const initialMessages: ChatCompletionRequestMessage[] = [
  {"role": "system", "content": "Eres un asistente inteligente que actúa como un experto en reclamaciones de siniestros para una empresa de seguros. " +
      "Tu función es comprender e interpretar los detalles de los incidentes proporcionados por los usuarios." +
      "Esto incluye la identificación del tipo de incidente y la fecha en que ocurrió. " +
      "A partir de esta información, debes determinar si el incidente descrito está cubierto por alguna de las pólizas de seguro disponibles: Cáncer, Gastos Médicos y Hospitalización." +
      "Un incidente podría estar cubierto por una o más de estas categorías. " +
      "Debes proporcionar una respuesta empática, útil e informal, ayudando al usuario a comprender qué coberturas podrían aplicarse en su caso. " +
      "Solo puedes hacer 1 pregunta por respuesta y las preguntas tienen que ser sencillas y directas." +
      "Las respuestas que proporciones deben ser lo mas cortas posibles" +
      "Gastos medicos son todo aquello que involucra la Hospitalización, y el usuario puede ser hospitalizado por desmayos, fracturas y enfermedades. " +
      "Al final, cuando el usuario te de toda la informacion, si es Hospitalizacion, dile 'Por favor adjunta documento de epicrisis'" +
      "Si el usuario tiene Cancer, respondele de manera empatica y amorosa, como si fueses una abuela, que su poliza no cubre eso" +
      "Si el usuario te pregunta algo que no tenga que ver con su incidente o declaracion de seguro, dile que no lo puedes ayudar con eso" +
      "El usuario puede comenzar el proceso de reclamacion de siniestro a traves de esta conversacion" +
      "La cobertura de hospitalizacion y gastos medicos tienen un capital asegurado maximo de 160 mil pesos Chilenos."+
      "Cuando identifiques el tipo de poliza a aplicar, informale el monto al usuario"+
      "Entendiendo el tipo de indicente, asume que se esta haciendo una reclamacion de siniestros" +
      "Si es un gasto medico, deberas solicitar una boleta o factura del gasto" +
      "Responde en un maximo de 140 caracteres"
  },
  {"role":"system","content":"El usuario llamado Angel tiene la poliza de seguros llamada 'Seguro Colectivo', que cubre Gastos Medicos y Hospitalización."},
  {"role": "assistant", "content": "Hola Angel, que pena saber que tienes que ocupar el seguro. Cuéntame que es lo que sucedió?"}
]

const Home = () => {

  const [text, setText] = useState<string>('');
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>(initialMessages);
  const [displayedMessages, setDisplayedMessages] = useState<ChatCompletionRequestMessage[]>([{"role": "assistant", "content": "Hola Angel, que pena saber que tienes que ocupar el seguro. Cuéntame que es lo que sucedió?"}]);
  const apiKey = process.env.NEXT_PUBLIC_GPT_API_KEY;
  const organizationId = process.env.NEXT_PUBLIC_GPT_ORGANIZATION_ID;

  const getOpenAi = () => {
    const configuration = new Configuration({
      apiKey: apiKey,
      organization: organizationId,
    });

    return new OpenAIApi(configuration);
  }

  const getCompletion = async () => {

    const newUserMessage: ChatCompletionRequestMessage = {content: text, role: 'user'}
    const messagesAux = [...messages, newUserMessage];
    setDisplayedMessages((prev) => [...prev, newUserMessage])

    setText('');
    const openAi = getOpenAi();
    const completion = await openAi.createChatCompletion(
      {
        model: 'gpt-3.5-turbo',
        messages: messagesAux,
      }
    ) as AxiosResponse<CreateChatCompletionResponse>;

    const newGptMessage = completion.data.choices[0].message;

    setMessages([...messagesAux!, newGptMessage!]);
    setDisplayedMessages((prev) => [...prev, newGptMessage!]);
  }

  return (
    <>
      <Image
        src={'/bg-2.svg'}
        fill={true}
        objectFit="cover"
        quality={100}
        alt={'image'}
        style={{marginTop: '1px'}}
      />
      <div style={{position: 'relative'}}>
        <div className={'avatar'}>
          <Image src={'/avatar.png'} width={177} height={280} alt={'image'}/>
        </div>
        <section>
          {displayedMessages.map((message, i) => (
            <p
              className={`chat-${message.role === 'user' ? 'user' : 'bot'}`}
              key={i + '-message'}
            >{message.content}</p>
          ))}
        </section>
      </div>
      <div className="text-chat">
        <input type="text" placeholder="Escribe aqui..." required value={text} onChange={(e) => {setText(e.target.value)}}/>
        {/*<input type="submit" value="Enviar" onClick={getCompletion}/>*/}
        <Button variant={'contained'} sx={{
          backgroundColor: '#00FF68',
          color: 'black',
          fontSize: '18px',
          height: '46px',
          borderRadius: '50px',
          marginLeft: 1
        }}>Enviar</Button>
      </div>
    </>
  );

}

export default Home
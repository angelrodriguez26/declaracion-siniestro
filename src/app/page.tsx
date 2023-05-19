"use client";
import styles from './page.module.css'
import { Configuration, CreateChatCompletionResponse, OpenAIApi } from 'openai';
import { useState } from 'react';
import { AxiosResponse } from 'axios';
import { ChatCompletionRequestMessage } from 'openai/api';

const initialMessages: ChatCompletionRequestMessage[] = [
  {"role": "system", "content": "Eres un asistente inteligente que actúa como un experto en reclamaciones de siniestros para una empresa de seguros. " +
      "Tu función es comprender e interpretar los detalles de los incidentes proporcionados por los usuarios." +
      "Esto incluye la identificación del tipo de incidente y la fecha en que ocurrió. " +
      "A partir de esta información, debes determinar si el incidente descrito está cubierto por alguna de las pólizas de seguro disponibles: Cáncer, Gastos Médicos y Hospitalización." +
      "Un incidente podría estar cubierto por una o más de estas categorías. " +
      "Debes proporcionar una respuesta empática y útil, ayudando al usuario a comprender qué coberturas podrían aplicarse en su caso. " +
      "Solo puedes hacer 1 pregunta por respuesta y las preguntas tienen que ser sencillas y directas." +
      "El usuario llamado Angel tiene la poliza de seguros llamada 'ABC', que cubre Gastos Medicos y Hospitalización." +
      "Gastos medicos son todo aquello que involucra la Hospitalización, y el usuario puede ser hospitalizado por desmayos, fracturas y enfermedades. " +
      "Al final, cuando el usuario te de toda la informacion, si es Hospitalizacion, dile 'Por favor adjunta documento de epicrisis'" +
      "Si el usuario tiene Cancer, respondele de manera empatica y amorosa, como si fueses una abuela, que su poliza no cubre eso" +
      "Si el usuario te pregunta algo que no tenga que ver con su incidente o declaracion de seguro, dile que no lo puedes ayudar con eso"},
]

const Home = () => {

  const [text, setText] = useState<string>('');
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>(initialMessages);
  const [displayedMessages, setDisplayedMessages] = useState<ChatCompletionRequestMessage[]>([]);

  const getOpenAi = () => {
    const configuration = new Configuration({
      apiKey: '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',
      organization: "org-d6Cz2ergvmPzRrWLXsI0QFyu",
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

    setMessages([...messagesAux, newGptMessage]);
    setDisplayedMessages((prev) => [...prev, newGptMessage]);
  }

  return (
    <main>
      <div>fake gpt</div>
      <input onChange={(e) => { setText(e.target.value) }} value={text}/>
      <button onClick={getCompletion}>completar</button>
      <div>
        {displayedMessages.map((message, i) => (
          <div key={i + 'message'}>{message.content}</div>
        ))}
      </div>
    </main>
  )

//     <body>
//     <div className="avatar"></div>
//   <section>
//     <p className="chat-bot">Hola Angel, que pena saber que tienes que ocupar el seguro. Cuéntame que es lo que
//       sucedió?</p>
//     <p className="chat-user">Ayer andando en bici me cai y me rompi el brazo :(</p>
//     <p className="chat-bot">Uff que dolor, ya mira podemos utilizar tu cobertura de gastos medicos y
//       hospitalización. Para eso necesitamos algunos documentos</p>
//     <p className="chat-bot">Epicrisis firmada por tu medico</p>
//   </section>
//   <div className="text-chat">
//     {/*<input type="text" placeholder="Escribe aqui..." required>*/}
//     <input type="submit" value="Enviar" />
//   </div>
// </body>
}

export default Home
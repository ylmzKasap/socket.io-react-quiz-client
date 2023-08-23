import { Socket, io } from "socket.io-client";
import { AnswerTypes, WordTypes } from './components/types';
const isProduction = import.meta.env.MODE === 'production';

interface ISocket extends Socket {
  userID?: string;
  username?: string;
  hostedRoom?: {roomPin: number; questions: WordTypes[]; answers: AnswerTypes[]};
  joinedRoomID?: string;
}

const socket = io(isProduction ? 'https://socket-io-react-quiz-server.onrender.com' : window.location.pathname, 
  { autoConnect: false }) as ISocket;

if (!isProduction) {
  socket.onAny((event, ...args) => {
    console.log(event, args);
  });
}

export default socket;

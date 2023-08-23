import { Socket, io } from "socket.io-client";
import { AnswerTypes, WordTypes } from './components/types';

interface ISocket extends Socket {
  userID?: string;
  username?: string;
  hostedRoom?: {roomPin: number; questions: WordTypes[]; answers: AnswerTypes[]};
  joinedRoomID?: string;
}

const socket = io(window.location.pathname, { autoConnect: false }) as ISocket;

socket.onAny((event, ...args) => {
  console.log(event, args);
});

export default socket;

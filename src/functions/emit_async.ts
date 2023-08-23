import { RoomTypes } from '../components/types';
import socket from '../socket';

export function asyncEmit(eventName: string, data: string): Promise<AsyncEmitData> {
  return new Promise(function (resolve, reject) {
    socket.emit(eventName, data);
    socket.on(eventName, result => {
      socket.off(eventName);
      resolve(result);
    });
    setTimeout(reject, 1000);
  });
}

type AsyncEmitData = string | RoomTypes;
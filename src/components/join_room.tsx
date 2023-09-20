import { useEffect, useRef, useState } from 'react';
import { asyncEmit } from '../functions/emit_async';
import { AnswerTypes, RoomResponseTypes, WordTypes } from './types';
import socket from '../socket';
import { LiveAppActionTypes } from '../reducers/live_app_reducer';
import RoomPin from './room_pin';

const JoinRoom: React.FC<JoinRoomTypes> = ({setLiveApp}) => {
  const [roomPin, setRoomPin] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (roomPin.length !== 6) return;
    asyncEmit('join room', roomPin)
      .then((res: RoomResponseTypes | string) => {
        if (typeof res !== 'string') {
          const room = res as RoomResponseTypes;
          socket.joinedRoomID = room.room_id as string;
          setLiveApp({
            type: 'roomDetails', 
            value: {
              questions: JSON.parse(room.questions) as WordTypes[],
              answers: room.answers.map(a => JSON.parse(a)) as AnswerTypes[],
              roomPin: parseInt(room.room_pin),
              roundEnded: room.roundEnded === 'true',
              roundStarted: room.roundStarted === 'true'
              }, 
            userID: socket.userID as string, view: 'select-username'})
        } else {
          setLiveApp({type: 'roomError', value: res});
        }
      });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value && !value[value.length - 1].match(/\d/)) return;
    const trimmedValue = value.split(' ').join('');
    if (trimmedValue.length <= 6) {
      setRoomPin(trimmedValue);
    }
  }

  const handleBlur = () => {
    inputRef.current?.focus();
  }

  return (
    <div className="center-content" onMouseUp={handleBlur}>
      <form className="vertical-form" onSubmit={handleSubmit}>
        <input
          className="hidden-input"
          type="text"
          value={roomPin}
          onChange={handleChange}
          ref={inputRef}
        />
        <RoomPin pin={roomPin} description="Enter your PIN" />
        <button className={'medium green' + (roomPin.length !== 6 ? ' disabled' : '')} type="submit">
          Join
        </button>
      </form>
      <button className="exit-button" type="button" onClick={() => setLiveApp({type: 'view', value: ''})}>
        X
      </button>
    </div>
  );
};

interface JoinRoomTypes {
  setLiveApp: React.Dispatch<LiveAppActionTypes>;
}


export default JoinRoom;

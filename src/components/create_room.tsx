import { useEffect } from 'react';
import socket from '../socket';
import { words } from '../words';
import { AnswerTypes, UserTypes } from './types';
import { LiveAppActionTypes } from '../reducers/live_app_reducer';
import PlayerLister from './player_lister';
import RoomPin from './room_pin';

const CreateRoom: React.FC<CreateRoomTypes> = (
  {users, answers, roomPin, setLiveApp, roundStarted, roundEnded}) => {
  const handleDeleteRoom = () => {
    if (window.confirm('Are you sure about closing the room?')) {
      socket.emit('delete room');
      socket.joinedRoomID = undefined;
      setLiveApp({type: 'deleteRoomHost'});
    }
  };

  const handleStartRound = () => {
    if (roundEnded) {
      setLiveApp({type: 'restartRound'});
      socket.emit('restart round');
    } else if (!roundStarted) {
      setLiveApp({type: 'roundStarted', value: 'true'});
      socket.emit('round started');
    } else {
      if (window.confirm('End the current round?')) {
        setLiveApp({type: 'roundEnded', value: 'true'});
        socket.emit('round ended');
      }
    }
  }

  useEffect(() => {
    if (!roomPin) {
      socket.emit('create room', words);
    }

    socket.on('room created', roomPin => {
      setLiveApp({type: 'roomPin', value: roomPin});
    });

    socket.on('room error', error => {
      setLiveApp({type: 'roomError', value: error});
      setLiveApp({type: 'deleteRoomHost'});
    })

    return () => {
      socket.off('create room');
      socket.off('room created');
    }
  }, []);

  return (
    <div className="center-content column">
      {!roundEnded && <RoomPin pin={`${roomPin}`} description="Room PIN" />}
      <button 
        className={'medium' 
          + (roundEnded ? ' green ' : roundStarted ? ' red' : ' blue')
          + (roundEnded ? ' margin-top' : '')}
        type="button"
        onClick={handleStartRound}
        style={{order: roundEnded ? 2 : undefined}}>
        {roundEnded ? 'Restart' : roundStarted ? 'End' : 'Start'} round
      </button>
      <div className={roundEnded ? ' margin-top' : ''} />
      <PlayerLister 
        headerDescription={roundEnded 
          ? 'Final Scores'
          : roundStarted 
          ? 'Players in the Game'
          : 'Connected players' 
        }
        players={users}
        connectedOnly={!roundEnded}
        answers={roundStarted || roundEnded ? answers : undefined}
      />
      <button className="exit-button" type="button" onClick={handleDeleteRoom}>
        X
      </button>
    </div>
  );
};

interface CreateRoomTypes {
  roomPin: number;
  roundStarted: boolean;
  roundEnded: boolean;
  users: UserTypes[];
  answers: AnswerTypes[];
  setLiveApp: React.Dispatch<LiveAppActionTypes>;
}

export default CreateRoom;

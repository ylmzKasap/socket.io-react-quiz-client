import React, { useEffect, useReducer } from 'react';
import './App.css'
import socket from './socket';
import SelectUsername from './components/select_username';
import Questions from './components/questions';
import ViewSelector from './components/view_selector';
import JoinRoom from './components/join_room';
import CreateRoom from './components/create_room';
import { asyncEmit } from './functions/emit_async';
import { AnswerTypes, RoomTypes, UserTypes, WordTypes } from './components/types';
import { liveAppDefaults } from './defaults/live_app_default';
import { handleLiveApp } from './reducers/live_app_reducer';
import PlayerLister from './components/player_lister';
import WaitingLobby from './components/waiting_lobby';

const App: React.FC = () => {
  const [liveApp, setLiveApp] = useReducer(handleLiveApp, liveAppDefaults);

  useEffect(() => {
    const sessionID = localStorage.getItem("sessionID");

    if (sessionID) {
      socket.auth = { sessionID };
    }
    socket.connect();

    socket.on("session", ({ sessionID, userID, hostedRoom, joinedRoomID, username}) => {
      // attach the session ID to the next reconnection attempts
      socket.auth = { sessionID };
      // store it in the localStorage
      localStorage.setItem("sessionID", sessionID);
      // save the ID of the user
      socket.userID = userID;
      socket.joinedRoomID = joinedRoomID;
      if (hostedRoom) {
        setLiveApp({type: 'roomPin', value: hostedRoom.room_pin, view: 'create-room'});
      } else if (joinedRoomID) {
        if (username) {
          setLiveApp({type: 'view', value: 'question'});
        } else {
          setLiveApp({type: 'view', value: 'select-username'});
        }
      }
      setLiveApp({type: 'sessionFetched', value: 'true'});
    });

    socket.on('users', (users: UserTypes[], room?: RoomTypes) => {
      const hostID = room ? room.room_id : socket.joinedRoomID;
      const noHostUsers = users.filter(u => u.userID !== hostID);
      setLiveApp({type: 'setUsers', value: noHostUsers});
    });

    socket.on('user connected', (user: UserTypes) => {  
      if (user.userID !== socket.joinedRoomID) {
        setLiveApp({type: 'addUser', value: user});
      }
    });

    socket.on('user disconnected', (userID: string) => {
      if (userID !== socket.joinedRoomID) {
        setLiveApp({type: 'removeUser', value: userID});
      }
    });

    socket.on('update username', (updatedUser: UserTypes) => {
      setLiveApp({type: 'username', value: updatedUser});
    });

    socket.on('room details', (room: RoomTypes) => {
      setLiveApp({type: 'roomDetails', value: room, userID: socket.userID as string});
    });

    socket.on('answer', (answer: AnswerTypes) => {
      setLiveApp({type: 'addAnswer', value: answer});
    });

    socket.on('round started', () => {
      setLiveApp({type: 'roundStarted', value: 'true'});
    });

    socket.on('round ended', () => {
      setLiveApp({type: 'roundEnded', value: 'true'});
    });

    socket.on('restart round', () => {
      setLiveApp({type: 'restartRound'});
    })

    socket.on('room error', error => {
      if (error === 'Room was closed') {
        setLiveApp({type: 'deleteRoomGuest'});
        socket.joinedRoomID = undefined;
      }
      setLiveApp({type: 'roomError', value: error});
    });

    socket.on('connect_error', handleConnectError);
    return () => {
      socket.off('connect_error', handleConnectError);
      socket.off('users');
      socket.off('user connected');
      socket.off('user disconnected');
      socket.off('update username');
      socket.off('room details');
      socket.off('round started');
      socket.off('round ended');
      socket.off('restart round');
      socket.off('answer');
      socket.off('room error');
    };
  }, []);

  const handleConnectError = (err: { message: string }) => {
    if (err.message === 'invalid session id') {
      localStorage.removeItem("sessionID");
    }
    setLiveApp({type: 'connectError', value: err.message});
  };

  const handleUsername = (username: string) => {
    asyncEmit('create username', username)
    .then((res) => {
      if (res !== 'Username taken') {
        setLiveApp({type: 'view', value: 'question'});
      }
    });
  }

  const handleRoomLeave = () => {
    setLiveApp({type: 'deleteRoomGuest'});
    socket.emit('leave room');
    socket.joinedRoomID = undefined;
  }

  const { view, sessionFetched, connectError, users, roomPin,
     questions, unansweredQuestions, answers, roomError } = liveApp;

  return (
    <div id="app">
      {!sessionFetched ? <div className="center-content">
          <div className="big-header">Loading...</div>
        </div> 
       : connectError ? <div className="center-content">
          <div className="big-header red">{connectError}</div>
        </div> 
       : !view ? <ViewSelector onSelection={(val) => setLiveApp({type: 'view', value: val})} />
       : view === 'join-room' ? <JoinRoom setLiveApp={setLiveApp} /> 
       : view === 'create-room' ? <CreateRoom
          roundStarted={liveApp.roundStarted}
          roundEnded={liveApp.roundEnded}
          users={users}
          answers={answers}
          roomPin={roomPin}
          setLiveApp={setLiveApp}
          />
       : view === 'select-username' ? <SelectUsername handleSubmit={handleUsername} />
       : liveApp.roundEnded ? <div className="center-content column">
          <div className="margin-top"></div>
          <PlayerLister 
            headerDescription="Final Scores"
            players={users}
            answers={answers}
            handleRoomLeave={handleRoomLeave} />
        </div>
       : liveApp.roundStarted ? <Questions 
          users={users} 
          questions={questions} 
          unansweredQuestions={unansweredQuestions}
          answers={answers}
          handleRoomLeave={handleRoomLeave} />
        : <WaitingLobby users={users} handleRoomLeave={handleRoomLeave} />
      }
      {roomError ? <div className="room-error">{roomError}</div> : <></>}
    </div>
  );
};

export interface LiveAppTypes {
  view: string;
  roundStarted: boolean;
  roundEnded: boolean;
  sessionFetched: boolean;
  connectError: string;
  roomError: string;
  roomPin: number;
  users: UserTypes[],
  questions: WordTypes[],
  unansweredQuestions: WordTypes[],
  answers: AnswerTypes[]
}

export default App;

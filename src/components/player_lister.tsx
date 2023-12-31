import socket from '../socket';
import { AnswerTypes, UserTypes, UserTypesWithAnswers } from './types';

export const PlayerLister: React.FC<PlayerListerTypes> = (
  { headerDescription, players, answers, connectedOnly, handleRoomLeave }) => {

  const getPlayers = (players: UserTypes[], answers?: AnswerTypes[]): UserTypesWithAnswers[] => {
    let filteredPlayers = [] as UserTypes[];
    if (connectedOnly) {
      // Filter out players with no name while displaying them in the standings.
      filteredPlayers = players.filter(u => u.connected /* && (answers ? u.username : true) */);
    } else {
      filteredPlayers = [...players];
    }

    if (!answers) return filteredPlayers.map(player => ({...player, correct: 0, incorrect: 0}));

    if (connectedOnly) {
      return filteredPlayers.map(player => {
        let correct = 0; let incorrect = 0;
        const userAnswers = answers.filter(answer => answer.userID === player.userID);
        for (const answer of userAnswers) {
          if (answer.is_correct) correct += 1;
          else incorrect += 1;
        }
        return {
          ...player,
          correct: correct,
          incorrect: incorrect
      }})
    }

    const userAnswers: {
      [key: string]: {username: string; correct: number; incorrect: number; connected: boolean;}} = {};
      
    for (const answer of answers) {
      if (!userAnswers[answer.userID]) {
        const player = players.find(p => p.userID === answer.userID);
        userAnswers[answer.userID] = {
          username: answer.username,
          connected: player?.connected || false,
          correct: 0,
          incorrect: 0}

      }
      if (answer.is_correct) userAnswers[answer.userID].correct += 1;
      else if (!answer.is_correct) userAnswers[answer.userID].incorrect += 1;
    }
    
    return Object.entries(userAnswers).map(answer => ({...answer[1], userID: answer[0]}))
  }

  function sortUsers(users: UserTypesWithAnswers[], userID?: string) {
    return users.sort((a, b) => {
      if (userID) {
        if (a.userID === userID) return -1;
        if (b.userID === userID) return 1;
      }
      if (a.correct !== b.correct) {
        return b.correct - a.correct;
      } else if (a.incorrect !== b.incorrect) {
        return a.incorrect - b.incorrect;
      } else {
        const usernameA = a.username || "";
        const usernameB = b.username || ""; 
        return usernameA.localeCompare(usernameB);
      }
    });
  }

  const activePlayers = getPlayers(players, answers);
  return (
    <div className="connected-users">
      <div className="header">{headerDescription}</div>
        {sortUsers(activePlayers, answers ? undefined : socket.userID) // Get current player to top if not sorting based on answers
          .filter(player => {return connectedOnly 
            ? true
            : player.correct + player.incorrect !== 0 || player.connected})
          .map((player, i) => {
            const { correct, incorrect } = player;

            return <div className="connected-player" key={`player-${i}`}>
                <div className="player-number">{i + 1}</div>
                <div className={'player-name' + (!player.username ? ' italic' : '')}>
                  {player.username || 'Picking nickname...'}
                  {player.userID === socket.userID ? ' (you) ' : ''} 
                </div>
                {answers && <>
                  <div className="player-answer correct">{correct}</div>
                  <div className="player-answer incorrect">{incorrect}</div>
                </>}
              </div>;
          }
        )}
        {activePlayers.length === 0 
          ? <div className="connected-player">
            <div className="player-name italic">No one is here yet...</div>
            </div> 
          : <></>}
          
      {handleRoomLeave ? <button className="exit-button" type="button" onClick={handleRoomLeave}>
        X
      </button> : <></>}
    </div>
  );
};

interface PlayerListerTypes {
  headerDescription: string;
  players: UserTypes[];
  connectedOnly?: boolean;
  answers?: AnswerTypes[];
  handleRoomLeave?: () => void;
}

export default PlayerLister;

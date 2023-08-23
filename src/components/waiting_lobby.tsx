import PlayerLister from './player_lister';
import { UserTypes } from './types';

const WaitingLobby: React.FC<WaitingLobbyTypes> = ({users, handleRoomLeave}) => {
  return (
    <div className="center-content column">
      <div className="margin-top"></div>
      <div className="info-box">Waiting for the game to start...</div>
      <PlayerLister 
        headerDescription="Connected players"
        players={users}
        connectedOnly={true}
        handleRoomLeave={handleRoomLeave}
        />
    </div>
  );
};

interface WaitingLobbyTypes {
  users: UserTypes[];
  handleRoomLeave: () => void;
}

export default WaitingLobby;

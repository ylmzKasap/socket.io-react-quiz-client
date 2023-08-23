const ViewSelector: React.FC<ViewSelectorTypes> = ({ onSelection }) => {
  return (
    <div className="center-content">
      <div className="button-container">
        <button className="huge blue" type="button" onClick={() => onSelection('create-room')}>
          Create a room
        </button>
        <button className="huge green" type="button" onClick={() => onSelection('join-room')}>
          Join a room
        </button>
      </div>
    </div>
  );
};

interface ViewSelectorTypes {
  onSelection: (val: string) => void;
}

export default ViewSelector;

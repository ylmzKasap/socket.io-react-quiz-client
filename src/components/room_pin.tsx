const RoomPin: React.FC<{description: string; pin: string}> = ({pin, description}) => {

  const generateRoomPin = (pin: string) => {
    const completePin = pin.padEnd(6, '_').split('');
    return completePin.map((num, index) => 
      <div 
        className={`pin-number` + (index === 2 ? ' extra-spaced' : '')}
        key={`${index + 1}-pin`}
      >
        {num}
      </div>)
  }

  return (
    <div className="header-container margin-top">
      <div className="header-info">{description}</div>
        <div className="big-header green pin-number" >
          {generateRoomPin(pin)}
        </div>
    </div>
  );
};

export default RoomPin;

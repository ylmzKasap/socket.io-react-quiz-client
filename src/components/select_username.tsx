import React, { useState } from 'react';

interface SelectUsernameProps {
  handleSubmit: (username: string) => void;
}

const SelectUsername: React.FC<SelectUsernameProps> = ({ handleSubmit }) => {
  const [username, setUsername] = useState('');

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedName = username.trim();
    if (trimmedName.length < 3 || trimmedName.length > 30) return;
    handleSubmit(trimmedName);
  };

  return (
    <div className="center-content">
      <form className="vertical-form" onSubmit={onSubmit}>
        <div className="header-info">Enter your nickname</div>
        <input
          className="username-input"
          value={username}
          maxLength={30}
          minLength={3}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nickname"
          required={true}
        />
        <button className={'medium green' 
          + (username.trim().length < 3 || username.length > 30 ? ' disabled' : '')}>
          Join
        </button>
      </form>
    </div>
  );
};

export default SelectUsername;
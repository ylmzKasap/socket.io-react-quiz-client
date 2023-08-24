import { useState } from 'react';
import { AnswerTypes, UserTypes, WordTypes } from './types';
import socket from '../socket';
import PlayerLister from './player_lister';
import { shuffle } from '../functions/shuffle';
import { isProduction, serverUrl } from '../defaults/constants';


const Questions: React.FC<QuestionTypes> = ({users, questions, unansweredQuestions, answers, handleRoomLeave}) => {
  const [pageNumber, setPageNumber] = useState(0);

  const getOptions = (words: WordTypes[], pageNumber: number) => {
    const word = words[pageNumber];
    if (!word) return [];
    const shuffledQuestions = shuffle(questions);

    const options = [{...word, isCorrect: true}] as WordTypes[];
    for (let i=0; options.length < 4 || i > questions.length; i++) {
      const currentWord = shuffledQuestions[i];
      if (currentWord.question_id !== word.question_id
        && currentWord.target_translation !== word.target_translation) {
          options.push({...currentWord, isCorrect: false});
        }
    }
    return shuffle(options);
  }

  const handleOptionClick = (option: WordTypes) => {
    const word = unansweredQuestions[pageNumber];
    socket.emit('answer', word.question_id, option.question_id === word.question_id);
    setPageNumber(x => x + 1);
  }

  const word = unansweredQuestions[pageNumber];
  const answeredQuestions = questions.length - unansweredQuestions.length;
  const isDone = answeredQuestions + pageNumber >= questions.length;
  return (
    <div id="questions">
      <div className="question-container margin-top">
        {!isDone && <div className="info-box">{answeredQuestions + pageNumber + 1}/{questions.length}</div>}
        {!isDone ? <>
          <div className="image-container">
          <img src={word && (isProduction ? `${serverUrl}/` : '') + word.image_path} alt="question" />
        </div>
        <div className="option-container">
          {getOptions(unansweredQuestions, pageNumber).map((option, index) => 
          <div className="test-option"
            onClick={() => handleOptionClick(option)}
            key={`${option.target_translation}-${index}`}>
            {option.target_translation}
          </div>)}
        </div>
        </> 
        : <>
           <div className="info-box">Waiting for the game to end...</div>
           <PlayerLister 
            headerDescription="Live scoreboard"
            players={users}
            answers={answers}
           />
        </>}
        <button className="exit-button" type="button" onClick={handleRoomLeave}>
        X
      </button>
      </div>
    </div>
  );
};

interface QuestionTypes {
  users: UserTypes[];
  questions: WordTypes[];
  unansweredQuestions: WordTypes[];
  answers: AnswerTypes[];
  handleRoomLeave: () => void;
}

export default Questions;

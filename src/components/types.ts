export interface WordTypes {
  deck_id: string;
  word_order: number;
  image_path: string;
  sound_path: string;
  question_id: string;
  target_translation: string;
  source_translation: string;
  isCorrect: boolean;
}

export interface UserTypes {
  userID: string;
  username: string;
  connected: boolean;
}

export interface UserTypesWithAnswers extends UserTypes {
  correct: number;
  incorrect: number;
}

export interface AnswerTypes {
  userID: string;
  question_id: string;
  is_correct: boolean;
}

export interface RoomTypes {
  roomPin: number;
  questions: WordTypes[];
  answers: AnswerTypes[];
  roundStarted: boolean;
  roundEnded: boolean;
  room_id?: string;
}
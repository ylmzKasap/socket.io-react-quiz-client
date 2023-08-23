import { RoomTypes } from '../components/types';

export function getUnansweredQuestions(room: RoomTypes, userID: string) {
  const playerAnswers = room.answers.filter(a => a.userID === userID);
  const answeredQuestions = new Set(playerAnswers.map(a => a.question_id));
  return room.questions.filter(q => !answeredQuestions.has(q.question_id));
}
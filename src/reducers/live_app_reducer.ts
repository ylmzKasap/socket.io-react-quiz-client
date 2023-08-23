import { LiveAppTypes } from '../App';
import { AnswerTypes, RoomTypes, UserTypes } from '../components/types';
import { getUnansweredQuestions } from '../functions/get_unanswered_questions';
import { replaceFromArray } from '../functions/replace_from_array';

export const handleLiveApp = (
  state: LiveAppTypes,
  action: LiveAppActionTypes
): LiveAppTypes => {
  switch(action.type){
    case 'view': {
      return {
        ...state,
        view: action.value as string,
        roomError: ''
      }
    }

    case 'roomPin': {
      return {
        ...state,
        roomPin: action.value as number,
        view: action.view || state.view,
      }
    }

    case 'setUsers': {
      return {
        ...state,
        users: action.value as UserTypes[]
      }
    }

    case 'addUser': {
      const user = action.value as UserTypes;
      const existingUserIndex = state.users.findIndex(u => u.userID === user.userID);
      return {
        ...state,
        users: existingUserIndex >= 0
          ? replaceFromArray(state.users, existingUserIndex, 
            {...state.users[existingUserIndex], connected: true})
          : [...state.users, user]
      }
    }

    case 'removeUser': {
      const userID = action.value as string;
      const userIndex = state.users.findIndex(u => u.userID === userID);
      return {
        ...state,
        users: userIndex >= 0 
          ? replaceFromArray(state.users, userIndex, 
            {...state.users[userIndex], connected: false}) 
          : state.users
      }
    }

    case 'username': {
      const updatedUser = action.value as UserTypes;
      return {
        ...state,
        users: state.users.map(user => user.userID === updatedUser.userID
          ? {...user, username: updatedUser.username} : user)
      }
    }

    case 'roomDetails': {
      const room = action.value as RoomTypes;
      return {
        ...state,
        questions: room.questions,
        answers: room.answers,
        unansweredQuestions: getUnansweredQuestions(room, action.userID as string),
        roundStarted: room.roundStarted,
        roundEnded: room.roundEnded,
        view: action.view || state.view,
        roomError: ''
      }
    }

    case 'deleteRoomGuest': {
      return {
        ...state,
        view: '',
        roundStarted: false,
        roundEnded: false,
        users: [],
        questions: [],
        unansweredQuestions: [],
        answers: []
      }
    }

    case 'deleteRoomHost': {
      return {
        ...state,
        view: '',
        roundStarted: false,
        roundEnded: false,
        roomPin: 0,
        users: [],
        unansweredQuestions: [],
        answers: []
      }
    }

    case 'restartRound': {
      return {
        ...state,
        roundStarted: false,
        roundEnded: false,
        unansweredQuestions: state.questions,
        answers: []
      }
    }
    
    case 'addAnswer': {
      const answer = action.value as AnswerTypes;
      return {
        ...state,
        answers:  [...state.answers, answer]
      }
    }

    case 'sessionFetched': {
      return {
        ...state,
        sessionFetched: action.value === 'true'
      }
    }

    case 'roundStarted': {
      return {
        ...state,
        roundStarted: action.value === 'true'
      }
    }

    case 'roundEnded': {
      return {
        ...state,
        roundEnded: action.value === 'true'
      }
    }

    case 'connectError': {
      return {
        ...state,
        connectError: action.value as string,
        sessionFetched: true
      }
    }

    case 'roomError': {
      return {
        ...state,
        roomError: action.value as string
      }
    }

    default: {
      console.log(`Unknown action: ${action.type}`);
      return state;
    }
  }  
}

export interface LiveAppActionTypes {
  type: string; 
  value?: string | number | UserTypes | AnswerTypes 
  | UserTypes[] | RoomTypes; view?: string; userID?: string}
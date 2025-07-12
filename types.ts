
export enum GameState {
  WELCOME,
  CATEGORY_SELECTION,
  LOADING,
  MISSION_BRIEFING,
  GAME,
  ERROR,
}

export interface Question {
  question: string;
  choices: string[];
  correctChoiceIndex: number;
  feedback: string[];
}

export interface Scenario {
  imageB64: string;
  briefing: string;
  questionData: Question;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  promptDetail: string;
}
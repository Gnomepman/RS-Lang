type Word = {
  id: string;
  group: number;
  page: number;
  word: string;
  image: string;
  audio: string;
  audioMeaning: string;
  audioExample: string;
  textMeaning: string;
  textExample: string;
  transcription: string;
  wordTranslate: string;
  textMeaningTranslate: string;
  textExampleTranslate: string;
};

type User = {
  name: string;
  email?: string;
  password: string;
};

type SignInResponse = {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
  [key:string]:string
};

type WordAttributes = {
  difficulty: string;
  optional?: {};
};

const API_URL = "https://rs-lang-test.herokuapp.com";

export { API_URL, User, SignInResponse, WordAttributes };
export default Word;

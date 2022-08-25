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
  userWord?:{
    difficulty:string;
  }
};

type AggregatedWord = Omit<Word,"id"> & {_id?:string};

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

type SavedWords ={
  difficulty: string;
  id: string;
  wordId: string;
}

type Count ={
  count:number
}

type AggregatedWords = {
  "paginatedResults":AggregatedWord[],
  "totalCount":Count[]
}

const API_URL = "https://rs-lang-test.herokuapp.com";

export { API_URL, User, SignInResponse, WordAttributes, SavedWords,Count,AggregatedWords,AggregatedWord};
export default Word;

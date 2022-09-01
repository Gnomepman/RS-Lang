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
    difficulty:wordDifficulty;
    optional?: {
      learned?: boolean;
      progress?: wordProgress;
    };
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

// type WordAttributes = {
//   difficulty: string;
//   optional?: {};
// };

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

type miniGameStatisticsPerDay = {
  date: Date;
  number_of_new_words: number;
};

type miniGameStatistics = {
  percentage_of_correct_words: number;
  longest_streak: number;
  progress_by_days: miniGameStatisticsPerDay[];
};

type dayStatistics = {
  day: Date;
  new_words_per_day: number;
  learned_words_per_day: number;
  percentage_of_correct_answers_per_day: number;
};

type statisticsPerDay = {
  statistics_per_day: dayStatistics[];
};

type statistics = {
  learnedWords: number;
  optional?: {
    sprint?: miniGameStatistics;
    audio_call?: miniGameStatistics;
    words_statistics?: statisticsPerDay;
  };
};

type wordDifficulty = 'easy' | 'hard'//hard word cannot have 'true' on 'learned'
type wordProgress = 0 | 1 | 2 | 3; //How many times in a row word was guessed. One wrong answer resets to 0

type WordAttributes = {
  difficulty: wordDifficulty;
  optional?: {
    id?:string,
    learned?: boolean;
    progress?: wordProgress;
  };
};

const API_URL = "https://rs-lang-test.herokuapp.com";

export { API_URL, User, SignInResponse, WordAttributes, SavedWords,Count,AggregatedWords,AggregatedWord, 
  miniGameStatisticsPerDay, miniGameStatistics, statisticsPerDay, statistics, wordDifficulty, wordProgress};
export default Word;

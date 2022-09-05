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
  userWord?: {
    difficulty: wordDifficulty;
    optional?: {
      learned?: boolean;
      progress?: wordProgress;
    };
  };
};

type AggregatedWord = Omit<Word, "id"> & { _id?: string };

type User = {
  name: string;
  email?: string;
  password: string;
};

type RegisteredUser = {
  name: string;
  email: string;
  id: string;
};

type SignInResponse = {
  message: string;
  token: string;
  refreshToken: string;
  userId: string;
  name: string;
  [key: string]: string;
};

// type WordAttributes = {
//   difficulty: string;
//   optional?: {};
// };

type SavedWords = {
  difficulty: string;
  id: string;
  wordId: string;
};

type Count = {
  count: number;
};

type AggregatedWords = {
  paginatedResults: AggregatedWord[];
  totalCount: Count[];
};

type miniGameStatisticsPerSession = {
  date: Date;
  number_of_new_words: number;
};

type miniGameStatistics = {
  correct_guessed_words: number;
  wrong_guessed_words: number;
  longest_streak: number;
  progress_by_session: miniGameStatisticsPerSession[];
};

type sessionStatistics = {
  day: Date;
  new_words_per_session: number;
  learned_words_per_session: number;
  percentage_of_correct_answers_per_session: number;
};

type statisticsPerSession = {
  statistics_per_session: sessionStatistics[];
};

type statistics = {
  learnedWords: number;
  optional: {
    sprint?: miniGameStatistics;
    audio_call?: miniGameStatistics;
    words_statistics: statisticsPerSession;
  };
};

type wordDifficulty = "easy" | "hard"; //hard word cannot have 'true' on 'learned'
type wordProgress = 0 | 1 | 2 | 3; //How many times in a row word was guessed. One wrong answer resets to 0

type WordAttributes = {
  difficulty: wordDifficulty;
  optional?: {
    id: string;
    learned: boolean;
    progress: wordProgress;
  };
};

const API_URL = "https://rs-lang-test.herokuapp.com";

export {
  API_URL,
  User,
  SignInResponse,
  WordAttributes,
  SavedWords,
  Count,
  AggregatedWords,
  AggregatedWord,
  miniGameStatisticsPerSession,
  miniGameStatistics,
  statisticsPerSession,
  statistics,
  wordDifficulty,
  wordProgress,
  sessionStatistics,
  RegisteredUser,
};
export default Word;

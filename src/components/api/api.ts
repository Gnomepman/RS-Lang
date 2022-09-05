import { progressOfTheWord } from '../../pages/sprint_game/sprint_game';
import Word, {
  AggregatedWords,
  SavedWords,
  SignInResponse,
  statistics,
  User,
  WordAttributes,
  wordDifficulty,
  wordProgress,
  miniGameStatistics,
  miniGameStatisticsPerSession,
  statisticsPerSession,
  sessionStatistics,
  RegisteredUser
} from './types';

enum ApiLinks {
  Words = 'words',
  Users = 'users',
  SignIn = 'signin',
  Tokens = 'tokens',
  AggregatedWords = 'aggregatedWords',
  Filter = 'filter',
  WordPerPage = 'wordsPerPage',
  Statistics = 'statistics'
}

const TOKEN_EXPIRE_TIME = 4;
const MAX_WORDS_PER_PAGE = 20;

class Api {
  private apiUrl: string;

  constructor(url: string) {
    this.apiUrl = url;
  }

  // get array of words with needed page and group

  async getWords(page: number, group: number): Promise<Word[]> {
    const request = `${this.apiUrl}/${ApiLinks.Words}?page=${page - 1}&group=${
      group - 1
    }`;
    const response = await fetch(request);
    const data: Word[] = await response.json();
    return data;
  }
  
  async createUser(user: User): Promise<RegisteredUser | number> {
    const request = `${this.apiUrl}/${ApiLinks.Users}`;
    const response = await fetch(request, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    if (response.ok) {
      const data: RegisteredUser = await response.json();
      return data;
    }
    return response.status;
  }

  async signIn(user: User): Promise<SignInResponse | number> {
    const request = `${this.apiUrl}/${ApiLinks.SignIn}`;
    const response = await fetch(request, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    });
    if (response.ok) {
      const data: SignInResponse = await response.json();
      return data;
    }
    return response.status;
  }

  // add word to user's hard words
  async addToUserWords(
    wordId: string,
    options: WordAttributes,
  ): Promise<WordAttributes | number> {
    // check if token did'nt expire
    await this.checkToken();
    const user: SignInResponse = JSON.parse(
      localStorage.getItem('user') as string,
    );
    const request = `${this.apiUrl}/${ApiLinks.Users}/${user.userId}/${ApiLinks.Words}/${wordId}`;
    const response = await fetch(request, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });
    if (response.status === 417) {
      return response.status;
    }
    if (response.ok) {
      const data: WordAttributes = await response.json();
      return data;
    }
    return response.status;
  }

  async updateUserWord(
    wordId: string,
    options: WordAttributes,
  ): Promise<WordAttributes | number> {
    await this.checkToken();
    const user: SignInResponse = JSON.parse(
      localStorage.getItem('user') as string,
    );
    const request = `${this.apiUrl}/${ApiLinks.Users}/${user.userId}/${ApiLinks.Words}/${wordId}`;
    const response = await fetch(request, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${user.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(options),
    });
    if (response.ok) {
      const data: WordAttributes = await response.json();
      return data;
    }
    return response.status;
  }

  // refresh token
  async refreshToken() {
    const currentUser: SignInResponse = JSON.parse(
      localStorage.getItem('user') as string,
    );
    const request = `${this.apiUrl}/${ApiLinks.Users}/${currentUser.userId}/${ApiLinks.Tokens}`;

    const response = await fetch(request, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${currentUser.refreshToken}`,
        Accept: 'application/json',
      },
    });

    if (response.ok) {
      const tokens: Pick<SignInResponse, 'token' | 'refreshToken'> = await response.json();
      const user: SignInResponse = JSON.parse(
        localStorage.getItem('user') as string,
      );
      const currentTime = Date.now();
      user.created = currentTime.toString(10);
      user.token = tokens.token;
      user.refreshToken = tokens.refreshToken;
      const data = JSON.stringify(user);
      localStorage.setItem('user', data);
    }
    if (response.status === 401) {
      localStorage.removeItem('user');
      location.reload();
    }
  }

  // check if token expired, then get new, if refresh token expired - reload page to new log in
  private async checkToken() {
    const user: SignInResponse = JSON.parse(
      localStorage.getItem('user') as string,
    );
    const currentTime = Date.now();
    const creationTime = +user.created;
    const lifeTime = +((currentTime - creationTime) / 3600000).toFixed(1);

    if (lifeTime >= TOKEN_EXPIRE_TIME) {
      await this.refreshToken();
    }
  }

  // get all user's words
  //async getAllUserWords(): Promise<SavedWords[] | number> {
    async getAllUserWords(): Promise<WordAttributes[] | number> {
    await this.checkToken();
    const user:SignInResponse = JSON.parse(localStorage.getItem('user') as string);
    const request = `${this.apiUrl}/${ApiLinks.Users}/${user.userId}/${ApiLinks.Words}`;
    const response = await fetch(request, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.token}`,
        Accept: 'application/json',
      },
    });
    if (response.ok) {

      //const data: SavedWords[] = await response.json();
      const data: WordAttributes[] = await response.json();

      //const data: SavedWords[] = await response.json();
      //console.log("data",data);

      return data;
    }
    return response.status;
  }

  // get words with difficulty from page and group
  async getAggregatedWords(
    page: number,
    group: number,
    difficulty: wordDifficulty,
    learned:boolean | null,
    wordsPerPage = MAX_WORDS_PER_PAGE,
  ): Promise<AggregatedWords[] | number> {
    await this.checkToken();
    const user:SignInResponse = JSON.parse(localStorage.getItem('user') as string);
    let filter = page > 0
      ? {
        $and: [
          { page: page - 1 },
          { group: group - 1 },
          { 'userWord.difficulty': `${difficulty}` },
          { 'userWord.optional.learned': learned },
        ],
      }
      : {
        $and: [
          { group: group - 1 },
          { 'userWord.difficulty': `${difficulty}` },
          { 'userWord.optional.learned': learned },
        ],
      };

    if (learned === null){
      filter = page > 0
      ? {
        $and: [
          { page: page - 1 },
          { group: group - 1 },
          { 'userWord.difficulty': `${difficulty}` }
        ],
      }
      : {
        $and: [
          { group: group - 1 },
          { 'userWord.difficulty': `${difficulty}` },
        ],
      };
    }
    const string = JSON.stringify(filter);
    const request = `${this.apiUrl}/${ApiLinks.Users}/${user.userId}/${ApiLinks.AggregatedWords}?${ApiLinks.WordPerPage}=${wordsPerPage}&${ApiLinks.Filter}=${string}`;
    const response = await fetch(request, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.token}`,
        Accept: 'application/json',
      },
    });
    if (response.ok) {
      const data: AggregatedWords[] = await response.json();
      return data;
    }
    return response.status;
  }
  
  async deleteUserWord(wordId: string) {
    await this.checkToken();
    const user: SignInResponse = JSON.parse(
      localStorage.getItem('user') as string,
    );
    const request = `${this.apiUrl}/${ApiLinks.Users}/${user.userId}/${ApiLinks.Words}/${wordId}`;
    const response = await fetch(request, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${user.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return response.status;
  }


  async cleanUserWords(){
    let temp = await this.getAllUserWords() as any[];

    for (let i = 0; i < temp.length; ++i){
      await this.deleteUserWord(temp[i].wordId!)
    }
  }

  async getAllUserLearnedWords(): Promise<AggregatedWords[] | number> {
    await this.checkToken();
    const user:SignInResponse = JSON.parse(localStorage.getItem('user') as string);
    const filter =  {
        $and: [
          { 'userWord.difficulty': "easy" },
          { 'userWord.optional.learned': true },
        ]};
    const string = JSON.stringify(filter);
    const request = `${this.apiUrl}/${ApiLinks.Users}/${user.userId}/${ApiLinks.AggregatedWords}?${ApiLinks.WordPerPage}=6000&${ApiLinks.Filter}=${string}`;
    const response = await fetch(request, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.token}`,
        Accept: 'application/json',
      },
    });
    if (response.ok) {
      const data: AggregatedWords[] = await response.json();
      return data;
    }
    return response.status;
  } 


  async getUserStatistics(): Promise<statistics | number> {
    await this.checkToken();
    const user:SignInResponse = JSON.parse(localStorage.getItem('user') as string);
    const request = `${this.apiUrl}/${ApiLinks.Users}/${user.userId}/${ApiLinks.Statistics}`;
    const response = await fetch(request, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${user.token}`,
        Accept: 'application/json',
      },
    });
    if (response.ok) {
      const data: statistics = await response.json();
      return data;
    }
    return response.status;
  }


  async updateUserStatistics(
    statistics: statistics,
  ): Promise<statistics | number> {
    await this.checkToken();
    const user: SignInResponse = JSON.parse(
      localStorage.getItem('user') as string,
    );
    const request = `${this.apiUrl}/${ApiLinks.Users}/${user.userId}/${ApiLinks.Statistics}`;
    const response = await fetch(request, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${user.token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(statistics),
    });
    if (response.ok) {
      const data: statistics = await response.json();
      return data;
    }
    return response.status;
  }

  async saveProgressFromMinigame(game: 'sprint' | 'audio_call', progress: progressOfTheWord[], longest_streak: number,
  correctWords: Word[], wrongWords: Word[]){
    const user: SignInResponse = JSON.parse(localStorage.getItem('user') as string);
    const request = `${this.apiUrl}/${ApiLinks.Users}/${user.userId}/${ApiLinks.Words}/`
    let numberOfNewWords: number = 0;
    let learnedWords = 0;

    for (let i = 0; i < progress.length; ++i){
      let response = await fetch(request +  progress[i].word.id, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      });
      //if the word was NOT added earlier
      if (response.status === 404){
        numberOfNewWords += 1;
        const word: WordAttributes = {
          difficulty: 'easy',
          optional: {
            id: progress[i].word.id,
            learned: progress[i].count === 3 ? true : false,
            progress: progress[i].count
          }
        }
        if(word.optional?.learned){learnedWords++}
        this.addToUserWords(progress[i].word.id, word)
        //if the word is already being tracked
      } else if (response.status === 200){
        let temp = await response.json() as WordAttributes;

        let newProgress: wordProgress = 0; 
        if ((progress[i].count < temp.optional?.progress!)&&(temp.optional?.progress != 3)){
          newProgress = temp.optional?.progress! + progress[i].count as wordProgress;
        } else {
          newProgress = progress[i].count;
        }

        if(newProgress >= 3){
          newProgress = 3;
        }

        let newDifficulty: wordDifficulty = 'hard';
        if (newProgress === 3){
          newDifficulty = 'easy';
        } else {
          newDifficulty = temp.difficulty!
        }

        let newLearned: boolean = false;
        if (newProgress === 3 ) {
          newLearned = true;
          learnedWords++;
        } else {
          newLearned = false;
        }

        if ((temp.optional?.learned)&&(temp.optional?.progress === 3)&&(progress[i].count < 3 )){
          newLearned = false;
          learnedWords -= 1;
        }

        const word: WordAttributes = {
          difficulty: newDifficulty,
          optional: {
            id: progress[i].word.id,
            learned: newLearned,
            progress: newProgress,
          }
        }
        this.updateUserWord(progress[i].word.id, word);
      }
    }
    //Start gathering statistics
    //if there is no statistics, we have to init it
    const previousStats = await this.getUserStatistics();
    if (typeof previousStats === 'number'){
      console.log("Initializing stats....");
      const miniGameStatisticsPerSession: miniGameStatisticsPerSession = {
        date: new Date(Date.now()),
        number_of_new_words: numberOfNewWords,
      }

      const miniGameStats: miniGameStatistics = {
        longest_streak: longest_streak,
        correct_guessed_words: correctWords.length,
        wrong_guessed_words: wrongWords.length,
        progress_by_session: [miniGameStatisticsPerSession],
      }

      const sessionStats: sessionStatistics = {
        day: new Date(Date.now()),
        new_words_per_session: numberOfNewWords,
        learned_words_per_session: learnedWords,
        percentage_of_correct_answers_per_session: correctWords.length / (correctWords.length + wrongWords.length) * 100,
      }

      const stats_per_session: statisticsPerSession = {
        statistics_per_session: [sessionStats],
      }

      const stats: statistics = {
      learnedWords: (await this.getAllUserLearnedWords() as AggregatedWords[])[0].paginatedResults.length,
        optional: {
          [game]: miniGameStats,
          words_statistics: stats_per_session,
        }
      }

      this.updateUserStatistics(stats)
    } else {
      console.log("Stats already exist, updating....");
      const { id, ...temp} = JSON.parse(JSON.stringify(previousStats));
      const newStats = (temp as statistics);
      newStats.learnedWords = (await this.getAllUserLearnedWords() as AggregatedWords[])[0].paginatedResults.length;
      if(!newStats.optional![game]!) {
        newStats.optional![game]! = {
          longest_streak: 0,
          correct_guessed_words: 0,
          wrong_guessed_words: 0,
          progress_by_session: [],
        }
      }
      newStats.optional![game]!.longest_streak! = longest_streak > newStats.optional![game]?.longest_streak! ? longest_streak : newStats.optional![game]?.longest_streak!;
      newStats.optional![game]!.correct_guessed_words! += correctWords.length;
      newStats.optional![game]!.wrong_guessed_words! += wrongWords.length;

      const miniGameStatisticsPerSession: miniGameStatisticsPerSession = {
        date: new Date(Date.now()),
        number_of_new_words: numberOfNewWords,
      }
      newStats.optional![game]!.progress_by_session.push(miniGameStatisticsPerSession)

      const sessionStats: sessionStatistics = {
        day: new Date(Date.now()),
        new_words_per_session: numberOfNewWords,
        learned_words_per_session: learnedWords,
        percentage_of_correct_answers_per_session: correctWords.length / (correctWords.length + wrongWords.length) * 100,
      }
      newStats.optional!.words_statistics.statistics_per_session.push(sessionStats);

      this.updateUserStatistics(newStats);
    }
    console.log("Finished saving progress")
  }

}

export default Api;

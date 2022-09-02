import Word, {
  AggregatedWords,
  SavedWords,
  SignInResponse,
  User,
  WordAttributes,
  wordDifficulty,
} from './types';

enum ApiLinks {
  Words = 'words',
  Users = 'users',
  SignIn = 'signin',
  Tokens = 'tokens',
  AggregatedWords = 'aggregatedWords',
  Filter = 'filter',
  WordPerPage = 'wordsPerPage',
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
  
  async createUser(user: User): Promise<User | number> {
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
      const data: User = await response.json();
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
    console.log('from refreshToken');
    if (response.ok) {
      const tokens: Pick<SignInResponse, 'token' | 'refreshToken'> = await response.json();
      console.log('from refreshToken tokens', tokens);
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
    console.log('lifeTime', lifeTime);
    if (lifeTime >= TOKEN_EXPIRE_TIME) {
      console.log(' call refreshToken');
      await this.refreshToken();
    }
  }

  // get all user's words
  async getAllUserWords(): Promise<SavedWords[] | number> {
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
      const data: SavedWords[] = await response.json();
      return data;
    }
    return response.status;
  }

  // get words with difficulty from page and group
  async getAggregatedWords(
    page: number,
    group: number,
    difficulty: wordDifficulty,
    learned:boolean,
    wordsPerPage = MAX_WORDS_PER_PAGE,
  ): Promise<AggregatedWords[] | number> {
    await this.checkToken();
    const user:SignInResponse = JSON.parse(localStorage.getItem('user') as string);
    const filter = page > 0
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

  async getAllUserAggregatedWords(): Promise<AggregatedWords[] | number> {
    await this.checkToken();
    const user:SignInResponse = JSON.parse(localStorage.getItem('user') as string);
    const filter =  {
        $or: [
          { 'userWord.difficulty': "hard" },
          { 'userWord.difficulty': "easy" },
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

}

export default Api;

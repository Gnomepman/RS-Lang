import Word, {
  AggregatedWords,
  SavedWords,
  SignInResponse,
  User,
  WordAttributes,
} from "./types";

enum ApiLinks {
  Words = "words",
  Users = "users",
  SignIn = "signin",
  Tokens = "tokens",
  AggregatedWords = "aggregatedWords",
  Filter = "filter",
}

const TOKEN_EXPIRE_TIME = 4;

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
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
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
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
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
    userId: string,
    wordId: string,
    token: string,
    options: WordAttributes
  ): Promise<WordAttributes | number> {
    // check if token did'nt expire
    await this.checkToken();
    const request = `${this.apiUrl}/${ApiLinks.Users}/${userId}/${ApiLinks.Words}/${wordId}`;
    const response = await fetch(request, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
    });
    if (response.ok) {
      const data: WordAttributes = await response.json();
      return data;
    }
    return response.status;
  }
  //refresh token
  async refreshToken(userId: string, refreshToken: string) {
    const request = `${this.apiUrl}/${ApiLinks.Users}/${userId}/${ApiLinks.Tokens}`;
    const response = await fetch(request, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${refreshToken}`,
        Accept: "application/json",
      },
    });
    if (response.ok) {
      const tokens: Pick<SignInResponse, "token" | "refreshToken"> =
        await response.json();
      const user: SignInResponse = JSON.parse(
        localStorage.getItem("user") as string
      );
      user.token = tokens.token;
      user.refreshToken = tokens.refreshToken;
      const data = JSON.stringify(user);
      localStorage.setItem("user", data);
    }
    if (response.status === 401) {
      localStorage.removeItem("user");
      location.reload();
    }
  }
  // check if token expired, then get new, if refresh token expired - reload page to new log in
  private async checkToken() {
    let user: SignInResponse = JSON.parse(
      localStorage.getItem("user") as string
    );
    const currentTime = Date.now();
    const creationTime = +user["created"];
    const lifeTime = +((currentTime - creationTime) / 3600000).toFixed(1);
    console.log("lifeTime", lifeTime);
    if (lifeTime >= TOKEN_EXPIRE_TIME) {
      await this.refreshToken(user.userId, user.refreshToken);
    }
  }
  // get all user's words
  async getAllUserWords(
    userId: string,
    token: string
  ): Promise<SavedWords[] | number> {
    await this.checkToken();
    const request = `${this.apiUrl}/${ApiLinks.Users}/${userId}/${ApiLinks.Words}`;
    const response = await fetch(request, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    if (response.ok) {
      const data: SavedWords[] = await response.json();
      return data;
    }
    return response.status;
  }

  async getAggregatedWords(
    userId: string,
    token: string,
    page: number,
    group: number,
    difficulty: string
  ):Promise<AggregatedWords[] | number> {
    await this.checkToken();
    const filter = {
      $and: [
        { page: page - 1},
        { group: group - 1},
        { "userWord.difficulty": `${difficulty}` },
      ],
    };
    const string = JSON.stringify(filter);
    const request = `${this.apiUrl}/${ApiLinks.Users}/${userId}/${ApiLinks.AggregatedWords}?${ApiLinks.Filter}=${string}`;
    const response = await fetch(request, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });
    if (response.ok) {
      const data:AggregatedWords[] = await response.json();
      return data;
    }
    return response.status;
  }
}

export default Api;

import Word, { SignInResponse, User, WordAttributes } from "./types";

enum ApiLinks {
  Words = "words",
  User = "users",
  SignIn = "signin",
}

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
    const request = `${this.apiUrl}/${ApiLinks.User}`;
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

  async addToHardWordsOfUser(
    userId: string,
    wordId: string,
    token: string,
    options: WordAttributes
  ): Promise<WordAttributes | number> {
    const request = `${this.apiUrl}/${ApiLinks.User}/${userId}/${ApiLinks.Words}/${wordId}`;
    const response = await fetch(request, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json",
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
}

export default Api;

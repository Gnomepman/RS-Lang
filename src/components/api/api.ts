import Word from "./types";

enum ApiLinks{
  Words = 'words'
}

class Api{
  private apiUrl:string;

  constructor(url:string){
    this.apiUrl = url;
  }

  // get array of words with needed page and group

  async getWords(page:number,group:number):Promise<Word[]>{
    const request = `${this.apiUrl}/${ApiLinks.Words}?page=${page - 1}&group=${group - 1}`;
    const response = await fetch(request);
    const data:Word[] = await response.json();
    return data;
  }

}

export default Api;
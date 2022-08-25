import Page from "../../components/templates/page";
import Api from "../../components/api/api";
import Word, { AggregatedWord, AggregatedWords, API_URL, SignInResponse } from "../../components/api/types";
import WordCard from "../../components/word-card/word-card";
import { createElement } from "../../components/utils/utils";

class HardWordsPage extends Page{
  constructor(id: string) {
    super(id);
  }

  static CopyAggrWordToWord(aggrWord:AggregatedWord):Word{
    let oldAggregatedWord:AggregatedWord={} as AggregatedWord;
    let newWord:Word = {} as Word;
    Object.assign(oldAggregatedWord,aggrWord);
    const tempId = oldAggregatedWord._id;
    delete oldAggregatedWord._id;
    Object.assign(newWord,oldAggregatedWord);
    newWord.id = tempId as string;
    return newWord
  }

  async renderHardWords(){
    const api = new Api(API_URL);
    const user: SignInResponse = JSON.parse(localStorage.getItem("user") as string);
    console.log("user",user);
    const hardWords:AggregatedWords[] | number = await api.getAggregatedWords( -1,1,"hard",600);
    const div = createElement("div","learning learning_hard-words");
    if (Array.isArray(hardWords)){
      hardWords[0].paginatedResults.forEach((word)=>{
        const newWord = new WordCard("div","learning__word-card learning__card-word_hard-words",HardWordsPage.CopyAggrWordToWord(word),"js-added","");
        div.append(newWord.render());
      })
    }
    return div;
  }

  render(): HTMLElement {
    this.renderHardWords().then((r)=>this.container.insertAdjacentElement("afterbegin",r))
    return this.container;
  }
}

export default HardWordsPage;
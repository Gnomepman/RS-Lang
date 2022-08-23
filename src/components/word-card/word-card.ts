import Word, { API_URL, SignInResponse, User, WordAttributes } from "../api/types";
import Component from "../templates/component";
import play_icon from "../../assets/play.svg";
import { createElement } from "../utils/utils";

import "./word-card.scss";
import Api from "../api/api";
class WordCard extends Component {
  private wordTemplate: Word;
  isAuthorized: boolean;
  constructor(tagName: string, className: string, word: Word) {
    super(tagName, className);
    this.wordTemplate = word;
    this.isAuthorized = false;
  }

  render() {
    const img = createElement("img", "learning__word-card-img");
    const spanWord = createElement("span", "learning__word-card-word");
    const div = createElement("div", "learning__word-card-container");
    const spanTranslate = createElement(
      "span",
      "learning__word-card-translate-word"
    );
    const spanTranscription = createElement(
      "span",
      "learning__word-card-transcription"
    );
    const buttonPlay = createElement("button", "learning__word-card-button-play") as HTMLButtonElement;
    const imgAudio = createElement("img", "learning__word-card-audio-img");
    const audio = createElement("audio", "learning__word-card-audio");
    const audioTranslate = createElement(
      "audio",
      "learning__word-card-audio-translate"
    );
    const audioMeaning = createElement(
      "audio",
      "learning__word-card-audio-meaning"
    );
    const divMeaning = createElement("div", "learning__word-card-meaning");
    const spanMeaning = createElement(
      "span",
      "learning__word-card-translate-example"
    );
    const spanMeaningEx = createElement(
      "span",
      "learning__word-card-translate-meaning"
    );
    const divTranslate = createElement("div", "learning__word-card-translate");
    const spanTranslateEx = createElement(
      "span",
      "learning__word-card-translate-example"
    );
    const spanTranslateM = createElement(
      "span",
      "learning__word-card-translate-meaning"
    );
    const divButtons = createElement("div", "learning__word-card-buttons");
    const buttonLearn = createElement(
      "button",
      "learning__word-card-button-learn"
    );
    const buttonAdd = createElement("button", "learning__word-card-button-add");

    this.container.id = `${this.wordTemplate.id}`;
    (img as HTMLImageElement).src = `${API_URL}/${this.wordTemplate.image}`;
    spanWord.textContent = `${this.wordTemplate.word}`;
    spanTranslate.textContent = `${this.wordTemplate.wordTranslate}`;
    spanTranscription.textContent = `${this.wordTemplate.transcription}`;
    (imgAudio as HTMLImageElement).src = `${play_icon}`;
    (audio as HTMLAudioElement).src = `${API_URL}/${this.wordTemplate.audio}`;
    (audioMeaning as HTMLAudioElement).src = `${API_URL}/${this.wordTemplate.audioMeaning}`;
    (audioTranslate as HTMLAudioElement).src = `${API_URL}/${this.wordTemplate.audioExample}`;
    spanMeaning.innerHTML = this.wordTemplate.textMeaning;
    spanMeaningEx.innerHTML = this.wordTemplate.textExample;
    spanTranslateEx.textContent = `${this.wordTemplate.textMeaningTranslate}`;
    spanTranslateM.textContent = `${this.wordTemplate.textExampleTranslate}`;

    buttonAdd.textContent = "Add to hard";
    buttonLearn.textContent = "Not studied";

    buttonAdd.onclick = async()=>{ 
      const api = new Api(API_URL);
      const user: SignInResponse = JSON.parse(
        localStorage.getItem("user") as string
      );
      console.log("userAddWord",user)
      if (!buttonAdd.classList.contains("js-added")){
        const response = await api.addToHardWordsOfUser(
          user.userId,
          this.container.id,
          user.token,
          { difficulty: "hard", optional: {} }
        );
        if (typeof response == "object"){
          buttonAdd.classList .add("js-added");
          buttonAdd.textContent = "Added";
          console.log("response",response);
          
        }
      } else {
        buttonAdd.classList.remove("js-added");
        buttonAdd.textContent = "Add to hard";
      }
    }

    buttonPlay.onclick = ()=>{
      buttonPlay.classList.add('js-clicked');
      (audio as HTMLAudioElement).play();
      buttonPlay.disabled = true;
    }
    audio.onended = ()=> (audioMeaning as HTMLAudioElement).play();
    audioMeaning.onended = ()=> (audioTranslate as HTMLAudioElement).play();
    audioTranslate.onended = () => {buttonPlay.disabled = false; buttonPlay.classList.remove('js-clicked');}
    buttonPlay.append(imgAudio);
    div.append(
      spanTranslate,
      spanTranscription,
      buttonPlay,
      audio,
      audioMeaning,
      audioTranslate
    );
    divMeaning.append(spanMeaning, spanMeaningEx);
    divTranslate.append(spanTranslateEx, spanTranslateM);
    if (localStorage.getItem("user")) divButtons.append(buttonLearn, buttonAdd);
    this.container.append(
      img,
      spanWord,
      div,
      divMeaning,
      divTranslate,
      divButtons
    );
    
    return this.container;
  }
}

export default WordCard;

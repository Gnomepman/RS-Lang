import Word, { API_URL, SignInResponse, User, WordAttributes } from "../api/types";
import Component from "../templates/component";
import play_icon from "../../assets/play.svg";
import { createElement } from "../utils/utils";

import "./word-card.scss";
import Api from "../api/api";
class WordCard extends Component {
  private wordTemplate: Word;
  private isAdded:string;
  private isLearned:string;
  constructor(tagName: string, className: string, word: Word, isAdded:string,isLearned:string) {
    super(tagName, className);
    this.wordTemplate = word;
    this.isAdded = isAdded;
    this.isLearned = isLearned;
  }
  //render word
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
    buttonLearn.textContent = "Not learned";
    // if word added to hard, add class
    if (this.isAdded){
      buttonAdd.classList.add("js-added");
      buttonAdd.textContent = "Added";
    }
    if (this.isLearned){
      buttonLearn.classList.add("js-learned");
      buttonLearn.textContent = "Learned";
    }
    const changeButton = (button:HTMLElement,className:string,text:string) =>{
      return {
        add(){
          button.classList.add(className);
          button.textContent = text;
        },
        remove(){
          button.classList.remove(className);
          button.textContent = text;
        }
      }
    }

    // add to hard words

    const addToWords = async (
      target: MouseEvent,
      classToAdd: string,
      text1: string,
      difficulty: string,
      classToRemove: string,
      text2: string,
      buttonToChange: HTMLElement
    ) => {
      const api = new Api(API_URL);
      const user: SignInResponse = JSON.parse(
        localStorage.getItem("user") as string
      );
      const button = target.currentTarget as HTMLButtonElement;
      if (!button.classList.contains(classToAdd)){
        const response = await api.addToUserWords(
          user.userId,
          this.container.id,
          user.token,
          { difficulty: difficulty, optional: {} }
        );
        if (typeof response == "object"){
          changeButton(button,classToAdd,text1).add();
        }
        if (response === 417){
          const response = await api.updateUserWord(user.userId,
            this.container.id,
            user.token,
            { difficulty: difficulty, optional: {} });
          if (typeof response == "object"){
            if (buttonToChange.classList.contains(classToRemove)){
              changeButton(buttonLearn,classToRemove,text2).remove();
            }
            changeButton(button,classToAdd,text1).add();
          }
        }
      }
    };

    buttonAdd.onclick = async (e) => {
      await addToWords(
        e,
        "js-added",
        "Added",
        "hard",
        "js-learned",
        "Not learned",
        buttonLearn
      );
    };
    
    buttonLearn.onclick = async(e)=>{
      await addToWords(
        e,
        "js-learned",
        "Learned",
        "learned",
        "js-added",
        "Add to hard",
        buttonAdd
      );
     }
    // {
    //   const api = new Api(API_URL);
    //   const user: SignInResponse = JSON.parse(
    //     localStorage.getItem("user") as string
    //   );
    //   if (!buttonLearn.classList.contains("js-learned")){
    //     const response = await api.addToUserWords(
    //       user.userId,
    //       this.container.id,
    //       user.token,
    //       { difficulty: "learned", optional: {} }
    //     );
    //     if (typeof response == "object"){
    //       changeButton(buttonLearn,"js-learned","Learned").add();
    //     }
    //     if (response === 417){
    //       const response = await api.updateUserWord(user.userId,
    //         this.container.id,
    //         user.token,
    //         { difficulty: "learned", optional: {} });
    //       if (typeof response == "object"){
    //         if (buttonAdd.classList.contains("js-added")){
    //           changeButton(buttonAdd,"js-added","Add to hard").remove();
    //         }
    //         changeButton(buttonLearn,"js-learned","Learned").add();
    //       }
    //     }
    //   }
    // }
    // play audio
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
    // check if user logged in
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

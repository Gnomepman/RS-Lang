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
    const changeButton = (button:HTMLElement,word: HTMLElement,className:string,text:string) =>{
      return {
        add(){
          button.classList.add(className);
          word.classList.add(className);
          button.textContent = text;
        },
        remove(){
          button.classList.remove(className);
          word.classList.remove(className);
          button.textContent = text;
        }
      }
    }

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
      changeButton(buttonAdd,this.container,"js-added","Added").add();
    }
    // if word added to learned, add class
    if (this.isLearned){
      changeButton(buttonLearn,this.container,"js-learned","Learned").add();
    }
    // function for event click add word and update word, if word had been added
    const addWord = async (
      target: MouseEvent,
      classToAdd: string,
      text1: string,
      difficulty: string,
      classToRemove: string,
      text2: string,
      buttonToChange: HTMLElement
    ) => {
      const api = new Api(API_URL);
      const button = target.currentTarget as HTMLButtonElement;
      console.log("from add button",button);
      // if word hadn't been added to hard words
      if (!button.classList.contains(classToAdd)){
        const response = await api.addToUserWords(
          this.container.id,
          { difficulty: difficulty, optional: {} }
        );
        console.log(`response add to ${difficulty}`,response)
        if (typeof response == "object"){
          changeButton(button,this.container,classToAdd,text1).add();
        }
        if (response === 417){
          const responseFromAdd = await api.updateUserWord(
            this.container.id,
            { difficulty: difficulty, optional: {} });
            console.log(`response update to ${difficulty}`,responseFromAdd)
          if (typeof responseFromAdd == "object"){
            if (buttonToChange.classList.contains(classToRemove)){
              changeButton(buttonLearn,this.container,classToRemove,text2).remove();
            }
            changeButton(button,this.container,classToAdd,text1).add();
          }
        }
      } else {
        const hardWords1 = await api.getAggregatedWords(1,1,"hard");
        const response = await api.deleteUserWord(this.container.id);  
        console.log("hardWords1",hardWords1);
        if (response === 204){
          changeButton(button,this.container,classToAdd,text1).remove();
        }
        if (location.hash === "#hard-words-page"){
          this.container.remove();
        }
        const hardWords2 = await api.getAggregatedWords(1,1,"hard");
        console.log("hardWords2",hardWords2);
      }
    };

    // add to hard words
    buttonAdd.onclick = async (e) => {
      await addWord(
        e,
        "js-added",
        "Added",
        "hard",
        "js-learned",
        "Not learned",
        buttonLearn
      );
    };
    // add to learned words
    buttonLearn.onclick = async(e)=>{
      await addWord(
        e,
        "js-learned",
        "Learned",
        "learned",
        "js-added",
        "Add to hard",
        buttonAdd
      );
     }

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

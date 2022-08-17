import Word, { API_URL } from "../api/types";
import Component from "../templates/component";
import play_icon from "../../assets/play.svg";
import { createElement } from "../utils/utils";

import "./word-card.scss";
class WordCard extends Component {
  private wordTemplate: Word;
  constructor(tagName: string, className: string, word: Word) {
    super(tagName, className);
    this.wordTemplate = word;
  }

  render() {
    const img = createElement("img", "learning__word-card-img");
    const spanWord = createElement("span", "learning__word-card-word");
    const div = createElement("div", "learning__word-card-container");
    const spanTranslate = createElement(
      "span",
      "learning__word-card-translate"
    );
    const spanTranscription = createElement(
      "span",
      "learning__word-card-transcription"
    );
    const imgAudio = createElement("img", "learning__word-card-audio-img");
    const audio = createElement("audio", "learning__word-card-audio");
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

    (img as HTMLImageElement).src = `${API_URL}/${this.wordTemplate.image}`;
    spanWord.textContent = `${this.wordTemplate.word}`;
    spanTranslate.textContent = `${this.wordTemplate.wordTranslate}`;
    spanTranscription.textContent = `${this.wordTemplate.transcription}`;
    (imgAudio as HTMLImageElement).src = `${play_icon}`;
    (audio as HTMLAudioElement).src = `${API_URL}/${this.wordTemplate.audio}`;
    spanMeaning.innerHTML = this.wordTemplate.textMeaning;
    spanMeaningEx.innerHTML = this.wordTemplate.textExample;
    spanTranslateEx.textContent = `${this.wordTemplate.textMeaningTranslate}`;
    spanTranslateM.textContent = `${this.wordTemplate.textExampleTranslate}`;

    buttonAdd.textContent = "Добавить";
    buttonLearn.textContent = "Не изучено";

    imgAudio.addEventListener("click", () => {
      (audio as HTMLAudioElement).play();
    });

    div.append(spanTranslate, spanTranscription, imgAudio, audio);
    divMeaning.append(spanMeaning, spanMeaningEx);
    divTranslate.append(spanTranslateEx, spanTranslateM);
    divButtons.append(buttonLearn, buttonAdd);
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

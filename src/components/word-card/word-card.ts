import Word, { API_URL, wordDifficulty, wordProgress } from '../api/types';
import Component from '../templates/component';
import play_icon from '../../assets/play.svg';
import { createElement } from '../utils/utils';

import './word-card.scss';
import Api from '../api/api';
import LoadingAnimation from '../loading-animation/loading-animation';

class WordCard extends Component {
  private wordTemplate: Word;

  private isAdded: string;

  private isLearned: string;

  private progress:wordProgress ;

  constructor(
    tagName: string,
    className: string,
    word: Word,
    isAdded: string,
    isLearned: string,
    progress: wordProgress | undefined
  ) {
    super(tagName, className);
    this.wordTemplate = word;
    this.isAdded = isAdded;
    this.isLearned = isLearned;
    this.progress = (progress) ? progress : 0;
  }

  // render word
  render() {
    const img = createElement('img', 'learning__word-card-img');
    const spanWord = createElement('span', 'learning__word-card-word');
    const div = createElement('div', 'learning__word-card-container');
    const spanTranslate = createElement(
      'span',
      'learning__word-card-translate-word',
    );
    const spanTranscription = createElement(
      'span',
      'learning__word-card-transcription',
    );
    const buttonPlay = createElement(
      'button',
      'learning__word-card-button-play',
    ) as HTMLButtonElement;
    const imgAudio = createElement('img', 'learning__word-card-audio-img');
    const audio = createElement('audio', 'learning__word-card-audio');
    const audioTranslate = createElement(
      'audio',
      'learning__word-card-audio-translate',
    );
    const audioMeaning = createElement(
      'audio',
      'learning__word-card-audio-meaning',
    );
    const divMeaning = createElement('div', 'learning__word-card-meaning');
    const spanMeaning = createElement(
      'span',
      'learning__word-card-translate-example',
    );
    const spanMeaningEx = createElement(
      'span',
      'learning__word-card-translate-meaning',
    );
    const divTranslate = createElement('div', 'learning__word-card-translate');
    const spanTranslateEx = createElement(
      'span',
      'learning__word-card-translate-example',
    );
    const spanTranslateM = createElement(
      'span',
      'learning__word-card-translate-meaning',
    );
    const divButtons = createElement('div', '');
    const buttonLearn = createElement(
      'button',
      'learning__word-card-button-learn',
    );
    const buttonAdd = createElement('button', 'learning__word-card-button-add');
    const divProgress = createElement("div","");
    const spanProgress1 = createElement("span","");
    const spanProgress2 = createElement("span","");
    const spanProgress3 = createElement("span","");
    const spanProgressArray = [spanProgress1,spanProgress2,spanProgress3];
    
    // function for changing class and textcontent
    const changeButton = (
      button: HTMLElement,
      word: HTMLElement,
      className: string,
      text: string,
    ) => ({
      add() {
        button.classList.add(className);
        word.classList.add(className);
        button.textContent = text;
      },
      remove() {
        button.classList.remove(className);
        word.classList.remove(className);
        button.textContent = text;
      },
    });
    // add class for page if all words had been added
    const pageIsDone = () => ({
      add() {
        const page = document.querySelector(
          '.learning__wrapper',
        ) as HTMLDivElement;
        if (page && !page.classList.contains('js-done')) page.classList.add('js-done');
      },
      remove() {
        const page = document.querySelector(
          '.learning__wrapper',
        ) as HTMLDivElement;
        if (page && page.classList.contains('js-done')) page.classList.remove('js-done');
      },
    });

    this.container.id = `${this.wordTemplate.id}`;
    (img as HTMLImageElement).src = `${API_URL}/${this.wordTemplate.image}`;
    spanWord.textContent = `${this.wordTemplate.word}`;
    spanTranslate.textContent = `${this.wordTemplate.wordTranslate}`;
    spanTranscription.textContent = `${this.wordTemplate.transcription}`;
    (imgAudio as HTMLImageElement).src = `${play_icon}`;
    (audio as HTMLAudioElement).src = `${API_URL}/${this.wordTemplate.audio}`;
    (
      audioMeaning as HTMLAudioElement
    ).src = `${API_URL}/${this.wordTemplate.audioMeaning}`;
    (
      audioTranslate as HTMLAudioElement
    ).src = `${API_URL}/${this.wordTemplate.audioExample}`;
    spanMeaning.innerHTML = this.wordTemplate.textMeaning;
    spanMeaningEx.innerHTML = this.wordTemplate.textExample;
    spanTranslateEx.textContent = `${this.wordTemplate.textMeaningTranslate}`;
    spanTranslateM.textContent = `${this.wordTemplate.textExampleTranslate}`;

    buttonAdd.textContent = 'Add to hard';
    buttonLearn.textContent = 'Not learned';
    // if word added to hard, add class
    if (this.isAdded) {
      changeButton(buttonAdd, this.container, 'js-added', 'Added').add();
    }
    // if word added to learned, add class
    if (this.isLearned) {
      changeButton(buttonLearn, this.container, 'js-learned', 'Learned').add();
    }
    // function for event click add word and update word, if word had been added
    const addWord = async (
      target: MouseEvent,
      classToAdd: string,
      text1: string,
      difficulty: wordDifficulty,
      learned: boolean,
      classToRemove: string,
      text2: string,
      textForDeleted:string,
      buttonToChange: HTMLElement,
      progress: wordProgress
    ) => {
      const api = new Api(API_URL);
      const button = target.currentTarget as HTMLButtonElement;
      const words1 = document.querySelectorAll(
        `.${classToAdd}`,
      ) as NodeListOf<HTMLElement>;
      const words2 = document.querySelectorAll(
        `.${classToRemove}`,
      ) as NodeListOf<HTMLElement>;
      // amount of added words
      const wordsCount = (words1.length + words2.length) / 2;
      const loadingAnimation = new LoadingAnimation(
        'div',
        'loading-animation',
        'card',
      );
      // if word hadn't been added to hard words
      if (!button.classList.contains(classToAdd)) {
        // animation start
        this.container.append(loadingAnimation.render());
        const response = await api.addToUserWords(this.container.id, {
          difficulty: difficulty,
          optional: { id: this.container.id, learned, progress},
        });
        // if adding of word was successful
        if (typeof response === 'object') {
          loadingAnimation.stop();
          // changing class of button and text
          changeButton(button, this.container, classToAdd, text1).add();
          // if added words are 20
          if (wordsCount + 1 === 20) pageIsDone().add();
          // if page is hard words - remove this word from page
          if (location.hash === '#hard-words-page') {
            this.container.remove();
          }
        }
        // if word already had been added
        if (response === 417) {
          const responseFromAdd = await api.updateUserWord(this.container.id, {
            difficulty,
            optional: { id: this.container.id, learned, progress},
          });
          // if updating was successful
          if (typeof responseFromAdd === 'object') {
            if (buttonToChange.classList.contains(classToRemove)) {
              changeButton(
                buttonToChange,
                this.container,
                classToRemove,
                text2,
              ).remove();
              if (location.hash === '#hard-words-page') {
                this.container.remove();
              }
            }
            loadingAnimation.stop();
            changeButton(button, this.container, classToAdd, text1).add();
          }
        }
        // if you want remove from added
      } else {
        const loadingAnimation = new LoadingAnimation(
          'div',
          'loading-animation',
          'card',
        );
        this.container.append(loadingAnimation.render());
        const response = await api.deleteUserWord(this.container.id);
        loadingAnimation.stop();
        if (response === 204) {
          changeButton(button, this.container, classToAdd, textForDeleted).remove();
          pageIsDone().remove();
        }
        if (location.hash === '#hard-words-page') {
          const classNameCard = this.container.className;
          const main = this.container.parentElement?.parentElement as HTMLDivElement;
          this.container.remove();
          const words = document.querySelectorAll(`.${classNameCard}`);
          if (!words.length){
            const emptyDiv = createElement("div","empty-page");
            emptyDiv.textContent = "You don't have any hard words";
            main.insertAdjacentElement("afterbegin",emptyDiv);
          }
          
         
        }
        loadingAnimation.stop();
      }
    };

    // add to hard words
    buttonAdd.onclick = async (e) => {
      await addWord(
        e,
        'js-added',
        'Added',
        'hard',
        false,
        'js-learned',
        'Not learned',
        "Add to hard",
        buttonLearn,
        this.progress
      );
    };
    // add to learned words
    buttonLearn.onclick = async (e) => {
      await addWord(
        e,
        'js-learned',
        'Learned',
        'easy',
        true,
        'js-added',
        'Add to hard',
        "Not learned",
        buttonAdd,
        this.progress
      );
    };

    // play audio
    buttonPlay.onclick = () => {
      buttonPlay.classList.add('js-clicked');
      (audio as HTMLAudioElement).play();
      buttonPlay.disabled = true;
    };
    audio.onended = () => (audioMeaning as HTMLAudioElement).play();
    audioMeaning.onended = () => (audioTranslate as HTMLAudioElement).play();
    audioTranslate.onended = () => {
      buttonPlay.disabled = false;
      buttonPlay.classList.remove('js-clicked');
    };
    buttonPlay.append(imgAudio);
    div.append(
      spanTranslate,
      spanTranscription,
      buttonPlay,
      audio,
      audioMeaning,
      audioTranslate,
    );
    divMeaning.append(spanMeaning, spanMeaningEx);
    divTranslate.append(spanTranslateEx, spanTranslateM);
    // check if user logged in
    if (localStorage.getItem('user')) {
      divButtons.append(buttonLearn, buttonAdd);
      divButtons.className = 'learning__word-card-buttons';
      for (let i =0; i < this.progress; i += 1){
        spanProgressArray[i].classList.add("js-progress");
      }
      divProgress.append(spanProgress1,spanProgress2,spanProgress3);
      divProgress.className = 'learning__progress';
    }
    this.container.append(
      img,
      spanWord,
      div,
      divProgress,
      divMeaning,
      divTranslate,
      divButtons,
    );

    return this.container;
  }
}

export default WordCard;

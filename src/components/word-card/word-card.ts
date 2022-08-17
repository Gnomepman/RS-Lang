import Word from '../api/types';
import Component from '../templates/component';
import play_icon from '../../assets/play.svg'
import './word-card.scss';
class WordCard extends Component{
  private wordTemplate: Word;
  constructor(tagName: string, className: string,word:Word) {
    super(tagName, className);
    this.wordTemplate = word;
  }

  static createElem(tag:string,className:string):HTMLElement{
    const elem = document.createElement(tag);
    elem.className = className;
    return elem;
  }

  render(){
    const img = WordCard.createElem('img','learning__word-card-img');
    const spanWord = WordCard.createElem('span','learning__word-card-word');
    const div = WordCard.createElem('div','learning__word-card-container');
    const spanTranslate = WordCard.createElem('span','learning__word-card-translate');
    const spanTranscription = WordCard.createElem('span','learning__word-card-transcription');
    const imgAudio = WordCard.createElem('img','learning__word-card-audio-img');
    const audio = WordCard.createElem('audio','learning__word-card-audio');
    const divMeaning = WordCard.createElem('div','learning__word-card-meaning');
    const spanMeaning = WordCard.createElem('span','learning__word-card-translate-example');
    const spanMeaningEx = WordCard.createElem('span','learning__word-card-translate-meaning');
    const divTranslate = WordCard.createElem('div','learning__word-card-translate');
    const spanTranslateEx = WordCard.createElem('span','learning__word-card-translate-example');
    const spanTranslateM = WordCard.createElem('span','learning__word-card-translate-meaning');
    const divButtons = WordCard.createElem('div','learning__word-card-buttons');
    const buttonLearn = WordCard.createElem('button','learning__word-card-button-learn');
    const buttonAdd = WordCard.createElem('button','learning__word-card-button-add');
    
    (img as HTMLImageElement).src = `${this.wordTemplate.image}`;
    spanWord.textContent = `${this.wordTemplate.word}`;
    spanTranslate.textContent = `${this.wordTemplate.wordTranslate}`;
    spanTranscription.textContent = `${this.wordTemplate.transcription}`;
    (imgAudio as HTMLImageElement).src = `${play_icon}`;
    (audio as HTMLAudioElement).src = `${this.wordTemplate.audio}`;
    spanMeaning.innerHTML = this.wordTemplate.textMeaning;
    spanMeaningEx.innerHTML = this.wordTemplate.textExample;
    spanTranslateEx.textContent = `${this.wordTemplate.textMeaningTranslate}`;
    spanTranslateM.textContent = `${this.wordTemplate.textExampleTranslate}`;

    buttonAdd.textContent = 'Добавить';
    buttonLearn.textContent = 'Не изучено';

    imgAudio.addEventListener('click',()=>{
      (audio as HTMLAudioElement).play();
    })

    div.append(spanTranslate,spanTranscription,imgAudio,audio);
    divMeaning.append(spanMeaning,spanMeaningEx);
    divTranslate.append(spanTranslateEx,spanTranslateM);
    divButtons.append(buttonLearn,buttonAdd);
    this.container.append(img,spanWord,div,divMeaning,divTranslate,divButtons)
    
    return this.container;
  }
}

export default WordCard;
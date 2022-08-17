import Page from '../../components/templates/page';
import Api from '../../components/api/api';
import Word from '../../components/api/types';
import play_icon from '../../assets/play.svg'
import './learning.scss';

const API_URL = 'https://rs-lang-test.herokuapp.com';

class LearningPage extends Page{
  static TextObject = {
    MainTitle: 'Learning2 Page',
  };

  constructor(id: string) {
    super(id);
  }

  renderWord(word:Word):string{
    const wordTemplate = `
    <div class="learning__word-card">
    <img class="learning__word-card-img" src="${word.image}" alt="" />
    <span class="learning__word-card-word">${word.word}</span>
    <div class="learning__word-card-container">
      <span class="learning__word-card-translate">${word.wordTranslate}</span>
      <span class="learning__word-card-transcription">${word.transcription}</span>
      <img class="learning__word-card-audio-img" src="${play_icon}" alt="" />
      <audio class="learning__word-card-audio" src="${word.audio}" alt=""/>
      </audio>
    </div>
    <div class="learning__word-card-meaning">
      <span class="learning__word-card-text-meaning">${word.textMeaning}</span>
      <span class="learning__word-card-text-example">${word.textExample}</span>
    </div>
    <div class="learning__word-card-translate">
      <span class="learning__word-card-translate-example">${word.textMeaningTranslate}</span>
      <span class="learning__word-card-translate-meaning">${word.textExampleTranslate}</span>
    </div>
    <div class="learning__word-card-buttons">
      <button class="learning__word-card-button-learn">Не изучено</button>
      <button class="learning__word-card-button-add">Добавить в сложное</button></div>
  </div>
    `;
    return wordTemplate;
  }

  async renderCardWords(){
    const api = new Api(`${API_URL}`);
    const words = await api.getWords(1,1);
    console.log('words',words);
    words.forEach((word)=>{
      this.container.innerHTML +=this.renderWord(word);
    })
    
  }

  render() {
    const title = this.createHeaderTitle(LearningPage.TextObject.MainTitle);
    console.log('begin:');
    this.renderCardWords().then((r) =>{
      console.log('response:',r);
    })
    
    this.container.append(title);
    return this.container;
  }
}

export default LearningPage;
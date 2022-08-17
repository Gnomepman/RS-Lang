import Page from '../../components/templates/page';
import Api from '../../components/api/api';
import './learning.scss';
import WordCard from '../../components/word-card/word-card';

const API_URL = 'https://rs-lang-test.herokuapp.com';

class LearningPage extends Page{
  static TextObject = {
    MainTitle: 'Learning2 Page',
  };

  constructor(id: string) {
    super(id);
  }

  
  async renderCardWords(){
    const api = new Api(`${API_URL}`);
    const words = await api.getWords(1,1);
    const div = document.createElement('div');
    div.className = 'learning';
    console.log('words',words);
    words.forEach((word)=>{
      const wordCard = new WordCard('div','learning__word-card',word);
      console.log('wordCard',wordCard);
      div.append(wordCard.render());
    })
    this.container.append(div);
    
  }

  render() {
    const title = this.createHeaderTitle(LearningPage.TextObject.MainTitle);
    console.log('begin:');
    this.renderCardWords();
    this.container.append(title);
    return this.container;
  }
}

export default LearningPage;
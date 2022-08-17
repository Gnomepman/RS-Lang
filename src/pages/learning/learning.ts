import Page from '../../components/templates/page';
import Api from '../../components/api/api';
import './learning.scss';
import WordCard from '../../components/word-card/word-card';
import Pagination from '../../components/pagination/pagination';

const API_URL = 'https://rs-lang-test.herokuapp.com';

class LearningPage extends Page{
  static TextObject = {
    MainTitle: 'Learning2 Page',
  };

  constructor(id: string) {
    super(id);
  }

  async renderCardWords(page:number,group:number){
    const api = new Api(`${API_URL}`);
    const words = await api.getWords(1,1);
    const div = document.createElement('div');
    div.className = 'learning';
    console.log('words',words);
    words.forEach((word)=>{
      const wordCard = new WordCard('div','learning__word-card',word);
      div.append(wordCard.render());
    })
    this.container.append(div);
    
  }

  async renderNextPage(next:HTMLButtonElement | null,page:HTMLSpanElement | null){
    console.log(next);
    next?.addEventListener('click',()=>{
      console.log('click');
      let count: number = +(page?.textContent as string);
      count += 1;
      if (page) page.textContent = count.toString(10);
    })
  }

  render() {
    const title = this.createHeaderTitle(LearningPage.TextObject.MainTitle);
    const pagination = new Pagination('div','pagination');
    console.log('begin:');
    this.container.append(title);
    this.renderCardWords(1,1).then(() => {this.container.append(pagination.render()),
      this.renderNextPage(pagination.next,pagination.page);});
    
    return this.container;
  }
}

export default LearningPage;
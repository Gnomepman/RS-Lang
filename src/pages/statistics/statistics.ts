import Page from '../../components/templates/page';
import './statistics.scss'
import Api from '../../components/api/api';
import { API_URL } from '../../components/api/types';
import error from '../../assets/404-error.svg'

export default class StatisticsPage extends Page {
  private api: Api;

  constructor(id: string) {
    super(id);
    this.api = new Api(API_URL);
  }

  render() {
    //if user is anonymous
    if (!localStorage.user){
      const block = this.createDivBlock('no_statistics');
      const description = document.createElement('h2');
      description.textContent = 'Statistics is only for loged in users'
      const img = document.createElement('img')
      img.src = error;
      block.append(description);
      block.append(img);
      this.container.append(block);
      return this.container
    }
    //if user is loged in
    this.api.refreshToken();
    this.container.append();
    return this.container;
  }
}
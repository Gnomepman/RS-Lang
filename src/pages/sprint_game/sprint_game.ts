import './sprint_game.scss';
import Page from '../../components/templates/page';
import Api from '../../components/api/api';
import Word from '../../components/api/types'
import { API_URL } from '../../components/api/types';
import Timer from '../../components/timer/timer';

export default class Sprint_game extends Page {
  private group: number;
  private page: number;
  private words: Word[];
  private api: Api;

  constructor(id: string, group?: number, page?: number) {
    super(id);
    this.api = new Api(API_URL);
    this.words = [];
    page ? (this.page = page) : (this.page = this.randomIntFromInterval(0, 29));
    if (group) {
      this.group = group;
      this.getWords();
    } else {
      this.group = -1;
    }
  }

  async getWords() {
    this.words = await this.api.getWords(this.page, this.group);
    console.log(this.words);
  }

  randomIntFromInterval(min: number, max: number) {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  renderChooseGroup(wrapper: HTMLDivElement) {
    const choose_group = this.createDivBlock("choose_group");
    const label = document.createElement('h2');
    label.textContent = "Choose group"
    choose_group.append(label);
    const groups = this.createDivBlock("groups_to_choose");
    for (let i = 0; i < 6; i++) {
      const button = document.createElement("button");
      button.textContent = String(i + 1);
      button.id = String(i + 1);
      button.addEventListener("click", () => {
        choose_group.remove();
        console.log(Number(button.textContent));
        this.group = Number(button.textContent) - 1;
        this.getWords();
        this.renderTimer(wrapper);
      });
      groups.append(button);
    }
    choose_group.append(groups)
    wrapper.append(choose_group);
  }

  renderTimer(wrapper: HTMLDivElement) {
    const timer = new Timer('div', 'timer', 5);
    const timerDiv = timer.render();
    setTimeout(() => {
            timerDiv.remove();
            //here we should call next function
    }, 5000)
    wrapper.append(timerDiv);
  }

  render() {
    const wrapper = this.createDivBlock("sprint_wrapper");
    if(this.group === -1){
        this.renderChooseGroup(wrapper);
    } else {
        this.renderTimer(wrapper);
    }

    this.container.append(wrapper);
    return this.container;
  }
}
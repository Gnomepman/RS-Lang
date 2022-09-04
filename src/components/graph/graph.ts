import Chart from 'chart.js/auto';
import Api from '../api/api';
import { API_URL, sessionStatistics, statistics, statisticsPerSession } from '../api/types';
import Component from '../templates/component';
import { createElement } from '../utils/utils';
import { fakeStats } from './fake-stats';


// For working:
// 1.Need to install: npm install chart.js
// 2. Add line to tsconfig.json: "moduleResolution": "node",


class GraphNewWordsPerDay extends Component{
  wordsPerSession: statisticsPerSession;
  dates: string[];
  newWords:number[];
  constructor(
    tagName: string,
    className: string,
    wordsPerSession:statisticsPerSession
  ) {
    super(tagName, className);
    this.wordsPerSession = wordsPerSession;
    this.dates = [];
    this.newWords = [];
  }

  static proceedData(array:sessionStatistics[]){
    const result = [];
    let newWords = 0;
    for (let i = 1; i < array.length ; i += 1) {
      const date1 = (new Date(array[i - 1].day)).getDay();
      const date2 = (new Date(array[i].day)).getDay();
      if (date1 === date2) {
        newWords += array[i - 1].new_words_per_session;
      }
      else {
        newWords += array[i - 1].new_words_per_session;
        result.push({day:new Date(array[i - 1].day),newWords});
        newWords = 0;
      }
      if (array[i + 1] === undefined){
        newWords += array[i].new_words_per_session;
        result.push({day:new Date(array[i - 1].day),newWords});
      }
    }

    return result;
  }

  renderGraph(){
    const canvas = createElement("canvas","graph") as HTMLCanvasElement;
    const result = GraphNewWordsPerDay.proceedData(this.wordsPerSession.statistics_per_session);
    result.forEach((a)=>{
      const dateTemp = new Date(a.day);
      const month = new Intl.DateTimeFormat('en-US', { "month": '2-digit'}).format(dateTemp);
      const day = new Intl.DateTimeFormat('en-US', { "day": '2-digit'}).format(dateTemp);
      this.dates.push(`${month}/${day}`);
      this.newWords.push(a.newWords);
    })

    const myChart = new Chart(canvas, {
      type: 'bar',
      data: {
          labels: this.dates,
          datasets: [{
              label: 'New Words',
              data: this.newWords,
              borderWidth: 1,
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
          }]
      },
      options: {
          scales: {
              y: {
                  beginAtZero: true
              }
          }
      }
  })

  return canvas;
  }

  async createFakeStatistics(){
    const obj:statistics = fakeStats;
    const api = new Api(API_URL);
    await api.updateUserStatistics(obj);
  }

  render(): HTMLElement {
    this.container.append(this.renderGraph());
    return this.container;
  }
}

export default GraphNewWordsPerDay;

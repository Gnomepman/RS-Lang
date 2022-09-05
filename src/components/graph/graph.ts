import Chart from "chart.js/auto";
import Api from "../api/api";
import {
  API_URL,
  sessionStatistics,
  statistics,
  statisticsPerSession,
} from "../api/types";
import Component from "../templates/component";
import { createElement } from "../utils/utils";
import { fakeStats } from "./fake-stats";
import "./graph.scss";

// For working:
// 1.Need to install: npm install chart.js
// 2. Add line to tsconfig.json: "moduleResolution": "node",

class GraphNewWordsPerDay extends Component {
  wordsPerSession: statisticsPerSession;
  dates: string[];
  newWords: number[];
  constructor(
    tagName: string,
    className: string,
    wordsPerSession: statisticsPerSession
  ) {
    super(tagName, className);
    this.wordsPerSession = wordsPerSession;
    this.dates = [];
    this.newWords = [];
  }

  static proceedData(array: sessionStatistics[]) {
    const result = [];
    let newWords = 0;
    for (let i = 1; i < array.length; i += 1) {
      const date1 = new Date(array[i - 1].day).getDay();
      const date2 = new Date(array[i].day).getDay();
      if (date1 === date2) {
        newWords += array[i - 1].new_words_per_session;
      } else {
        newWords += array[i - 1].new_words_per_session;
        result.push({ day: new Date(array[i - 1].day), newWords });
        newWords = 0;
      }
      if (array[i + 1] === undefined) {
        newWords += array[i].new_words_per_session;
        result.push({ day: new Date(array[i - 1].day), newWords });
      }
    }
    if (result.length === 1){
      const prevDay = result[0].day.getDate() - 1;
      const prevMonth = result[0].day.getMonth();
      const prevYear = result[0].day.getFullYear();
      const nextDay = result[0].day.getDate() + 1;
      const nextMonth = result[0].day.getMonth();
      const nextYear = result[0].day.getFullYear();
      const pervDate = new Date(prevYear,prevMonth,prevDay);
      const nextDate = new Date(nextYear,nextMonth,nextDay);
      result.unshift({day:pervDate,newWords: 0});
      result.push({day:nextDate, newWords:0});
    }
    return result;
  }

  renderGraph() {
    const canvas = createElement("canvas", "graph") as HTMLCanvasElement;
    const result = GraphNewWordsPerDay.proceedData(
      this.wordsPerSession.statistics_per_session
    );
    result.forEach((a) => {
      const dateTemp = new Date(a.day);
      const month = new Intl.DateTimeFormat("en-US", {
        month: "2-digit",
      }).format(dateTemp);
      const day = new Intl.DateTimeFormat("en-US", { day: "2-digit" }).format(
        dateTemp
      );
      this.dates.push(`${day}/${month}`);
      this.newWords.push(a.newWords);
    });

    const myChart = new Chart(canvas, {
      type: "bar",
      data: {
        labels: this.dates,
        datasets: [
          {
            label: "New Words",
            data: this.newWords,
            borderWidth: 1,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    return canvas;
  }



  async createFakeStatistics() {
    const obj: statistics = fakeStats;
    const api = new Api(API_URL);
    await api.updateUserStatistics(obj);
  }

  render(): HTMLElement {
    this.container.append(this.renderGraph());
    return this.container;
  }
}

export default GraphNewWordsPerDay;

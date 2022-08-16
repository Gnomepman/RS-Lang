import Page from '../components/templates/page';
import './statistics.scss'

export default class StatisticsPage extends Page {
  static TextObject = {
    MainTitle: "Statistics Page",
  };

  constructor(id: string) {
    super(id);
  }

  render() {
    const title = this.createHeaderTitle(StatisticsPage.TextObject.MainTitle);
    this.container.append(title);
    return this.container;
  }
}
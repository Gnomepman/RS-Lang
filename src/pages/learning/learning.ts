import Page from '../components/templates/page';

class LearningPage extends Page{
  static TextObject = {
    MainTitle: 'Learning2 Page',
  };

  constructor(id: string) {
    super(id);
  }

  render() {
    const title = this.createHeaderTitle(LearningPage.TextObject.MainTitle);
    this.container.append(title);
    return this.container;
  }
}

export default LearningPage;
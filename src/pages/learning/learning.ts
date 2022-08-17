import Page from "../../components/templates/page";
import Api from "../../components/api/api";
import "./learning.scss";
import WordCard from "../../components/word-card/word-card";
import Pagination, { PaginationButtons } from "../../components/pagination/pagination";
import { API_URL } from "../../components/api/types";

class LearningPage extends Page {
  static TextObject = {
    MainTitle: "Learning2 Page",
  };

  constructor(id: string) {
    super(id);
  }

  async renderCardWords(page: number, group: number) {
    const api = new Api(`${API_URL}`);
    const words = await api.getWords(page, group);
    const div = document.createElement("div");
    div.className = "learning";
    console.log("words", words);
    words.forEach((word) => {
      const wordCard = new WordCard("div", "learning__word-card", word);
      div.append(wordCard.render());
    });
    this.container.insertAdjacentElement('afterbegin',div);
  }

  async renderNextPage(
    pagButtons:PaginationButtons
  ) {
    console.log(pagButtons.next);
    const buttonNext = document.querySelector(`.${pagButtons.next}`) as HTMLButtonElement;
    buttonNext?.addEventListener("click",async () => {
      const spanPage = document.querySelector(`.${pagButtons.page}`) as HTMLSpanElement;
      const buttonPrev = document.querySelector(`.${pagButtons.prev}`) as HTMLButtonElement;
      const buttonFirst = document.querySelector(`.${pagButtons.first}`) as HTMLButtonElement;
      let pageCurrent: number = +(spanPage?.textContent as string);
      pageCurrent += 1;
      if (buttonPrev.disabled){
        buttonPrev.disabled = false;
        buttonFirst.disabled = false;
      }
      if (spanPage) {
        const current = document.querySelector('.learning') as HTMLDivElement;
        current.remove();
        await this.renderCardWords(pageCurrent,1);
        spanPage.textContent = pageCurrent.toString(10);
      }
    });
  }

  render() {
    const pagination = new Pagination("div", "pagination");
    console.log("begin:");
    this.renderCardWords(1, 1).then(() => {
      this.container.append(pagination.render()),
      this.renderNextPage(pagination.pagButtons);
    });

    return this.container;
  }
}

export default LearningPage;

import Page from "../../components/templates/page";
import Api from "../../components/api/api";
import "./learning.scss";
import WordCard from "../../components/word-card/word-card";
import Pagination from "../../components/pagination/pagination";
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
    next: HTMLButtonElement | null,
    page: HTMLSpanElement | null
  ) {
    console.log(next);
    next?.addEventListener("click",async () => {
      let pageCurrent: number = +(page?.textContent as string);
      pageCurrent += 1;
      if (page) {
        const current = document.querySelector('.learning') as HTMLDivElement;
        current.remove();
        await this.renderCardWords(pageCurrent,1);
        page.textContent = pageCurrent.toString(10);

      }
    });
  }

  render() {
    const pagination = new Pagination("div", "pagination");
    console.log("begin:");
    this.renderCardWords(1, 1).then(() => {
      this.container.append(pagination.render()),
      this.renderNextPage(pagination.next, pagination.page);
    });

    return this.container;
  }
}

export default LearningPage;

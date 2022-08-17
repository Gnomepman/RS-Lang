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
    const buttonNext = document.querySelector(`.${pagButtons.next}`) as HTMLButtonElement;
    buttonNext?.addEventListener("click",async () => {
      const spanPage = document.querySelector(`.${pagButtons.page}`) as HTMLSpanElement;
      const buttonPrev = document.querySelector(`.${pagButtons.prev}`) as HTMLButtonElement;
      const buttonFirst = document.querySelector(`.${pagButtons.first}`) as HTMLButtonElement;
      const buttonLast = document.querySelector(`.${pagButtons.last}`) as HTMLButtonElement;
      let pageCurrent: number = +(spanPage?.textContent as string);
      pageCurrent += 1;
      if (pageCurrent === 30) {
        buttonNext.disabled = true;
        buttonLast.disabled = true;
      }
      if (buttonPrev.disabled){
        buttonPrev.disabled = false;
        buttonFirst.disabled = false;
      }
      const current = document.querySelector('.learning') as HTMLDivElement;
      current.remove();
      await this.renderCardWords(pageCurrent,1);
      spanPage.textContent = pageCurrent.toString(10);
    });
  }

  async renderPrevPage(pagButtons:PaginationButtons){
    const buttonPrev = document.querySelector(`.${pagButtons.prev}`) as HTMLButtonElement;
    buttonPrev.addEventListener('click',async ()=>{
      const buttonNext = document.querySelector(`.${pagButtons.next}`) as HTMLButtonElement;
      const buttonFirst = document.querySelector(`.${pagButtons.first}`) as HTMLButtonElement;
      const buttonLast = document.querySelector(`.${pagButtons.last}`) as HTMLButtonElement;
      const spanPage = document.querySelector(`.${pagButtons.page}`) as HTMLSpanElement;
      let pageCurrent: number = +(spanPage?.textContent as string);
      pageCurrent -= 1;
      if (pageCurrent === 1) {
        buttonPrev.disabled = true;
        buttonFirst.disabled = true;
      }
      if (buttonNext.disabled) {
        buttonNext.disabled = false;
        buttonLast.disabled = true;
      }
      const current = document.querySelector('.learning') as HTMLDivElement;
      current.remove();
      await this.renderCardWords(pageCurrent,1);
      spanPage.textContent = pageCurrent.toString(10);
    })
  }

  render() {
    const pagination = new Pagination("div", "pagination");
    console.log("begin:");
    this.renderCardWords(1, 1).then(() => {
      this.container.append(pagination.render()),
      this.renderNextPage(pagination.pagButtons);
    }).then(() => {
      this.renderPrevPage(pagination.pagButtons);
    });

    return this.container;
  }
}

export default LearningPage;

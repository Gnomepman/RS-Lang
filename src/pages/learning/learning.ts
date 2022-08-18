import Page from "../../components/templates/page";
import Api from "../../components/api/api";
import "./learning.scss";
import WordCard from "../../components/word-card/word-card";
import Pagination, {
  PaginationButtons,DropdownClasses
} from "../../components/pagination/pagination";
import { API_URL } from "../../components/api/types";
import { createElement } from "../../components/utils/utils";

class LearningPage extends Page {
  static TextObject = {
    MainTitle: "Learning2 Page",
  };

  constructor(id: string) {
    super(id);
  }

  async renderNewGroup(dropdown:DropdownClasses){
    const div = document.querySelector(`.${dropdown.div}`) as HTMLDivElement;
    const content = document.querySelector(`.${dropdown.content}`) as HTMLDialogElement;

    div.addEventListener("click", (e) => {
      div.classList.toggle("js-clicked");
      console.log(dropdown.group);
      if (
        (e.target as HTMLDivElement).classList.contains(dropdown.group)
      ) {
        const prevGroup = div.innerText;
        const prevGroupId: number = +(div.getAttribute(
          "data-group"
        ) as string);
        const clickedGroupId: string = (
          e.target as HTMLDivElement
        ).getAttribute("data-group") as string;
        const clickedGroup = (e.target as HTMLDivElement).textContent;
        const newGroup = createElement("div", dropdown.group);
        newGroup.setAttribute("data-group", prevGroupId.toString(10));
        newGroup.textContent = prevGroup;
        div.childNodes[0].textContent = clickedGroup;
        div.setAttribute("data-group", clickedGroupId);
        const groups = document.querySelectorAll(`.${dropdown.group}`) as NodeListOf<HTMLDivElement>;
        if (prevGroupId === 1) content.insertAdjacentElement("afterbegin", newGroup);
        else if (prevGroupId === 6)
          content.insertAdjacentElement("beforeend", newGroup);
        else groups[prevGroupId - 1].insertAdjacentElement("beforebegin", newGroup);
        (e.target as HTMLDivElement).remove();
      }
    });
  }

  // Render words from needed page and group
  async renderCardWords(page: number, group: number) {
    const api = new Api(`${API_URL}`);
    const words = await api.getWords(page, group);
    const div = document.createElement("div");
    div.className = "learning";
    words.forEach((word) => {
      const wordCard = new WordCard("div", "learning__word-card", word);
      div.append(wordCard.render());
    });
    this.container.insertAdjacentElement("afterbegin", div);
  }

  // Render next page after click on button next page
  async renderNextPage(pagButtons: PaginationButtons) {
    const buttonNext = document.querySelector(
      `.${pagButtons.next}`
    ) as HTMLButtonElement;
    buttonNext?.addEventListener("click", async () => {
      const spanPage = document.querySelector(
        `.${pagButtons.page}`
      ) as HTMLSpanElement;
      const buttonPrev = document.querySelector(
        `.${pagButtons.prev}`
      ) as HTMLButtonElement;
      const buttonFirst = document.querySelector(
        `.${pagButtons.first}`
      ) as HTMLButtonElement;
      const buttonLast = document.querySelector(
        `.${pagButtons.last}`
      ) as HTMLButtonElement;
      // get current page
      let pageCurrent: number = +(spanPage?.textContent as string);
      pageCurrent += 1;
      // if current page 30 - disable buttons next and last
      if (pageCurrent === 30) {
        buttonNext.disabled = true;
        buttonLast.disabled = true;
      }
      // if prev button disabled - enable
      if (buttonPrev.disabled) {
        buttonPrev.disabled = false;
        buttonFirst.disabled = false;
      }
      // remove div with class .learning and append new div with new words
      const current = document.querySelector(".learning") as HTMLDivElement;
      current.remove();
      await this.renderCardWords(pageCurrent, 1);
      spanPage.textContent = pageCurrent.toString(10);
    });
  }

  // Render previous page after click on button prev page
  async renderPrevPage(pagButtons: PaginationButtons) {
    const buttonPrev = document.querySelector(
      `.${pagButtons.prev}`
    ) as HTMLButtonElement;
    buttonPrev.addEventListener("click", async () => {
      const buttonNext = document.querySelector(
        `.${pagButtons.next}`
      ) as HTMLButtonElement;
      const buttonFirst = document.querySelector(
        `.${pagButtons.first}`
      ) as HTMLButtonElement;
      const buttonLast = document.querySelector(
        `.${pagButtons.last}`
      ) as HTMLButtonElement;
      const spanPage = document.querySelector(
        `.${pagButtons.page}`
      ) as HTMLSpanElement;
      let pageCurrent: number = +(spanPage?.textContent as string);
      pageCurrent -= 1;
      // if current page 1 - disable buttons prev and first
      if (pageCurrent === 1) {
        buttonPrev.disabled = true;
        buttonFirst.disabled = true;
      }
      // if next button disabled - enable
      if (buttonNext.disabled) {
        buttonNext.disabled = false;
        buttonLast.disabled = false;
      }
      // remove div with class .learning and append new div with new words
      const current = document.querySelector(".learning") as HTMLDivElement;
      current.remove();
      await this.renderCardWords(pageCurrent, 1);
      spanPage.textContent = pageCurrent.toString(10);
    });
  }

  async renderLastPage(pagButtons: PaginationButtons){
    const buttonLast = document.querySelector(`.${pagButtons.last}`) as HTMLButtonElement;
    const buttonNext = document.querySelector(
      `.${pagButtons.next}`
    ) as HTMLButtonElement;
    const buttonFirst = document.querySelector(
      `.${pagButtons.first}`
    ) as HTMLButtonElement;
    const buttonPrev = document.querySelector(
      `.${pagButtons.prev}`
    ) as HTMLButtonElement;
    buttonLast.addEventListener('click',async ()=>{
      const spanPage = document.querySelector(
        `.${pagButtons.page}`
      ) as HTMLSpanElement;
      const current = document.querySelector(".learning") as HTMLDivElement;

      spanPage.textContent = `30`;
      buttonLast.disabled = true;
      buttonNext.disabled = true;
      if (buttonPrev.disabled) {
        buttonPrev.disabled = false;
        buttonFirst.disabled = false;
      }
      current.remove();
      await this.renderCardWords(30, 1);
    })
  }

  async renderFirstPage(pagButtons: PaginationButtons){
    const buttonFirst = document.querySelector(
      `.${pagButtons.first}`
    ) as HTMLButtonElement;
    buttonFirst.addEventListener('click',async ()=>{
      const buttonNext = document.querySelector(
        `.${pagButtons.next}`
      ) as HTMLButtonElement;
      const buttonPrev = document.querySelector(
        `.${pagButtons.prev}`
      ) as HTMLButtonElement;
      const buttonLast = document.querySelector(
        `.${pagButtons.last}`
      ) as HTMLButtonElement;
      const spanPage = document.querySelector(
        `.${pagButtons.page}`
      ) as HTMLSpanElement;
      const current = document.querySelector(".learning") as HTMLDivElement;
      spanPage.textContent = `1`;
      buttonPrev.disabled = true;
      buttonFirst.disabled = true;
      if (buttonNext.disabled) {
        buttonNext.disabled = false;
        buttonLast.disabled = false;
      }
      current.remove();
      await this.renderCardWords(1, 1);
    })
    
  }

  render() {
    const pagination = new Pagination("div", "pagination");
    console.log("begin:");
    this.renderCardWords(1, 1)
      .then(() => {
        this.container.append(pagination.render()),
          this.renderNextPage(pagination.pagButtons);
          this.renderPrevPage(pagination.pagButtons);
          this.renderLastPage(pagination.pagButtons);
          this.renderFirstPage(pagination.pagButtons);
          this.renderNewGroup(pagination.dropdown);
      });
    return this.container;
  }
}

export default LearningPage;

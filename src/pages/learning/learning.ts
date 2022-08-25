import Page from "../../components/templates/page";
import Api from "../../components/api/api";
import "./learning.scss";
import WordCard from "../../components/word-card/word-card";
import Controls, {
  PaginationButtons,
  DropdownClasses,
} from "../../components/controls/controls";
import {
  AggregatedWord,
  AggregatedWords,
  API_URL,
  SavedWords,
  SignInResponse,
} from "../../components/api/types";
import { createElement } from "../../components/utils/utils";
import sprint_icon from "../../assets/sprint.svg";
import audio_challenge_icon from "../../assets/audio_challenge.svg";

class LearningPage extends Page {
  static TextObject = {
    MainTitle: "Learning2 Page",
  };
  static currentGroup = 1;
  static currentPage = 1;
  static divWrapper: HTMLDivElement;
  constructor(id: string) {
    super(id);
    LearningPage.divWrapper = createElement(
      "div",
      "learning__wrapper"
    ) as HTMLDivElement;
  }

  async renderNewGroup(
    dropdown: DropdownClasses,
    pagButtons: PaginationButtons
  ) {
    const div = document.querySelector(`.${dropdown.div}`) as HTMLDivElement;
    const content = document.querySelector(
      `.${dropdown.content}`
    ) as HTMLDivElement;

    div.addEventListener("click", async (e) => {
      div.classList.toggle("js-clicked");

      if ((e.target as HTMLDivElement).classList.contains(dropdown.group)) {
        const prevGroup = div.childNodes[0].textContent;
        const prevGroupId: number = +(div.getAttribute("data-group") as string);
        LearningPage.currentGroup = prevGroupId;
        const clickedGroupId: string = (
          e.target as HTMLDivElement
        ).getAttribute("data-group") as string;
        const clickedGroup = (e.target as HTMLDivElement).textContent;
        const newGroup = createElement("div", dropdown.group);
        newGroup.setAttribute("data-group", prevGroupId.toString(10));
        newGroup.textContent = prevGroup;
        div.childNodes[0].textContent = clickedGroup;
        div.setAttribute("data-group", clickedGroupId);
        const groups = document.querySelectorAll(
          `.${dropdown.group}`
        ) as NodeListOf<HTMLDivElement>;
        if (prevGroupId === 1)
          content.insertAdjacentElement("afterbegin", newGroup);
        else if (prevGroupId === 6)
          content.insertAdjacentElement("beforeend", newGroup);
        else
          groups[prevGroupId - 1].insertAdjacentElement(
            "beforebegin",
            newGroup
          );
        (e.target as HTMLDivElement).remove();
        LearningPage.currentGroup = +clickedGroupId;
        await this.renderCardWords(1, LearningPage.currentGroup);
        LearningPage.resetPagination(pagButtons);
      }
    });
  }

  static isAdded(
    words: AggregatedWord[],
    wordId: string
  ): AggregatedWord | undefined {
    const result = words.find((i) => i._id === wordId);
    return result;
  }

  // Render words from needed page and group
  async renderCardWords(page: number, group: number) {
    const api = new Api(`${API_URL}`);
    const words = await api.getWords(page, group);
    let user: SignInResponse;
    let hardWords: AggregatedWords[] | number;
    let learnedWords: AggregatedWords[] | number;
    let userWords: AggregatedWord[];
    if (localStorage.getItem("user")) {
      user = JSON.parse(localStorage.getItem("user") as string);
      hardWords = await api.getAggregatedWords(page,group,"hard");
      learnedWords = await api.getAggregatedWords(page,group,"learned");
      if ((Array.isArray(hardWords))&&(Array.isArray(learnedWords))){
        userWords = [...hardWords[0].paginatedResults,...learnedWords[0].paginatedResults];
      }
      
      console.log("user",user);
    }

    const div = document.createElement("div");
    const current = document.querySelector(".learning") as HTMLDivElement;
    let wordCard: WordCard;
    if (current) current.remove();
    div.className = "learning";
    words.forEach((word) => {
      // if user added to hard words or learned
      if (userWords && Array.isArray(userWords)) {
        // if word added to hard words or learned
        if (LearningPage.isAdded(userWords, word.id)) {
          const difficulty = LearningPage.isAdded(userWords, word.id);
          //if difficulty of word is hard
          if (difficulty?.userWord?.difficulty === "hard"){
            wordCard = new WordCard(
              "div",
              "learning__word-card",
              word,
              "js-added",
              ""
            );
          }
          //if difficulty of word is learned
          if (difficulty?.userWord?.difficulty === "learned"){
            wordCard = new WordCard(
              "div",
              "learning__word-card",
              word,
              "",
              "js-learned"
            );
          }
        } else {
          wordCard = new WordCard("div", "learning__word-card", word, "","");
        }
      } else {
        wordCard = new WordCard("div", "learning__word-card", word, "","");
      }
      div.append(wordCard.render());
    });
    LearningPage.divWrapper.insertAdjacentElement("afterbegin", div);
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
      LearningPage.currentPage = pageCurrent;
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
      await this.renderCardWords(pageCurrent, LearningPage.currentGroup);
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
      LearningPage.currentPage = pageCurrent;
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
      await this.renderCardWords(pageCurrent, LearningPage.currentGroup);
      spanPage.textContent = pageCurrent.toString(10);
    });
  }

  async renderLastPage(pagButtons: PaginationButtons) {
    const buttonLast = document.querySelector(
      `.${pagButtons.last}`
    ) as HTMLButtonElement;
    const buttonNext = document.querySelector(
      `.${pagButtons.next}`
    ) as HTMLButtonElement;
    const buttonFirst = document.querySelector(
      `.${pagButtons.first}`
    ) as HTMLButtonElement;
    const buttonPrev = document.querySelector(
      `.${pagButtons.prev}`
    ) as HTMLButtonElement;
    buttonLast.addEventListener("click", async () => {
      const spanPage = document.querySelector(
        `.${pagButtons.page}`
      ) as HTMLSpanElement;
      LearningPage.currentPage = 30;
      spanPage.textContent = `30`;
      buttonLast.disabled = true;
      buttonNext.disabled = true;
      if (buttonPrev.disabled) {
        buttonPrev.disabled = false;
        buttonFirst.disabled = false;
      }
      await this.renderCardWords(30, LearningPage.currentGroup);
    });
  }

  async renderFirstPage(pagButtons: PaginationButtons) {
    const buttonFirst = document.querySelector(
      `.${pagButtons.first}`
    ) as HTMLButtonElement;
    buttonFirst.addEventListener("click", async () => {
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
      spanPage.textContent = `1`;
      LearningPage.currentPage = 1;
      buttonPrev.disabled = true;
      buttonFirst.disabled = true;
      if (buttonNext.disabled) {
        buttonNext.disabled = false;
        buttonLast.disabled = false;
      }
      await this.renderCardWords(1, LearningPage.currentGroup);
    });
  }
  //render dropdown for minigame's links
  private renderMiniGamesDropdown(className: string) {
    const content = createElement("div", `${className}-content`);
    const linkSprint = createElement(
      "a",
      `${className}-sprint-link`
    ) as HTMLLinkElement;
    const linkAudioChallenge = createElement(
      "a",
      `${className}-audio-challenge-link`
    ) as HTMLLinkElement;
    const miniGameSprint = createElement(
      "img",
      `${className}-sprint-image`
    ) as HTMLImageElement;
    const miniGameAudioChallenge = createElement(
      "img",
      `${className}-audio-challenge-image`
    ) as HTMLImageElement;
    const icon = document.querySelector(`.${className}`) as HTMLDivElement;
    linkSprint.href = "index.html#sprint";
    linkAudioChallenge.href = "index.html#audio-challenge";
    miniGameSprint.src = sprint_icon;
    miniGameAudioChallenge.src = audio_challenge_icon;
    linkSprint.append(miniGameSprint);
    linkAudioChallenge.append(miniGameAudioChallenge);
    content.append(linkAudioChallenge, linkSprint);
    icon.append(content);
    
    icon.addEventListener("click", () => {

        icon.classList.toggle("js-clicked");
        // add links to div
        const linkToAudioChallenge = icon.lastChild?.firstChild as HTMLLinkElement;
        const linkToSprint = icon.lastChild?.lastChild as HTMLLinkElement;
        //form href attribute for link
        linkToAudioChallenge.href =`#audio-challenge/page:${LearningPage.currentPage}/group:${LearningPage.currentGroup}`;
        linkToSprint.href =`#sprint/page:${LearningPage.currentPage}/group:${LearningPage.currentGroup}`;
    });
  }

  static resetPagination(pagButtons: PaginationButtons) {
    const buttonFirst = document.querySelector(
      `.${pagButtons.first}`
    ) as HTMLButtonElement;
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

    spanPage.textContent = `1`;
    if (buttonNext.disabled) {
      buttonNext.disabled = false;
      buttonLast.disabled = false;
    }
    if (!buttonPrev.disabled) {
      buttonPrev.disabled = true;
      buttonFirst.disabled = true;
    }
  }

  render() {
    const controls = new Controls("div", "controls");

    this.renderCardWords(1, 1).then(() => {
      LearningPage.divWrapper.append(controls.render()),
        this.container.insertAdjacentElement(
          "afterbegin",
          LearningPage.divWrapper
        );
      this.renderNextPage(controls.pagButtons);
      this.renderPrevPage(controls.pagButtons);
      this.renderLastPage(controls.pagButtons);
      this.renderFirstPage(controls.pagButtons);
      this.renderNewGroup(controls.dropdown, controls.pagButtons);
      this.renderMiniGamesDropdown(controls.miniGamesClass);
    });
    return this.container;
  }
}

export default LearningPage;

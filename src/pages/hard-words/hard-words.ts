import Page from "../../components/templates/page";
import Api from "../../components/api/api";
import Word, {
  AggregatedWord,
  AggregatedWords,
  API_URL,
} from "../../components/api/types";
import WordCard from "../../components/word-card/word-card";
import { createElement } from "../../components/utils/utils";
import HardWordsPageControls from "../../components/controls/controls_hard-words";

class HardWordsPage extends Page {
  classNameDiv: string;
  static divWrapper: HTMLDivElement;
  static wrapperClass:string;
  constructor(id: string) {
    super(id);
    this.classNameDiv = "";
    HardWordsPage.wrapperClass = "hard-words__wrapper";
    HardWordsPage.divWrapper = createElement(
      "div",
      HardWordsPage.wrapperClass
    ) as HTMLDivElement;
    HardWordsPage.divWrapper.setAttribute("data-page-group","1");

  }

  static CopyAggrWordToWord(aggrWord: AggregatedWord): Word {
    let oldAggregatedWord: AggregatedWord = {} as AggregatedWord;
    let newWord: Word = {} as Word;
    Object.assign(oldAggregatedWord, aggrWord);
    const tempId = oldAggregatedWord._id;
    delete oldAggregatedWord._id;
    Object.assign(newWord, oldAggregatedWord);
    newWord.id = tempId as string;
    return newWord;
  }

  async renderHardWords(group: number, className = "hard-words") {
    const api = new Api(API_URL);
    const hardWords: AggregatedWords[] | number = await api.getAggregatedWords(
      -1,
      group,
      "hard",
      600
    );
    const isDivExisting = document.querySelector(
      `.learning.learning_${className}`
    );
    const div = createElement("div", `learning learning_${className}`);
    this.classNameDiv = className;
    if (isDivExisting) isDivExisting.remove();
    if (Array.isArray(hardWords)) {
      hardWords[0].paginatedResults.forEach((word) => {
        const newWord = new WordCard(
          "div",
          `learning__word-card learning__card-word_${className}`,
          HardWordsPage.CopyAggrWordToWord(word),
          "js-added",
          ""
        );
        div.append(newWord.render());
      });
    }
    return div;
  }

  async renderNewGroup(classNameControls: string, classNameGroups: string) {
    const controls = document.querySelector(
      classNameControls
    ) as HTMLDivElement;
    const groups = document.querySelectorAll(
      `.${classNameGroups}`
    ) as NodeListOf<HTMLDivElement>;
    const mainDiv = document.querySelector(`.${HardWordsPage.wrapperClass}`) as HTMLDivElement;
    controls.addEventListener("click", async (e) => {
      const group = e.target as HTMLElement;
      if (
        group.classList.contains(classNameGroups) &&
        !group.classList.contains("js-clicked")
      ) {
        const chosenId = +(group.getAttribute("data-group") as string);
        mainDiv.setAttribute("data-page-group",chosenId.toString(10));
        const words = await this.renderHardWords(chosenId);
        groups.forEach((a) => {
          if (a.classList.contains("js-clicked")) a.classList.remove("js-clicked");
        });
        group.classList.add("js-clicked");
        HardWordsPage.divWrapper.insertAdjacentElement("afterbegin", words);
      }
    });
  }

  render(): HTMLElement {
    this.renderHardWords(1).then((r) => {
      const controls = new HardWordsPageControls(
        "div",
        `controls controls_${this.classNameDiv}`
      );
      HardWordsPage.divWrapper.append(r,controls.render())
      this.container.insertAdjacentElement("afterbegin", HardWordsPage.divWrapper);

      this.renderNewGroup(controls.groupsClassName, controls.groupClassName);
    });
    return this.container;
  }
}

export default HardWordsPage;

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
import LearningPage from "../learning/learning";
import Controls, { DropdownClasses } from "../../components/controls/controls";
import LoadingAnimation from "../../components/loading-animation/loading-animation";

class HardWordsPage extends LearningPage {
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

  async renderNewGroupWithHardWords(dropdown:DropdownClasses) {
    const controls = document.querySelector(
      `.${dropdown.div}`
    ) as HTMLDivElement;
    const mainDiv = document.querySelector(`.${HardWordsPage.wrapperClass}`) as HTMLDivElement;
    controls.addEventListener("click", async (e) => {
      let chosenId = this.dropdownAction(e,dropdown);
      if (chosenId){
        const loadingAnimation = new LoadingAnimation("div","loading-animation");
        HardWordsPage.divWrapper.append(loadingAnimation.render());
        mainDiv.setAttribute("data-page-group",chosenId);
        const words = await this.renderHardWords(+chosenId);
        loadingAnimation.stop();
        HardWordsPage.divWrapper.insertAdjacentElement("afterbegin", words);
      }
    });
  }

  render(): HTMLElement {
    this.renderHardWords(1).then((r) => {
      const controls = new HardWordsPageControls(
        "div",
        `controls controls_${this.classNameDiv}`,
        1
      );
      HardWordsPage.divWrapper.append(r,controls.render())
      this.container.insertAdjacentElement("afterbegin", HardWordsPage.divWrapper);

      this.renderNewGroupWithHardWords(controls.dropdown);
    });
    return this.container;
  }
}

export default HardWordsPage;

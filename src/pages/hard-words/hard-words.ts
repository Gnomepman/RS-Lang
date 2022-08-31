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
import { DropdownClasses } from "../../components/controls/controls";
import LoadingAnimation from "../../components/loading-animation/loading-animation";

class HardWordsPage extends LearningPage {
  classNameDiv: string;
  static emptyPage:HTMLDivElement;
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
    HardWordsPage.emptyPage = createElement(
      "div",
      "empty-page"
    ) as HTMLDivElement;

  }
// transforms object with type AggregatedWord to type Word
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
// render hard words
  async renderHardWords(group: number, className = "hard-words") {
    const api = new Api(API_URL);
    //get all    words for user with difficulty "hard" for specific group 
    const hardWords: AggregatedWords[] | number = await api.getAggregatedWords(
      -1,
      group,
      "hard",
      false,
      600
    );
    console.log("hardWords",hardWords)
    const isDivExisting = document.querySelector(
      `.learning.learning_${className}`
    );
    const div = createElement("div", `learning learning_${className}`);
    this.classNameDiv = className;
    // if words already had been rendered - remove them
    if (isDivExisting) isDivExisting.remove();
    if (Array.isArray(hardWords)) {
      // if user added words
      if (hardWords[0].paginatedResults.length){
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
    } else {
      console.log("empty");
      // if user doesn't have words
      HardWordsPage.emptyPage.textContent = "You don't have any hard words";
      div.append(HardWordsPage.emptyPage);
    }
    }
    return div;
  }

  async renderNewGroupWithHardWords(dropdown:DropdownClasses) {
    const controls = document.querySelector(
      `.${dropdown.div}`
    ) as HTMLDivElement;
    const mainDiv = document.querySelector(`.${HardWordsPage.wrapperClass}`) as HTMLDivElement;
    controls.addEventListener("click", async (e) => {
      // saving clicked group
      let chosenId = this.dropdownAction(e,dropdown);
      // is user clicked on group
      if (chosenId){
        //start animation for loading
        const loadingAnimation = new LoadingAnimation("div","loading-animation");
        // saving clicked group to session storage
        sessionStorage.setItem("currentGroupForHardWords",chosenId)
        HardWordsPage.divWrapper.parentElement?.append(loadingAnimation.render());
        mainDiv.setAttribute("data-page-group",chosenId);
        //rendering of words
        const words = await this.renderHardWords(+chosenId);
        loadingAnimation.stop();
        HardWordsPage.divWrapper.insertAdjacentElement("afterbegin", words);
      }
    });
  }

  render(): HTMLElement {
    const loadingAnimation = new LoadingAnimation("div","loading-animation");
    const savedGroup = sessionStorage.getItem("currentGroupForHardWords");
    //if group had been saved
    if (savedGroup) HardWordsPage.currentGroup = +savedGroup;
    console.log("currentGroup",HardWordsPage.currentGroup);
    //start animation and rendering of empty div
    this.container.append(loadingAnimation.render(),HardWordsPage.emptyDiv);
    this.renderHardWords(HardWordsPage.currentGroup).then((r) => {
      const controls = new HardWordsPageControls(
        "div",
        `controls controls_${this.classNameDiv}`,
        HardWordsPage.currentGroup
      );
      //remove empty div
      HardWordsPage.emptyDiv.remove();
      loadingAnimation.stop();
      HardWordsPage.divWrapper.append(r,controls.render())
      this.container.insertAdjacentElement("afterbegin", HardWordsPage.divWrapper);

      this.renderNewGroupWithHardWords(controls.dropdown);
    });
    return this.container;
  }
}

export default HardWordsPage;
